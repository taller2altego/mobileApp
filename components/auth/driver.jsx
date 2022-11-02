import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import { setDriverData } from "../../redux/actions/UpdateDriverData";
import { authPost } from "../../utils/requests";
import { DriverStyles } from "../styles";
import * as SecureStore from "expo-secure-store";
import envs from "../../config/env";

export default function Driver({ navigation }) {
  const [license, setLicense] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [model, setModel] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const { API_URL, _ } = envs;

  const confirmData = async () => {
    const id = await SecureStore.getItemAsync("id");
    const token = await SecureStore.getItemAsync("token");
    authPost(`${API_URL}/users/${id}/driver`, token, {
      license,
      model,
      licensePlate,
    })
      .then(() => {
        dispatch(
          setDriverData({
            license: license,
            model: model,
            licensePlate: licensePlate,
          })
        );
        navigation.navigate("Home");
      })
      .catch((error) => setErrorMessage(error.response.data.message));
  };

  return (
    <View style={DriverStyles.driver_container}>
      <View style={DriverStyles.driver_text}>
        <Text style={[DriverStyles.driver_title, { fontFamily: "poppins" }]}>
          Gracias por manejar con nosotros
        </Text>
        <Text style={[DriverStyles.driver_subtitle, { fontFamily: "poppins" }]}>
          Ingresa los siguientes datos para poder empezar a usar fiuber
        </Text>
      </View>
      <View style={DriverStyles.driver_inputs}>
        <TextInput
          style={[DriverStyles.profile_input, { fontFamily: "poppins" }]}
          onChangeText={setLicense}
          placeholder="N de Licencia"
        />
        <TextInput
          style={[DriverStyles.profile_input, { fontFamily: "poppins" }]}
          onChangeText={setLicensePlate}
          placeholder="N de Patente"
        />
        <TextInput
          style={[DriverStyles.profile_input, { fontFamily: "poppins" }]}
          onChangeText={setModel}
          placeholder="Modelo"
        />
        <Pressable onPress={confirmData} style={DriverStyles.confirm_button}>
          <Text
            style={[
              DriverStyles.confirm_button_text,
              { fontFamily: "poppins" },
            ]}
          >
            Confirmar
          </Text>
        </Pressable>
      </View>
      <Text style={DriverStyles.error_modal}>{errorMessage}</Text>
    </View>
  );
}
