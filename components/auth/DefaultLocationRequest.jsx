import React, { useState } from "react";
import { Pressable, Text, TextInput, View, ScrollView } from "react-native";
import { DriverStyles } from "../styles";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Homestyles } from "../styles";
import envs from "../../config/env";
import { patch } from "../../utils/requests";
import * as SecureStore from "expo-secure-store";

export default function DefaultLocationRequest({ navigation }) {
  const { API_URL, GOOGLE_API_KEY } = envs;
  const [correctInput, setCorrectInput] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState("");
  const [defaultAddressCoordinates, setDefaultAddressCoordinates] = useState(
    {}
  );

  const handleConfirm = async () => {
    const id = await SecureStore.getItemAsync("id");
    const token = await SecureStore.getItemAsync("token");
    patch(`${API_URL}/users/${id}/location`, token, {
      defaultAddress,
      defaultLatitude: defaultAddressCoordinates.latitude,
      defaultLongitude: defaultAddressCoordinates.longitude
    }).then(() => {
      navigation.replace("Home");
    });
  };

  return (
    <View style={{ flex: 1, top: 100, margin: 10 }}>
      <Text
        style={{
          alignSelf: "center",
          fontFamily: "poppins-bold",
          fontSize: 25,
          textAlign: "center",
        }}
      >
        Ubicacion predeterminada
      </Text>
      <Text
        style={{
          alignSelf: "center",
          fontFamily: "poppins",
          fontSize: 15,
          textAlign: "center",
          marginTop: 10,
        }}
      >
        Esta ubicacion va a ser usada como predeterminada para tus viajes
      </Text>
      <View style={{ top: 60, height: 300 }}>
        <GooglePlacesAutocomplete
          styles={{ textInput: Homestyles.searchInput }}
          placeholder="Direccion Predeterminada"
          fetchDetails
          enablePoweredByContainer={false}
          textInputProps={{
            onChangeText: (_) => {
              setCorrectInput(false);
            },
          }}
          listEmptyComponent={() => (
            <View style={{ flex: 1 }}>
              <Text>No se encontraron resultados</Text>
            </View>
          )}
          onPress={(data, details) => {
            setDefaultAddressCoordinates({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });
            setDefaultAddress(data.description);
            setCorrectInput(true);
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
          }}
        />
      </View>
      {correctInput ? (
        <Pressable
          style={{ alignSelf: "center", marginTop: 100 }}
          onPress={() => {
            handleConfirm();
          }}
        >
          <Text style={{ fontFamily: "poppins", fontSize: 20 }}>Confirmar</Text>
        </Pressable>
      ) : (
        <Pressable
          style={{ alignSelf: "center", marginTop: 100 }}
          disabled={true}
        >
          <Text style={{ fontFamily: "poppins", fontSize: 20, color: "gray" }}>
            Confirmar
          </Text>
        </Pressable>
      )}
    </View>
  );
}
