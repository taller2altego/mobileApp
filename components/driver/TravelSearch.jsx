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
import { useDispatch, useSelector } from "react-redux";
import { setNewTravel } from "../../redux/actions/UpdateCurrentTravel";

export default function TravelSearch({ navigation }) {
  const [modalTravelFindedVisible, setModalTravelFindedVisible] =
    useState(false);
  const dispatch = useDispatch();
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
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      };
      setCurrentLocation(obj);
    };

    const error = (error) => {
      console.log(error);
    };

    setLocationSubscription(
      await Location.watchPositionAsync(options, success, error)
    );
  };

  useFocusEffect(useCallback(() => {
    setIsSearching(true);

    if (currentLocation.location === null) {
      return;
    }

    const interval = setInterval(async () => {
      const token = await SecureStore.getItemAsync("token");
      const url = `${API_URL}/travels?latitude=${currentLocation.location.latitude}&longitude=${currentLocation.location.longitude}`;
      const travels = await get(url, token).then(({ data }) => {
        dispatch(
          setTravelDetails({
            origin: currentLocation.location,
            destination: data.data.destination,
          })
        );
        dispatch(
          setTravelInfo({
            originAddress: data.data.sourceAddress,
            destinationAddress: data.data.destinationAddress,
          })
        );
        dispatch(setUserLocation({
          userLocation: data.data.source,
        }));
        dispatch(setNewTravel({
          _id: data.data._id,
        }));
        return data;
      }).catch(error => handlerUnauthorizedError(navigation, error));

      if (travels) {
        setIsSearching(false);
        setModalTravelFindedVisible(true);
        clearInterval(interval);
      }
    }, 10000);
    return () => {
      clearInterval(interval);
      locationSubscription.remove();
    };
  }, [currentLocation]));

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
