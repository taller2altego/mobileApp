import React, { useState } from "react";
import { Button, Modal, Pressable, Text, TextInput, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { post } from "../../utils/requests";
import { LandingStyles, modalStyles } from "../styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginModal({ ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSignIn = async () => {
    return post(`http://127.0.0.1:5000/login`, {
      email,
      password,
    })
      .then(({ data: { id, token } }) => {
        AsyncStorage.setItem("token", token);
        AsyncStorage.setItem("id", id);
        props.handler();
      }).catch((e) => setErrorMessage(e.response.data.message));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
    >
      <View style={modalStyles.modal_extern_view}>
        <View style={[modalStyles.modal_view]}>
          <Pressable onPress={props.toggle}>
            <Entypo name="cross" size={24} color="black" />
          </Pressable>
          <View style={[modalStyles.flex_modal]}>
            <TextInput
              style={[modalStyles.modal_input]}
              placeholder="Email"
              placeholderTextColor="#343437"
              onChangeText={(email) => setEmail(email)}
            />
            <TextInput
              style={[modalStyles.modal_input]}
              placeholder="Contraseña"
              placeholderTextColor="#343437"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
            <Pressable
              style={modalStyles.modal_button}
              onPress={() => onSignIn()}
            >
              <Text style={LandingStyles.textButton}>Login</Text>
            </Pressable>
            <Text
              style={modalStyles.error_modal}
            >
              {errorMessage}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
