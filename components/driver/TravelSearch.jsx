import { getItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import TravelFindedModal from "./TravelFindedModal";
import * as Location from 'expo-location';

// modules
import { LandingStyles, modalStyles } from "../styles";
import { get } from "../../utils/requests";

export default function TravelSearch({ navigation }) {
  const [modalTravelFindedVisible, setModalTravelFindedVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({ location: undefined, reload: false });

  useEffect(() => {
    (async () => {
      console.log('init');
      const { status } = await Location.requestForegroundPermissionsAsync();

      console.log(status);
      if (status !== 'granted') {
        throw new Error('No tiene permisos, consulte con altego para mas información');
      } else {
        console.log('Approved!');
        const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        setCurrentLocation({
          location: [location.coords.latitude, location.coords.longitude],
          reload: false
        });
      }
    })();
  }, []);

  useEffect(() => {

    // TODO: agregar un estado para diferenciar el cambio del modal del cierre del modal.
    setIsSearching(true);
    const interval = setInterval(async () => {
      if (currentLocation.location === undefined) {
        return;
      }

      const token = await getItemAsync("token");

      const travels = await get(`http://10.0.2.2:5000/travels?latitude=${currentLocation.location[0]}&longitude=${currentLocation.location[1]}`, token)
        .then(({ data }) => data.data);

      if (travels) {
        setIsSearching(false);
        setModalTravelFindedVisible(true);
        clearInterval(interval);
      }
    }, 10000);
  }, [currentLocation]);

  const toggleTravelFindedModal = () => {
    setModalTravelFindedVisible(!modalTravelFindedVisible);
    setCurrentLocation({ ...currentLocation, reload: !currentLocation.reload });
  };

  const onCancelSearch = () => {
    navigation.navigate("Home");
  }

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      {modalTravelFindedVisible && <TravelFindedModal
        navigation={navigation}
        toggle={toggleTravelFindedModal}
        visible={modalTravelFindedVisible}
      >
      </TravelFindedModal>}
      <View style={[{ flex: 0.5, padding: 50 }]}>
        <Text style={{ fontSize: 32, padding: 25, paddingBottom: 10 }}>
          Buscando Viaje
        </Text>
        <View>
          {isSearching && <ActivityIndicator size={80} color="#000000" />}
        </View>
      </View>
      <View>
        <Pressable
          style={modalStyles.modal_button}
          onPress={onCancelSearch}>
          <Text>
            Volver
          </Text>
        </Pressable>
      </View>
    </View >
  );
}