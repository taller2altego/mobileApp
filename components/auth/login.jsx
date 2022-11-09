import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { post } from "../../utils/requests";
import { LandingStyles, modalStyles } from "../styles";
import { Entypo } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import envs from "../../config/env";

export default function LoginModal({ navigation, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { API_URL, _ } = envs;

  const onSignIn = () => {
    return post(`${API_URL}/login`, {
      email,
      password
    })
      .then(async (info) => {
        console.log(info);
        const { data: { id, token } } = info;
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("id", id.toString());
        props.toggle();
        props.navigation.navigate("Home");
      })
      .catch(e => {
        const errMessage = e.response && e.response.data && e.response.data.message || e.message;
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
          <View style={[modalStyles.flex_modal, { fontFamily: "poppins" }]}>
            <TextInput
              style={[modalStyles.modal_input, { fontFamily: "poppins" }]}
              placeholder="Email"
              value={email}
              placeholderTextColor="#343437"
              onChangeText={(email) => setEmail(email)}
            />
            <TextInput
              style={[modalStyles.modal_input, { fontFamily: "poppins" }]}
              placeholder="Contraseña"
              placeholderTextColor="#343437"
              value={password}
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
            <View style={LandingStyles.land_buttons_login}>
              <Pressable
                onPress={() => navigation.navigate("RecoverPassword")
                }
              >
                <Text
                  style={[LandingStyles.simpleText, { fontFamily: "poppins" }]}
                >
                  Forgot Password
                </Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("AuthToken")
                }
              >
                <Text
                  style={[LandingStyles.simpleText, { fontFamily: "poppins" }]}
                >
                  Have a Token
                </Text>
              </Pressable>
            </View>

            <Text style={[modalStyles.error_modal, { fontFamily: "poppins" }]}>{errorMessage}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

