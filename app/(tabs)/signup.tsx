import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Formik } from "formik";
import * as yup from "yup";
import { useRouter } from "expo-router";

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
  phoneNumber: yup.string()
    .matches(/^\+?\d{10,15}$/, "Invalid phone number")
    .required("Phone number is required"),
});

const SignUp = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Sign Up</Text>
        <Formik
          initialValues={{ firstName: '', lastName: '', email: '', phoneNumber: '', password: '' }}
          validationSchema={signUpSchema}
          onSubmit={(values) => {
            console.log(values);
            router.push("/");
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              {/* Full Name */}
              <TextInput
              style={styles.input}
              placeholder="First Name"
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              value={values.firstName}
              />
              {touched.firstName && errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName}
              />
              {touched.lastName && errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

              {/* Email */}
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              {errors.email && touched.email && (
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
              {errors.phoneNumber && touched.phoneNumber && (
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              )}

              {/* Password */}
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              {/* Submit Button */}
              <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                <Text style={styles.buttonText}>Sign Up</Text>
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
  },
  button: {
    backgroundColor: "#007aff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 280,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
