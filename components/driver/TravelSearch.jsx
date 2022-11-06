import { getItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import TravelFindedModal from "./TravelFindedModal";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import envs from "../../config/env";

// modules
import { LandingStyles, modalStyles } from "../styles";
import { get } from "../../utils/requests";
import { setOriginDriver } from "../../redux/actions/UpdateUserTravelDetails";
import { updateLocale } from "moment/moment";

export default function TravelSearch({ navigation }) {
  const [modalTravelFindedVisible, setModalTravelFindedVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({ location: null });
  const [locationSubscription, setLocationSubscription] = useState(null);

  const { API_URL, _ } = envs;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error(
          "No tiene permisos, consulte con altego para mas información"
        );
      } else {
        await updateDriverPosition();
      }
    })();
  }, []);

  const updateDriverPosition = async () => {
    const options = { accuracy: Location.Accuracy.High, distanceInterval: 10 };
    const success = (location) => {
      const obj = {
        location: [location.coords.latitude, location.coords.longitude],
      };
      setCurrentLocation(obj);
    };

    const error = (error) => {
      console.log(error);
    };

    setLocationSubscription(await Location.watchPositionAsync(options, success, error));
  };

  useEffect(() => {
    // TODO: agregar un estado para diferenciar el cambio del modal del cierre del modal.
    setIsSearching(true);

    if (currentLocation.location === null) {
      return;
    }

    const interval = setInterval(async () => {
      const token = await SecureStore.getItemAsync("token");

      const url = `${API_URL}/travels?latitude=${currentLocation.location[0]}&longitude=${currentLocation.location[1]}`;
      const travels = await get(url, token)
        .then(({ data }) => {
          console.log(`Todos putos: ${JSON.stringify(data, undefined, 2)}`);
          return data.data;
        });

      if (travels) {
        setIsSearching(false);
        setModalTravelFindedVisible(true);
        clearInterval(interval);
        locationSubscription.remove();
      }
    }, 10000);

  }, [currentLocation]);

  const toggleTravelFindedModal = () => {
    setModalTravelFindedVisible(!modalTravelFindedVisible);
    setCurrentLocation({ ...currentLocation });
  };

  const onCancelSearch = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={{ flex: 1 }}>
      {modalTravelFindedVisible && (
        <TravelFindedModal
          navigation={navigation}
          toggle={toggleTravelFindedModal}
          visible={modalTravelFindedVisible}
        ></TravelFindedModal>
      )}
      <View style={[{ flex: 1, top: 200 }]}>
        <Text style={{ fontSize: 32, alignSelf: "center", paddingBottom: 50 }}>
          Buscando Viaje
        </Text>
        {isSearching && <ActivityIndicator size={80} color="#000000" />}
      </View>
      <View style={{ bottom: 200, alignSelf: "center" }}>
        <Pressable onPress={onCancelSearch}>
          <Text style={{ fontSize: 25, fontFamily: "poppins" }}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}
