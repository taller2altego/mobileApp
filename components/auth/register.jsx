import React, { useState, useEffect } from "react";
import { View, Button, TextInput, Pressable, Text } from "react-native";
import { post } from "../../utils/requests";
import styles from "../styles";


export default function Register({ navigation, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignUp = () => {
    return post("http://127.0.0.1:5001/users", { username: email, password })
      .then(({ data: { id } }) => navigation.navigate("Login", { id }));
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

