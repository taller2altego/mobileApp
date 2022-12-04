import { useRef, useState, useEffect, useCallback } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapStyles, TravelStyles } from "../styles";
import MapViewDirections from "react-native-maps-directions";
import { View, Text, Pressable, Image } from "react-native";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { get, authPost } from "../../utils/requests";
import * as SecureStore from "expo-secure-store";
import envs from "../../config/env";
import { useFocusEffect } from '@react-navigation/native';

const PRICE_PER_KM = 100;

const edgePadding = {
  top: 100,
  right: 100,
  bottom: 100,
  left: 100,
};

const INITIAL_POSITION = {
  latitude: -34.6035,
  longitude: -58.4611,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function DriverIncoming({ navigation }) {
  // redux
  const travelDetailsData = useSelector((store) => store.travelDetailsData);
  const origin = travelDetailsData.origin;
  const destination = travelDetailsData.destination;

  const currentTravelData = useSelector((store) => store.currentTravel);
  const travelId = currentTravelData._id;
  const driverId = currentTravelData.driverId;

  // states
  const [currentOrigin, setCurrentOrigin] = useState(origin);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [interval, setRequestInterval] = useState(null);
  const [driver, setDriver] = useState("");

  const { API_URL, GOOGLE_API_KEY } = envs;

  const mapRef = useRef(null);

  useFocusEffect(useCallback(() => {
    let interval = setInterval(async () => {
      const token = await SecureStore.getItemAsync("token");

      await get(`${API_URL}/travels/${travelId}/driver`, token).then(
        ({ data }) => {
          const position = data.data.currentDriverPosition;
          setCurrentOrigin(position);

          // TODO: seguro la posicion final, no sea igual... calcular un aproximado
          const isSameLat = position.latitude == destination.latitude;
          const isSameLong = position.longitude == destination.longitude;
          if (isSameLat && isSameLong) {
            navigation.navigate("TravelInProgress");
          }
        }
      );
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []));

  const cancelTravel = async () => {
    clearInterval(interval);
    let token = await SecureStore.getItemAsync("token");
    const travel = await get(`${API_URL}/travels/${travelId}`, token);
    const body = {
      driverId: travel.data.data.driverId,
      price: travel.data.data.price,
      paidWithCredits: true,
      payToDriver: false,
    };
    return authPost(`${API_URL}/travels/${travelId}/reject?isTravelCancelled='true'`, token, body)
      .then(navigation.navigate("Home"))
      .catch(error => functionError(navigation, error));
  };

  const [fontsLoaded] = useFonts({
    poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
    "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  const updateTripProps = (args) => {
    if (args) {
      setDistance(args.distance.toFixed(2));
      setDuration(Math.ceil(args.duration));
    }
  };

  const zoomOnDirections = () => {
    mapRef.current.fitToSuppliedMarkers(["originMark", "destMark"], {
      animated: true,
      edgePadding: edgePadding,
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <MapView
        ref={mapRef}
        style={MapStyles.map}
        provider={PROVIDER_GOOGLE}
        onMapLoaded={() => {
          zoomOnDirections();
        }}
        initialRegion={INITIAL_POSITION}
      >
        {origin && <Marker coordinate={origin} identifier="originMark" />}
        {destination && (
          <Marker coordinate={destination} identifier="destMark" />
        )}
        {currentOrigin && <Marker coordinate={currentOrigin} identifier="s" />}
        {origin && destination && (
          <MapViewDirections
            apikey={GOOGLE_API_KEY}
            origin={origin}
            destination={destination}
            strokeColor="black"
            strokeWidth={5}
            onReady={updateTripProps}
          />
        )}
      </MapView>
      <View style={MapStyles.tripInfoContainer}>
        <View style={{ paddingLeft: 35 }}></View>
        <Image
          style={MapStyles.carImage}
          source={{
            uri: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_896,h_504/f_auto,q_auto/products/carousel/UberX.png",
          }}
        />
        <View style={{ paddingRight: 20 }}>
          <Text style={{ fontFamily: "poppins", fontSize: 15 }}>
            {" "}
            Driver: {driver}
          </Text>
          <Text style={{ fontFamily: "poppins", fontSize: 15 }}>
            {" "}
            {distance} km
          </Text>
          <Text style={{ fontFamily: "poppins", fontSize: 15 }}>
            {" "}
            {duration} min{" "}
          </Text>
        </View>
      </View>
      <View style={TravelStyles.travelContainer}>
        <View style={TravelStyles.buttonContainer}>
          <Pressable
            style={MapStyles.confirmTripButton}
            onPress={() => cancelTravel(navigation)}
          >
            <Text
              style={{
                fontFamily: "poppins-bold",
                color: "white",
                textAlign: "center",
                lineHeight: 38,
              }}
            >
              Cancelar viaje
            </Text>
          </Pressable>
        </View>
        <View style={TravelStyles.buttonContainer}>
          <Pressable
            style={MapStyles.confirmTripButton}
            onPress={() => navigation.push("DriverProfileVisualization")}
          >
            <Text
              style={{
                fontFamily: "poppins-bold",
                color: "white",
                textAlign: "center",
                lineHeight: 38,
              }}
            >
              Visualizar Chofer
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
