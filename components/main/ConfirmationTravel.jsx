import { useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Homestyles } from "../styles";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";


const API_KEY = "AIzaSyCa-kIrd3qRNKDJuHylT3VdLywUwWRbgXQ";

export default function ConfirmationTravel() {
  const currentUserData = useSelector((store) => store.travelDetailsData);
  const mapRef = useRef(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const zoom = () => {
    if (origin && destination) {
      mapRef.current.fitToCoordinates([origin, destination], { edgePadding });
    }
  };

  const moveTo = async (position) => {
    const camera = await mapRef.current.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current.animateCamera(camera, { duration: 1000 });
    }
  };

  const handleLocation = (details) => {
    const position = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    };

    moveTo(position);
    zoom();
  };

  setOrigin(currentUserData.srcDetails);
  handleLocation(currentUserData.srcDetails);
  setDestination(currentUserData.destDetails);
  handleLocation(currentUserData.destDetails);


  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <MapView
        ref={mapRef}
        style={Homestyles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_POSITION}
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
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