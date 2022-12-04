import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";

// // modules
import TravelFindedModal from "./TravelFindedModal";
import { getItemAsync } from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import TravelFindedModal from "./TravelFindedModal";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import envs from "../../config/env";
import { useFocusEffect } from '@react-navigation/native';
// modules
import { get, handlerUnauthorizedError } from "../../utils/requests";
import {
  setTravelDetails,
  setTravelInfo,
  setUserLocation,
} from "../../redux/actions/UpdateTravelDetails";
import { setNewTravel } from "../../redux/actions/UpdateCurrentTravel";

export default function TravelSearch({ navigation }) {
  const [modalTravelFindedVisible, setModalTravelFindedVisible] = useState(false);

  const dispatch = useDispatch();
  const [isSearching, setIsSearching] = useState(true);

  useFocusEffect(useCallback(() => {
    setIsSearching(true);

    console.log(1);

    (async () => {
      await SecureStore.setItemAsync('askForTravel', 'true');
    })();

    console.log(2);

    const interval = setInterval(async () => {

      const flag = await SecureStore.getItemAsync('askForTravel').then(res => res === 'false');
      if (flag) {
        return;
      }

      const response = await SecureStore.getItemAsync("travelInfo").then(response => response ? JSON.parse(response) : null);

      if (response !== null) {

        await SecureStore.setItemAsync('askForTravel', 'false');
        const { driverLocation, ...travel } = response;
        
        // destino actual del conductor
        dispatch(setTravelDetails({ origin: driverLocation, destination: travel.destination }));
        // modal
        dispatch(setTravelInfo({ originAddress: travel.sourceAddress, destinationAddress: travel.destinationAddress }));
        // para mostrar en el mapa
        dispatch(setUserLocation({ userLocation: travel.source }));
        // setea el id del viaje para aceptar/cancelar/actualizar posicion
        dispatch(setNewTravel({ _id: data.data._id }));

        setModalTravelFindedVisible(!modalTravelFindedVisible);
      }
    }, 10000);

    return () => {
      setIsSearching(false);
      setModalTravelFindedVisible(true);
      clearInterval(interval);
    };

  }, []));

  const toggleCancel = async () => {
    setModalTravelFindedVisible(!modalTravelFindedVisible);
    await SecureStore.setItemAsync('askForTravel', 'true');
    await SecureStore.deleteItemAsync('travelInfo');
  }

  const toggleAccept = () => {
    setModalTravelFindedVisible(!modalTravelFindedVisible);
  };

  const onCancelSearch = async () => {
    await SecureStore.setItemAsync('askForTravel', 'false');
    await SecureStore.deleteItemAsync('travelInfo');
    navigation.navigate("Home");
  };

  return (
    <View style={{ flex: 1 }}>
      {
        modalTravelFindedVisible && (
          <TravelFindedModal navigation={navigation} toggleAccept={toggleAccept} toggleCancel={toggleCancel} visible={modalTravelFindedVisible}> </TravelFindedModal>
        )
      }

      <View style={[{ flex: 1, top: 200 }]}>
        <Text style={{ fontSize: 32, alignSelf: "center", paddingBottom: 50 }}> Buscando Viaje </Text>

        {isSearching && <ActivityIndicator size={80} color="#000000" />}
      </View>
      <View style={{ bottom: 200, alignSelf: "center" }}>
        <Pressable onPress={onCancelSearch}>
          <Text style={{ fontSize: 25, fontFamily: "poppins" }}> Cancelar </Text>
        </Pressable>
      </View>
    </View>
  );
}