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

import { Formik } from "formik";
import * as yup from "yup";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { useAuth } from "../../authContext";

const signUpSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "Name is too short"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Name is too short"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&#]/, "Must include a special character"),
  phoneNumber: yup
    .string()
    .matches(/^\+?\d{10,15}$/, "Invalid phone number")
    .required("Phone number is required"),
});

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSignUp = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      // Create user with email/password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        createdAt: new Date().toISOString(),
      });
    } catch (error: any) {
      let errorMessage = "Sign up failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is invalid.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to form if already logged in
  useEffect(() => {
    if (user) {
      router.push("/form");
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Sign Up</Text>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
          }}
          validationSchema={signUpSchema}
          onSubmit={handleSignUp}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
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

              {/* Password */}
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              {/* Sign In Link */}
              <TouchableOpacity
                onPress={() => router.push("/signin")}
                style={styles.linkContainer}
              >
                <Text style={styles.linkText}>
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#007aff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 280,
    alignItems: "center",
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#007aff",
    fontSize: 14,
  },
});
