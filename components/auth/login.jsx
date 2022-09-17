import React, { useState } from "react";
import { Button, Modal, Pressable, Text, TextInput, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { post } from "../../utils/requests";
import { LandingStyles, modalStyles } from "../styles";
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
      <View style={modalStyles.modal_extern_view}>
        <View style={[modalStyles.modal_view]}>
          <Pressable onPress={props.toggle}>
            <Entypo name="cross" size={24} color="black" />
          </Pressable>
          <View style={[modalStyles.flex_modal]}>
            <TextInput
              style={[modalStyles.modal_input]}
              placeholder="email"
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
          </View>
        </View>
      </View>
    </Modal>
  );
}
