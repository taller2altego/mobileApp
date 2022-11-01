import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Text, TextInput, View } from "react-native-web";
import { useDispatch } from "react-redux";
import { setDriverData } from "../../redux/actions/UpdateDriverData";
import { authPost } from "../../utils/requests";
import { DriverStyles } from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import envs from "../../config/env";

export default function Driver({ navigation }) {
  const [license, setLicense] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [model, setModel] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const { API_URL, _ } = envs;

  const confirmData = async () => {
    const id = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("token");
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
        <Text style={DriverStyles.driver_title}>
          Gracias por manejar con nosotros
        </Text>
        <Text style={DriverStyles.driver_subtitle}>
          Ingresa los siguientes datos para poder empezar a usar fiuber
        </Text>
      </View>
      <View style={DriverStyles.driver_inputs}>
        <TextInput
          style={DriverStyles.profile_input}
          onChangeText={setLicense}
          placeholder="N de Licencia"
        />
        <TextInput
          style={DriverStyles.profile_input}
          onChangeText={setLicensePlate}
          placeholder="N de Patente"
        />
        <TextInput
          style={DriverStyles.profile_input}
          onChangeText={setModel}
          placeholder="Modelo"
        />
        <Pressable onPress={confirmData} style={DriverStyles.confirm_button}>
          <Text style={DriverStyles.confirm_button_text}>Confirmar</Text>
        </Pressable>
      </View>
      <Text style={DriverStyles.error_modal}>{errorMessage}</Text>
    </View>
  );
}
