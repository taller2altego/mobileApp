import { useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapStyles, TravelStyles } from "../styles";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as SecureStore from "expo-secure-store";
import MapViewDirections from "react-native-maps-directions";
import { View, Text, Pressable, Image } from "react-native";
import WaitingModal from "./Waiting";
import { useDispatch, useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { authPost, get } from "../../utils/requests";
import { setNewTravel } from "../../redux/actions/UpdateCurrentTravel";
import envs from "../../config/env";
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

export default function ConfirmationTravel({ navigation }) {
  // export default function ConfirmationTravel({ navigation }) {
  // redux
  const currentTravelData = useSelector((store) => store.travelDetailsData);
  const origin = currentTravelData.origin;
  const destination = currentTravelData.destination;

  const dispatch = useDispatch();

  // states
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);
  const date = new Date().toISOString();

  const [modalWaitingVisible, setModalWaitingVisible] = useState(false);
  const { API_URL, GOOGLE_API_KEY } = envs;
  const mapRef = useRef(null);
  const [fontsLoaded] = useFonts({
    "poppins": require("../../assets/fonts/Poppins-Regular.ttf"),
    "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  const updateTripProps = async (args) => {
    if (args) {
      setDistance(args.distance.toFixed(2));
      setDistance((stateDistance) => {
        return stateDistance;
      });
      setDuration(Math.ceil(args.duration));
      setDuration((stateDuration) => {
        return stateDuration;
      });

      const params = {
        date: date,
        distance: args.distance.toFixed(2),
        duration: Math.ceil(args.duration),
        paymentMethod: "Ether",
      };
      const id = await SecureStore.getItemAsync("id");
      const token = await SecureStore.getItemAsync("token");
      await get(`${API_URL}/price/${id}`, token, null, params).then(({ data }) => {
        setPrice(data.data.price)
      });
    }
  };

  const zoomOnDirections = () => {
    mapRef.current.fitToSuppliedMarkers(["originMark", "destMark"], {
      animated: true,
      edgePadding: edgePadding,
    });
  };

  const createTravel = async (navigation) => {
    const id = await SecureStore.getItemAsync("id");
    const token = await SecureStore.getItemAsync("token");
    const srcAddress = await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + origin.latitude + ',' + origin.longitude + '&key=' + GOOGLE_API_KEY)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.results[0].formatted_address
      });
    const dstAddress = await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + destination.latitude + ',' + destination.longitude + '&key=' + GOOGLE_API_KEY)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.results[0].formatted_address
      });
    const body = {
      paidWithCredits: true,
      userId: id,
      price: price,
      source: origin,
      sourceAddress: srcAddress,
      destination: destination,
      destinationAddress: dstAddress,
      date: date,
    };

    return authPost(`${API_URL}/travels`, token, body)
      .then(({ data }) => {
        dispatch(setNewTravel({ _id: data.data._id }));
        setModalWaitingVisible(!modalWaitingVisible);
      });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {modalWaitingVisible && <WaitingModal navigation={navigation}></WaitingModal>}
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
        <View style={{ paddingLeft: 35 }}>
          <Image
            style={MapStyles.carImage}
            source={{
              uri: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_896,h_504/f_auto,q_auto/products/carousel/UberX.png",
            }}
          />
        </View>
        <View style={{ paddingRight: 20 }}>
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
            {price} ARS (est.)
          </Text>
        </View>
      </View>
      <View style={TravelStyles.travelContainer}>
        <View style={TravelStyles.buttonContainer}>
          <Pressable
            style={MapStyles.confirmTripButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text
              style={{
                fontFamily: "poppins-bold",
                color: "white",
                textAlign: "center",
                lineHeight: 38,
              }}
            >
              Volver atras
            </Text>
          </Pressable>
        </View>
        <View style={TravelStyles.buttonContainer}>
          <Pressable
            style={MapStyles.confirmTripButton}
            onPress={() => createTravel(navigation)}
          >
            <Text
              style={{
                fontFamily: "poppins-bold",
                color: "white",
                textAlign: "center",
                lineHeight: 38,
              }}
            >
              Iniciar Viaje
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
