import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";

const form = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>form</Text>
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
});
