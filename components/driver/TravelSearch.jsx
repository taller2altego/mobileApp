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
import {
  setTravelDetails,
  setTravelInfo,
  setUserLocation,
} from "../../redux/actions/UpdateTravelDetails";
import { useDispatch, useSelector } from "react-redux";
import * as TaskManager from "expo-task-manager";
import { createNewTask, FETCH_TRAVEL, addNewTask } from "../../utils/Tasks";
import * as BackgroundFetch from "expo-background-fetch";

export default function TravelSearch({ navigation }) {
  const [modalTravelFindedVisible, setModalTravelFindedVisible] =
    useState(false);
  const dispatch = useDispatch();
  const [isSearching, setIsSearching] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({ location: null });
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [newTravel, setNewTravel] = useState(null);

  const { API_URL, _ } = envs;

  const fetchTravels = async () => {
    const token = await SecureStore.getItemAsync("token");
      const url = `${API_URL}/travels?latitude=${currentLocation.location.latitude}&longitude=${currentLocation.location.longitude}`;
      console.log("HAGO REQUEST");
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
        setNewTravel(data);
      });

  }

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

  useEffect(() => {
    addNewTask(FETCH_TRAVEL, fetchTravels);
    // TODO: agregar un estado para diferenciar el cambio del modal del cierre del modal.
    setIsSearching(true);

    if (currentLocation.location === null) {
      return;
    }

    const interval = setInterval(fetchTravels, 10000);
    createNewTask(FETCH_TRAVEL);
    if (newTravel) {
      setIsSearching(false);
      setModalTravelFindedVisible(true);
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
      locationSubscription.remove();
    };
  }, [currentLocation, newTravel]);

  const toggleTravelFindedModal = () => {
    setModalTravelFindedVisible(!modalTravelFindedVisible);
    setNewTravel(null);
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
