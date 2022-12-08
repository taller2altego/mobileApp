import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { post } from "../../utils/requests";
import { LandingStyles, modalStyles } from "../styles";
import { Entypo } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setIsDriver, setUserData } from "../../redux/actions/UpdateUserData";
import * as SecureStore from "expo-secure-store";
import envs from "../../config/env";

export default function RegisterModal({ ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { API_URL, _ } = envs;

  const validateInputs = () => {
    let validInputs = true;
    [email, password, phone, name, lastname].map((input) => {
      if (input.trim().length === 0) {
        validInputs = false
      }
    })

    return validInputs
  }

  const onSignUp = () => {
    const signUpBody = {
      name,
      lastname,
      phoneNumber: Number(phone),
      email,
      password,
      role: "user",
    };

    if (!validateInputs()) {
      setErrorMessage("Todos los campos son obligatorios");
      return;
    }

    setErrorMessage("");
    const loginBody = { email, password };

    return post(`${API_URL}/users`, signUpBody)
      .then(() => post(`${API_URL}/login`, loginBody))
      .then(async ({ data }) => {
        await SecureStore.setItemAsync("token", data.token);
        return data;
      })
      .then((data) => SecureStore.setItemAsync("id", data.id.toString()))
      .then(() => {
        props.toggle();
        props.navigation.replace("DefaultLocationRequest");
      })
      .catch((error) => {
        console.log(error)
        setErrorMessage(JSON.stringify(error.response.data.message));
      });
  };

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={modalStyles.modal_extern_view}>
        <View style={[modalStyles.modal_view]}>
          <Pressable onPress={props.toggle}>
            <Entypo
              name="cross"
              size={26}
              color="black"
              style={{ left: 5, top: 5 }}
            />
          </Pressable>
          <View style={[modalStyles.flex_modal]}>
            <TextInput
              style={modalStyles.modal_input}
              placeholder="Nombre"
              placeholderTextColor="black"
              onChangeText={(name) => setName(name)}
            />
            <TextInput
              style={modalStyles.modal_input}
              placeholder="Apellido"
              placeholderTextColor="black"
              onChangeText={(password) => setLastName(password)}
            />
            <TextInput
              style={modalStyles.modal_input}
              placeholder="Email"
              placeholderTextColor="black"
              keyboardType="email-address"
              onChangeText={(email) => setEmail(email)}
            />
            <TextInput
              style={modalStyles.modal_input}
              placeholder="Telefono"
              placeholderTextColor="black"
              keyboardType="numeric"
              onChangeText={(phone) => {
                setPhone(phone);
              }}
            />
            <TextInput
              style={modalStyles.modal_input}
              placeholder="Contraseña"
              placeholderTextColor="black"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
            <Pressable
              style={({ pressed }) => [
                modalStyles.modal_button,
                { backgroundColor: pressed ? "#333" : "black" },
              ]}
              onPress={() => onSignUp()}
            >
              <Text
                style={[LandingStyles.textButton, { fontFamily: "poppins" }]}
              >
                Sign Up
              </Text>
            </Pressable>
            <Text style={[modalStyles.error_modal, { fontFamily: "poppins" }]}>
              {errorMessage}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
