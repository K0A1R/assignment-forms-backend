// form
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { auth, db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../../authContext";

const formSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "Name is too short"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Name is too short"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^\+?\d{10,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  dob: yup
    .date()
    .required("Date of Birth is required")
    .test("age", "You must be at least 18 years old", (value) => {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= 18;
    }),
});

const form = () => {
  const router = useRouter();
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmitForm = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dob: string;
  }) => {
    setLoading(true);
    try {
      if (!user) {
        Alert.alert("Error", "You must be logged in to submit this form");
        router.push("/signin");
        return;
      }

      await addDoc(collection(db, "formSubmissions"), {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        dob: values.dob,
        userId: user.uid,
        submittedAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Form submitted successfully!");
      router.push("/");
    } catch (error: any) {
      Alert.alert("Error", "Failed to submit form. Please try again.");
      console.error("Error submitting form: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Form</Text>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            dob: "",
          }}
          validationSchema={formSchema}
          onSubmit={handleSubmitForm}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            values,
            errors,
            touched,
          }) => (
            <View>
              {/* First Name */}
              <TextInput
                style={styles.input}
                placeholder="First Name"
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                value={values.firstName}
              />
              {touched.firstName && errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}

              {/* Last Name */}
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                value={values.lastName}
              />
              {touched.lastName && errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}

              {/* Email */}
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              {/* Phone Number */}
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                onChangeText={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                value={values.phoneNumber}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              )}

              {/* DOB Selection */}
              {Platform.OS === "web" ? (
                <View style={styles.webDatePickerContainer}>
                  <DatePicker
                    selected={values.dob ? new Date(values.dob) : null}
                    onChange={(date) => {
                      if (date) {
                        const formattedDate = date.toISOString().split("T")[0];
                        setFieldValue("dob", formattedDate);
                        setFieldTouched("dob", true);
                      }
                    }}
                    dateFormat="yyyy-MM-dd"
                    showYearDropdown
                    showMonthDropdown
                    scrollableYearDropdown
                    dropdownMode="select"
                    placeholderText="Select Date of Birth"
                    className="custom-datepicker-input"
                  />
                  {errors.dob && touched.dob && (
                    <Text style={styles.errorText}>{errors.dob}</Text>
                  )}
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={{ color: values.dob ? "black" : "gray" }}>
                      {values.dob
                        ? new Date(values.dob).toDateString()
                        : "Select Date of Birth"}
                    </Text>
                  </TouchableOpacity>
                  {errors.dob && touched.dob && (
                    <Text style={styles.errorText}>{errors.dob}</Text>
                  )}

                  {showPicker && (
                    <DateTimePicker
                      value={values.dob ? new Date(values.dob) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate) {
                          const formattedDate = selectedDate
                            .toISOString()
                            .split("T")[0];
                          setFieldValue("dob", formattedDate);
                          setFieldTouched("dob", true);
                        }
                      }}
                    />
                  )}
                </>
              )}

              {/* Form Submit Button */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Submit Form</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default form;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: 280,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#FFFFFF",
  },
  webDatePickerContainer: {
    width: 280,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginVertical: 5,
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#007aff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 280,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
