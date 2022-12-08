import { useCallback, useRef, useState } from "react";
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { MapStyles, customMap } from "../styles";
import MapViewDirections from "react-native-maps-directions";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import envs from "../../config/env";
import * as Location from "expo-location";
import { authPost, get, handlerUnauthorizedError } from "../../utils/requests";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const { API_URL, GOOGLE_API_KEY } = envs;

export default function TravelInProgressDriver({ navigation }) {
  // refs
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  // redux
  const tripData = useSelector((store) => store.travelDetailsData);
  const travelData = useSelector((store) => store.currentTravel);

  // state
  const [actualTripState, setActualTripState] = useState({
    currentLoc: {
      latitude: tripData.origin.latitude,
      longitude: tripData.origin.longitude,
    },
    destinationCoords: {
      latitude: tripData.destination.latitude,
      longitude: tripData.destination.longitude,
    },
    userCoords: {
      latitude: tripData.userLocation.latitude,
      longitude: tripData.userLocation.longitude,
    },
    animatedcoords: new AnimatedRegion({
      latitude: tripData.origin.latitude,
      longitude: tripData.origin.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  });
  const [arriveOnUserLocation, setArriveOnUserLocation] = useState(false);
  const [arriveOnDestination, setArriveOnDestination] = useState(false);
  const [roadTofinalDestination, setRoadTofinalDestination] = useState(false);

  const updateDriverPosition = async () => {
    return setInterval(async () => {
      const data = await SecureStore
        .getItemAsync('updatingLocation')
        .then(location => location === null ? null : JSON.parse(location))
        .then(location => {

          if (location === null) {
            return null;
          }

          return { latitude: location.driverLocation.latitude, longitude: location.driverLocation.longitude };
        });

      if (data === null) {
        return null;
      }

      const { latitude, longitude } = data

      animate(latitude, longitude);
      setActualTripState({
        ...actualTripState,
        currentLoc: { latitude, longitude }
      });
    }, 20000);
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (markerRef.current) {
      actualTripState.animatedcoords.timing(newCoordinate).start();
      mapRef.current.animateToRegion({
        latitude: newCoordinate.latitude,
        longitude: newCoordinate.longitude,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA,
      });
    }
  };

  useFocusEffect(
    useCallback(async () => {
      const interval = await updateDriverPosition();
      return () => {
        clearInterval(interval);
      };
    }, [])
  );

  const updateDistance = (args, tripPart) => {
    const setArrive =
      tripPart === "start" ? setArriveOnUserLocation : setArriveOnDestination;
    if (args.distance.toFixed(2) < 0.10) {
      setArrive(true);
    } else {
      setArrive(false);
    }
  };

  const startTrip = async () => {
    const id = await SecureStore.getItemAsync("id");
    const token = await SecureStore.getItemAsync("token");
    setRoadTofinalDestination(true);
    setArriveOnUserLocation(false);
    authPost(`${API_URL}/travels/${travelData._id}/start`, token)
  };

  const finishTravel = async () => {
    const id = await SecureStore.getItemAsync("id");
    const token = await SecureStore.getItemAsync("token");
    await SecureStore.deleteItemAsync("updatingLocation");

    const travel = await get(`${API_URL}/travels/${travelData._id}`, token);
    const body = {
      driverId: travel.data.data.driverId,
      price: travel.data.data.price,
      paidWithCredits: true,
      payToDriver: true,
    };

    return authPost(`${API_URL}/travels/${travelData._id}/finish`, token, body).then(navigation.navigate("UserProfileVisualization"));
  };

  const cancelTravel = async () => {
    await SecureStore.deleteItemAsync("updatingLocation");
    const token = await SecureStore.getItemAsync("token");
    const travel = await get(`${API_URL}/travels/${travelData._id}`, token);
    const user = await get(`${API_URL}/users/${travel.data.data.userId}`, token)
    const body = {
      userId: travel.data.data.userId,
      email: user.data.email,
      price: travel.data.data.price,
      paidWithCredits: travel.data.data.paidWithCredits,
      payToDriver: false,
    };
    return authPost(`${API_URL}/travels/${travelData._id}/reject?isTravelCancelled='true'`, token, body)
      .then(() => navigation.replace("Home"))
      .catch(error => handlerUnauthorizedError(navigation, error));
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: "#eee" }}>
      <MapView
        ref={mapRef}
        style={MapStyles.mapDriverComing}
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMap}
        initialRegion={{
          latitude: tripData.origin.latitude,
          longitude: tripData.origin.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <Marker.Animated
          ref={markerRef}
          coordinate={actualTripState.animatedcoords}
          image={require("../../assets/car.png")}
        />
        <Marker
          coordinate={actualTripState.destinationCoords}
          identifier="destMark"
          image={require("../../assets/flag.png")}
        />
        {!roadTofinalDestination && (
          <Marker
            coordinate={actualTripState.userCoords}
            identifier="userMark"
            image={require("../../assets/user.png")}
          />
        )}
        {!roadTofinalDestination &&
          actualTripState.currentLoc &&
          actualTripState.userCoords && (
            <MapViewDirections
              apikey={GOOGLE_API_KEY}
              origin={actualTripState.currentLoc}
              destination={actualTripState.userCoords}
              strokeColor="black"
              optimizeWaypoints={true}
              strokeWidth={5}
              onReady={(args) => updateDistance(args, "start")}
            />
          )}
        {actualTripState.userCoords && actualTripState.destinationCoords && (
          <MapViewDirections
            apikey={GOOGLE_API_KEY}
            origin={
              roadTofinalDestination
                ? actualTripState.currentLoc
                : actualTripState.userCoords
            }
            destination={actualTripState.destinationCoords}
            strokeColor="black"
            optimizeWaypoints={true}
            strokeWidth={5}
            onReady={(args) => updateDistance(args, "end")}
          />
        )}
      </MapView>
      {arriveOnUserLocation ? (
        <Pressable onPress={startTrip} style={{ backgroundColor: "black", padding: 5, width: "70%", alignSelf: "center", marginTop: 10 }}>
          <Text style={{ fontFamily: "poppins", color: "white", textAlign: "center" }}> INICIAR VIAJE </Text>
        </Pressable>
      ) : (
        <></>
      )}
      {arriveOnDestination ? (
        <Pressable onPress={finishTravel} style={{ backgroundColor: "black", padding: 5, width: "70%", alignSelf: "center", marginTop: 10 }}>
          <Text style={{ fontFamily: "poppins", color: "white", textAlign: "center" }}> FINALIZAR VIAJE </Text>
        </Pressable>
      ) : (
        <></>
      )}
      {!roadTofinalDestination ? <Pressable onPress={cancelTravel} style={{ backgroundColor: "#aaa", padding: 5, width: "70%", alignSelf: "center", marginTop: 10 }}>
        <Text style={{ fontFamily: "poppins", color: "white", textAlign: "center" }}> CANCELAR </Text>
      </Pressable> : <></>}
    </View>
  );
}
