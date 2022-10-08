import { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Homestyles } from "../styles";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const API_KEY = "AIzaSyCa-kIrd3qRNKDJuHylT3VdLywUwWRbgXQ";

export default function ConfirmationTravel() {
  const currentTravelData = useSelector((store) => store.travelDetailsData);
  const origin = currentTravelData.origin;
  const destination = currentTravelData.destination;
  const mapRef = useRef(null);

  const zoom = () => {
    mapRef.current.fitToSuppliedMarkers(["originMark", "destMark"], {
      edgePadding,
    });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <MapView
        ref={mapRef}
        style={Homestyles.map}
        provider={PROVIDER_GOOGLE}
        onMapReady={() => zoom()}
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
          />
        )}
      </MapView>
    </View>
  );
}

const edgePadding = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};
const INITIAL_POSITION = {
  latitude: -34.6035,
  longitude: -58.4611,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};
