import { useEffect, useRef, useState, useCallback } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Homestyles } from "../styles";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import { View, Text, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

const API_KEY = "AIzaSyCa-kIrd3qRNKDJuHylT3VdLywUwWRbgXQ";
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

export default function ConfirmationTravel() {
  const currentTravelData = useSelector((store) => store.travelDetailsData);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const origin = currentTravelData.origin;
  const destination = currentTravelData.destination;
  const mapRef = useRef(null);
  useFonts({
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

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={Homestyles.map}
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
        {origin && destination && (
          <MapViewDirections
            apikey={API_KEY}
            origin={origin}
            destination={destination}
            strokeColor="black"
            strokeWidth={5}
            onReady={updateTripProps}
          />
        )}
      </MapView>
      <View
        style={{
          flex: 1,
          alignItems: "flex-end",
          padding: 40,
          backgroundColor: "white",
        }}
      >
        <Text style={{ fontFamily: "poppins", fontSize: 15 }}>
          {" "}
          {duration} min{" "}
        </Text>
        <Text style={{ fontFamily: "poppins", fontSize: 15 }}>
          {" "}
          {distance} km
        </Text>
        <Text style={{ fontFamily: "poppins", fontSize: 15 }}>
          {" "}
          {distance * PRICE_PER_KM} ARS (est.)
        </Text>
        <Pressable style={{ alignSelf: "center" }}>
          <Text style={{ fontFamily: "poppins-bold" }}>Iniciar Viaje</Text>
        </Pressable>
      </View>
    </View>
  );
}
