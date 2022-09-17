import React, { useState } from "react";
import { Button, Modal, Pressable, Text, TextInput, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { post } from "../../utils/requests";
import styles from "../styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Entypo } from "@expo/vector-icons";

export default function LoginModal({ navigation, id, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = async () => {
    //FIXME Hacer el request cuando el exista el endpoint de log
    await SecureStore.setItemAsync("token", "1234");
    navigation.navigate("Home", { id });
    /*return get(`http:/127.0.0.1:5001/users/${id}`)
      .then(({ data: { token } }) => SecureStore.setItemAsync("token", token))
      .then(() => {
        navigation.navigate("Home");
      });*/
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
    >
      <View style={styles.centeredView2}>
        <View style={[styles.modal_view]}>
          <Pressable onPress={props.toggle}>
            <Entypo name="cross" size={24} color="black" />
          </Pressable>
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
      </View>
    </Modal>
  );
}
