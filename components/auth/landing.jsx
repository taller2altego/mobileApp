import React from "react";
import { Text, View, Button, Pressable } from "react-native";

import styles from "../styles";

export default function Landing({ navigation }) {
  return (
    <View style={styles.end}>
      <Pressable
        style={styles.regButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.textButton}> Register </Text>
      </Pressable>
      <Pressable
        style={styles.regButton}
        title="Login"
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.textButton}> Login </Text>
      </Pressable>
    </View>
  );
}
