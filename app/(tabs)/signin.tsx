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

const signInSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
});

const SignIn = () => {
  const router = useRouter();

  return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.header}>Sign In</Text>
          <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={signInSchema}
              onSubmit={(values) => {
                console.log(values);
                router.push("/");
              }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>

                  <TextInput
                      style={styles.input}
                      placeholder="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                  />
                  {errors.email && touched.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                  )}


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


                  <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                    <Text style={styles.buttonText}>Sign In</Text>
                  </TouchableOpacity>


                  <TouchableOpacity onPress={() => router.push("/signup")}>
                    <Text style={styles.linkText}>
                      Don't have an account? Sign up
                    </Text>
                  </TouchableOpacity>
                </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
  );
};

export default SignIn;

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
  linkText: {
    color: "#007aff",
    textAlign: "center",
    marginTop: 15,
  },
});