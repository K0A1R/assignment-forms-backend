import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";

const signin = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>signin</Text>
      </View>
    </SafeAreaView>
  );
};

export default signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
