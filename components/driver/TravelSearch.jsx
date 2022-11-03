import { getItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import TravelFindedModal from "./TravelFindedModal";
import * as Location from "expo-location";
import envs from "../../config/env";

// modules
import { LandingStyles, modalStyles } from "../styles";
import { get } from "../../utils/requests";
import { setOriginDriver } from "../../redux/actions/UpdateTravelDetails";
import { updateLocale } from "moment/moment";

export default function TravelSearch({ navigation }) {
  const [modalTravelFindedVisible, setModalTravelFindedVisible] =
    useState(false);
  const [isSearching, setIsSearching] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({ location: null });
  let locationSubscription = null;
  const { API_URL, _ } = envs;

  useEffect(() => {
    (async () => {
      console.log("init");
      const { status } = await Location.requestForegroundPermissionsAsync();

      console.log(status);
      if (status !== "granted") {
        throw new Error(
          "No tiene permisos, consulte con altego para mas información"
        );
      } else {
        console.log("Approved!");
        updateDriverPosition();
      }
    })();
  }, []);

  const updateDriverPosition = () => {
    locationSubscription = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 10 },
      (location) => {
        setCurrentLocation({
          location: [location.coords.latitude, location.coords.longitude],
        });
      },
      (error) => {
        console.log("hay error aca"), console.log(error);
      }
    );
  };

  useEffect(() => {
    // TODO: agregar un estado para diferenciar el cambio del modal del cierre del modal.
    setIsSearching(true);
    const interval = setInterval(async () => {
      if (currentLocation.location === null) {
        return;
      }

      console.log(currentLocation.location);
      const travels = await get(
        `${API_URL}/travels?latitude=${currentLocation.location[0]}&longitude=${currentLocation.location[1]}`,
        token
      ).then(({ data }) => data.data);

      if (travels) {
        setIsSearching(false);
        setModalTravelFindedVisible(true);
        clearInterval(interval);
      }
    }, 10000);
  }, []);

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
