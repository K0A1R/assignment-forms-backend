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

const formSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "Name is too short"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Name is too short"),
  // ADD Email HERE -- REMOVE COMMENT AFTER
  // ADD Phone HERE -- REMOVE AFTER
  // ADD Job Title OR Date of Birth HERE -- REMOVE COMMENT AFTER
});

const form = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Form</Text>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
          }}
          validationSchema={formSchema}
          onSubmit={(values) => {
            console.log(values);
            router.push("/");
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View>
              {/* Form Fields */}
              <TextInput
                style={styles.input}
                placeholder="First Name"
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                value={values.firstName}
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                value={values.lastName}
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}
              {/* ADD Email HERE -- REMOVE COMMENT AFTER */}
              {/* ADD Phone HERE -- REMOVE AFTER */}
              {/* ADD Job Title OR Date of Birth HERE -- REMOVE COMMENT AFTER */}

              {/* Form Submit Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.buttonText}>Submit Form</Text>
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
