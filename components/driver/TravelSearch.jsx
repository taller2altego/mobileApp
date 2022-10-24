import { getItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import TravelFindedModal from "./TravelFindedModal";
import * as Location from 'expo-location';

// modules
import { get } from "../../utils/requests";

export default function TravelSearch() {
  const [modalTravelFindedVisible, setModalTravelFindedVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(true);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        throw new Error('No tiene permisos, consulte con altego para mas información');
      }

      const location = await Location.getCurrentPositionAsync({});

      setCurrentLatitude(location.coords.latitude);
      setCurrentLongitude(location.coords.longitude);

      console.log(location.coords);

      console.log(currentLatitude);
      console.log(currentLongitude);
    })();
  }, []);

  useEffect(() => {

    setIsSearching(true);
    const interval = setInterval(async () => {
      if (currentLatitude === 0 || currentLongitude === 0) {
        return;
      }
      const token = await getItemAsync("token");

      const travels = await get(`http://localhost:5000/travels?latitude=${currentLatitude}&longitude=${currentLongitude}`, token)
        .then(({ data }) => data.data);

      if (travels) {
        setIsSearching(false);
        setModalTravelFindedVisible(true);
        clearInterval(interval);
      }
    }, 10000);
  }, [modalTravelFindedVisible]);

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      {modalTravelFindedVisible && <TravelFindedModal
        navigation={navigation}
        visible={modalTravelFindedVisible}
        setModalTravelFindedVisible={setModalTravelFindedVisible}
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
    </View >
  );
}