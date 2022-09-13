import React, { useState } from "react";
import { View, Button, TextInput, Pressable, Text } from "react-native";
import styles from "../styles";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = () => {
    //TODO: Autorizacion y login
  };

  return (
    <View>
      <TextInput
        placeholder="email"
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        placeholder="password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />

      <Pressable style={styles.regButton} onPress={() => onSignIn()}>
        <Text style={styles.textButton}> Sign In </Text>
      </Pressable>
    </View>
  );
}
