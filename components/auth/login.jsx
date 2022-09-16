import React, { useState } from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { post } from "../../utils/requests";
import styles from "../styles";

export default function Login({ navigation, id }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = () => {
    return get(`http:/127.0.0.1:5001/users/${id}`)
      .then(({ data: { token } }) => localStorage.setItem(token))
      .then(() => {
        navigation.navigate("Home");
      });
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
        <Text style={styles.textButton}>Sign In</Text>
      </Pressable>
    </View>
  );
}
