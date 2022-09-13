import React, { useState } from "react";
import { View, Button, TextInput, Pressable, Text } from "react-native";
import styles from "../styles";

export default function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignUp = () => {
    //TODO: Autorizacion y registro
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
      <Pressable style={styles.regButton} onPress={() => onSignUp()}>
        <Text style={styles.textButton}> Sign Up </Text>
      </Pressable>
    </View>
  );
}

