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

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useAuth } from "../../authContext";

const signInSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
});

const SignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSignIn = async (values: { email: string; password: string }) => {
    setLoading(true);
    // Sign in with Email and Password
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
    } catch (error: any) {
      let errorMessage = "Sign in failed. Please try again.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is invalid.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Account temporarily locked.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to form if user is already signed in
  useEffect(() => {
    if (user) {
      router.push("/form");
    }
  }, [user]);

  return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.header}>Sign In</Text>
          <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={signInSchema}
              onSubmit={handleSignIn}
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

                  {/* Sign In Button */}
                  <TouchableOpacity
                      style={[styles.button, loading && styles.buttonDisabled]}
                      onPress={() => handleSubmit()}
                      disabled={loading}
                  >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>Sign In</Text>
                    )}
                  </TouchableOpacity>

                  {/* Sign Up Link */}
                  <TouchableOpacity
                      style={styles.linkContainer}
                      onPress={() => router.push("/signup")}
                  >
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
