// modules
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useCallback, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from '@react-navigation/native';
// files
import TravelFindedModal from "./TravelFindedModal";
import { setTravelDetails, setTravelInfo, setUserLocation } from "../../redux/actions/UpdateTravelDetails";
import { useDispatch } from "react-redux";
import { setNewTravel } from "../../redux/actions/UpdateCurrentTravel";

export default function TravelSearch({ navigation }) {
  const [modalTravelFindedVisible, setModalTravelFindedVisible] = useState(false);

  const dispatch = useDispatch();
  const [isSearching, setIsSearching] = useState(true);

  useFocusEffect(useCallback(() => {
    setIsSearching(true);

    (async () => {
      await SecureStore.setItemAsync('askForTravel', 'true');
    })();

    const interval = setInterval(async () => {
      const flag = await SecureStore.getItemAsync('askForTravel').then(res => res === 'false');
      if (flag) {
        return;
      }

      const response = await SecureStore.getItemAsync("travelInfo").then(response => response ? JSON.parse(response) : null);
      if (response !== null) {
        await SecureStore.setItemAsync('askForTravel', 'false');
        const { driverLocation, ...travel } = response;

        if (Object.keys(travel).length === 0) {
          ToastAndroid.showWithGravity(
            "No se han encontrado viajes!",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
          await SecureStore.setItemAsync('askForTravel', 'false');
          await SecureStore.deleteItemAsync('travelInfo');
          navigation.navigate("Home");
        }

        // destino actual del conductor
        dispatch(setTravelDetails({
          origin: {
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude
          },
          destination: travel.destination
        }));
        // modal
        dispatch(setTravelInfo({ originAddress: travel.sourceAddress, destinationAddress: travel.destinationAddress }));
        // para mostrar en el mapa
        dispatch(setUserLocation({ userLocation: travel.source }));
        // setea el id del viaje para aceptar/cancelar/actualizar posicion
        dispatch(setNewTravel({ _id: response._id, userId: response.userId }));

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
    // cierro el modal y sigo preguntando por viajes, elimino el travel info para que no me sugiera el mismo,
    // salvo que el backend lo sugiera.
    setModalTravelFindedVisible(!modalTravelFindedVisible);
    await SecureStore.setItemAsync('askForTravel', 'true');
    await SecureStore.deleteItemAsync('travelInfo');
  }

  const toggleAccept = async () => {
    // Limpio la data del storage que guarda el viaje para un estado limpio.
    await SecureStore.deleteItemAsync('travelInfo');
    setModalTravelFindedVisible(!modalTravelFindedVisible);
  };

  const onCancelSearch = async () => {
    // vuelvo a la vista main
    // limpio travel info y dejo de pedir viajes.
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
        <Text style={{ fontSize: 32, alignSelf: "center", paddingBottom: 50, fontFamily: "poppins" }}> Buscando Viaje </Text>

        {isSearching && <ActivityIndicator size={70} color="#000000" />}
      </View>
      <View style={{ bottom: 200, alignSelf: "center" }}>
        <Pressable onPress={onCancelSearch} style={{ borderColor: "black" }}>
          <Text style={{ fontSize: 25, fontFamily: "poppins" }}> Cancelar </Text>
        </Pressable>
      </View>
    </View>
  );
}
