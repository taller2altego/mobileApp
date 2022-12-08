import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import { setDriverData } from "../../redux/actions/UpdateDriverData";
import { authPost, handlerUnauthorizedError } from "../../utils/requests";
import { setIsDriver } from "../../redux/actions/UpdateUserData";
import { DriverStyles, modalStyles, LandingStyles } from "../styles";
import * as SecureStore from "expo-secure-store";
import envs from "../../config/env";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAvoidingView } from "react-native-web";

export default function Driver({ navigation }) {
  const [license, setLicense] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [model, setModel] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const { API_URL, _ } = envs;

  const validateInputs = () => {
    let validInputs = true;
    [licensePlate, license, model].map((input) => {
      if (input.trim().length === 0) {
        validInputs = false
      }
    })

    return validInputs
  }

  const confirmData = async () => {
    if (!validateInputs()) {
      setErrorMessage("Todos los campos son obligatorios");
      return;
    }

    const id = await SecureStore.getItemAsync("id");
    const token = await SecureStore.getItemAsync("token");
    authPost(`${API_URL}/users/${id}/driver`, token, {
      license,
      model,
      licensePlate,
    })
      .then(async ({ data }) => {
        await SecureStore.setItemAsync("driverId", data.id.toString());
        dispatch(setDriverData({ license, model, licensePlate }));
        dispatch(setIsDriver({ isDriver: true }));
        setErrorMessage("");
        navigation.replace("Home");
      })
      .catch((error) => {
        handlerUnauthorizedError(navigation, error);
        setErrorMessage(error);
      });
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <View style={{ flex: 1, top: "10%" }}>
        <Text style={[DriverStyles.driver_title, { fontFamily: "poppins" }]}>
          Gracias por manejar con nosotros
        </Text>
        <Text style={[DriverStyles.driver_subtitle, { fontFamily: "poppins" }]}>
          Ingresa los siguientes datos para poder empezar a usar fiuber
        </Text>
      </View>
      <View style={{ flex: 4, justifyContent: "space-evenly" }}>
        <TextInput
          style={{
            fontFamily: "poppins",
            borderWidth: 1,
            borderRadius: 3,
            paddingLeft: 10,
            fontSize: 15,
            height: 40,
          }}
          onChangeText={setLicense}
          placeholder="N de Licencia"
        />
        <TextInput
          style={{
            fontFamily: "poppins",
            borderWidth: 1,
            borderRadius: 3,
            paddingLeft: 10,
            fontSize: 15,
            height: 40,
          }}
          onChangeText={setLicensePlate}
          placeholder="N de Patente"
        />
        <TextInput
          style={{
            fontFamily: "poppins",
            borderWidth: 1,
            borderRadius: 3,
            paddingLeft: 10,
            fontSize: 15,
            height: 40,
          }}
          onChangeText={setModel}
          placeholder="Modelo"
        />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Pressable
          style={({ pressed }) => [
            modalStyles.modal_button,
            { backgroundColor: pressed ? "#333" : "black" },
          ]}
          onPress={confirmData}
        >
          <Text style={[LandingStyles.textButton, { fontFamily: "poppins" }]}>
            Confirmar
          </Text>
        </Pressable>
      </View>
      <Text style={DriverStyles.error_modal}>{errorMessage}</Text>
    </View>
  );
}
