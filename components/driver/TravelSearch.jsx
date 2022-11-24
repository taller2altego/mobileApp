import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
// import { useDispatch } from "react-redux";

// import * as Location from "expo-location";
// import * as TaskManager from 'expo-task-manager';

// // modules
// import envs from "../../config/env";
// import TravelFindedModal from "./TravelFindedModal";
// import { get } from "../../utils/requests";
// import {
//   setTravelDetails,
//   setTravelInfo,
//   setUserLocation,
// } from "../../redux/actions/UpdateTravelDetails";
// import { createNewTask, FETCH_TRAVEL, addNewTask } from "../../utils/Tasks";

// const updateDriverPosition = async () => {
//   const options = { accuracy: Location.Accuracy.High, distanceInterval: 10 };
//   const success = (location) => {
//     const obj = {
//       location: {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       },
//     };
//     console.log(obj);
//     // setCurrentLocation(obj);
//   };

//   const error = (error) => {
//     console.log(error);
//   };

//   return await Location.watchPositionAsync(options, success, error);
// };

export default function TravelSearch({ navigation }) {
  // const [modalTravelFindedVisible, setModalTravelFindedVisible] =
  //   useState(false);
  // const dispatch = useDispatch();
  // const [isSearching, setIsSearching] = useState(true);
  // const [currentLocation, setCurrentLocation] = useState({ location: null });
  // const [locationSubscription, setLocationSubscription] = useState(null);
  const [newTravel, setNewTravel] = useState(null);

  // const { API_URL, _ } = envs;

  useEffect(() => {
    (async () => {
      await SecureStore.setItemAsync('askForTravel', 'true');
    })();

    const interval = setInterval(async () => {
      const response = await SecureStore.getItemAsync("travelInfo")
        .then(response => JSON.parse(response));
        console.log(response);
        setNewTravel(response);
    }, 10000);

    if (newTravel) {
      clearInterval(interval);
    }

  }, [newTravel]);

  // const fetchTravels = async () => {
  //   const token = await SecureStore.getItemAsync("token");
  //     const url = `${API_URL}/travels?latitude=${currentLocation.location.latitude}&longitude=${currentLocation.location.longitude}`;
  //     console.log("HAGO REQUEST");
  //     const travels = await get(url, token).then(({ data }) => {
  //       dispatch(
  //         setTravelDetails({
  //           origin: currentLocation.location,
  //           destination: data.data.destination,
  //         })
  //       );
  //       dispatch(
  //         setTravelInfo({
  //           originAddress: data.data.sourceAddress,
  //           destinationAddress: data.data.destinationAddress,
  //         })
  //       );
  //       dispatch(setUserLocation({
  //         userLocation: data.data.source,
  //       }));
  //       setNewTravel(data);
  //     });
  // }

  // useEffect(() => {
  //   // addNewTask(FETCH_TRAVEL, fetchTravels);
  //   // TODO: agregar un estado para diferenciar el cambio del modal del cierre del modal.
  //   setIsSearching(true);     

  //   if (currentLocation.location === null) {
  //     return;
  //   }

  //   const interval = setInterval(fetchTravels, 10000);
  //   // createNewTask(FETCH_TRAVEL);
  //   if (newTravel) {
  //     setIsSearching(false);
  //     setModalTravelFindedVisible(true);
  //     clearInterval(interval);
  //   }

  //   return () => {
  //     clearInterval(interval);
  //     locationSubscription.remove();
  //   };
  // }, [currentLocation, newTravel]);

  // const toggleTravelFindedModal = () => {
  //   setModalTravelFindedVisible(!modalTravelFindedVisible);
  //   setNewTravel(null);
  //   setCurrentLocation({ ...currentLocation });
  // };

  // const onCancelSearch = () => {
  //   navigation.navigate("Home");
  // };

  return (
    <View style={{ flex: 1 }}>
      <Text> hola </Text>
      {/* {modalTravelFindedVisible && (
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
      </View> */}
    </View>
  );
}
