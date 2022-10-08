import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { post } from "../../utils/requests";
import { LandingStyles, modalStyles } from "../styles";
import { Entypo } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

export default function LoginModal({ ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSignIn = async () => {
    return post(`http://10.0.2.2:5000/login`, {
      email,
      password
    })
      .then(async ({ data: { id, token } }) => {
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("id", id.toString());
        props.toggle();
        props.navigation.navigate("Home");
      })
      .catch(e => {
        const errMessage = e.response && e.response.data && e.response.data || e.message;
        setErrorMessage(errMessage);
      });
  };

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={[modalStyles.modal_extern_view, { fontFamily: "poppins" }]}>
        <View style={[modalStyles.modal_view, { fontFamily: "poppins" }]}>
          <Pressable onPress={props.toggle}>
            <Entypo name="cross" size={24} color="black" />
          </Pressable>
          <View style={[modalStyles.flex_modal]}>
            <TextInput
              style={[modalStyles.modal_input, { fontFamily: "poppins" }]}
              placeholder="Email"
              placeholderTextColor="#343437"
              onChangeText={(email) => setEmail(email)}
            />
            <TextInput
              style={[modalStyles.modal_input, { fontFamily: "poppins" }]}
              placeholder="Contraseña"
              placeholderTextColor="#343437"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
            <Pressable
              style={modalStyles.modal_button}
              onPress={() => onSignIn()}
            >
              <Text
                style={[LandingStyles.textButton, { fontFamily: "poppins" }]}
              >
                Login
              </Text>
            </Pressable>
            <Text style={modalStyles.error_modal}>{errorMessage}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
