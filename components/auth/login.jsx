import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { post } from "../../utils/requests";
import { LandingStyles, modalStyles } from "../styles";
import { Entypo } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';


export default function LoginModal({ ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSignIn = async () => {
    return post(`http://10.0.2.2:5000/login`, {
      email,
      password,
    })
      .then(({ data: { id, token } }) => {
        SecureStore.setItemAsync("token", token);
        SecureStore.setItemAsync("id", id);
        props.toggle();
        props.navigation.navigate("Home");
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
