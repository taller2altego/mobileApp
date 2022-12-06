import { useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import CheckBox from "expo-checkbox";
import { MapStyles, TravelStyles, modalStyles, customMap } from "../styles";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as SecureStore from "expo-secure-store";
import MapViewDirections from "react-native-maps-directions";
import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  StyleSheet,
  Switch,
  ToastAndroid,
} from "react-native";
import WaitingModal from "./Waiting";
import { useDispatch, useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { authPost, get, handlerUnauthorizedError } from "../../utils/requests";
import { setNewTravel } from "../../redux/actions/UpdateCurrentTravel";
import envs from "../../config/env";
import { Ionicons } from "@expo/vector-icons";

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
  // redux
  const currentTravelData = useSelector((store) => store.travelDetailsData);
  const currentUserData = useSelector((store) => store.userData);

  const origin = currentTravelData.origin;
  const destination = currentTravelData.destination;

  const dispatch = useDispatch();

  // states
  const [payWithCreditsBox, setPayWithCredits] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);
  const date = new Date().toISOString();

  const [modalWaitingVisible, setModalWaitingVisible] = useState(false);
  const { API_URL, GOOGLE_API_KEY } = envs;
  const mapRef = useRef(null);

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
      console.log('antes de hacer el request a price');
      await get(`${API_URL}/price/${id}`, token, null, params)
        .then(({ data }) => {
          setPrice(data.data.price.toFixed(8));
        })
        .catch((err) => handlerUnauthorizedError(navigation, err));
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
    const srcAddress = await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        origin.latitude +
        "," +
        origin.longitude +
        "&key=" +
        GOOGLE_API_KEY
    )
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.results[0].formatted_address;
      });
    const dstAddress = await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        destination.latitude +
        "," +
        destination.longitude +
        "&key=" +
        GOOGLE_API_KEY
    )
      .then((response) => response.json())
      .then((responseJson) => responseJson.results[0].formatted_address);

    const pushToken = await SecureStore.getItemAsync("pushToken");

    const body = {
      userId: id,
      email: currentUserData.email,
      source: origin,
      sourceAddress: srcAddress,
      destination: destination,
      destinationAddress: dstAddress,
      paidWithCredits: payWithCreditsBox,
      token: pushToken,
      price,
      date
    };

    return authPost(`${API_URL}/travels`, token, body)
      .then(({ data }) => {
        dispatch(setNewTravel({ _id: data.data._id }));
        setModalWaitingVisible(!modalWaitingVisible);
      })
      .catch((error) => {
        ToastAndroid.showWithGravity(
          "No hay suficientes fondos!",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        return handlerUnauthorizedError(navigation, error);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {modalWaitingVisible && (
        <WaitingModal navigation={navigation}></WaitingModal>
      )}
      <MapView
        ref={mapRef}
        style={MapStyles.map}
        provider={PROVIDER_GOOGLE}
        onMapLoaded={() => {
          zoomOnDirections();
        }}
        initialRegion={INITIAL_POSITION}
        customMapStyle={customMap}
      >
        {origin ? (
          <Marker
            coordinate={origin}
            identifier="originMark"
            pinColor="black"
          >
            <View style={{ backgroundColor: "white", padding:3, borderWidth:1  }}>
              <Text style={{fontFamily: "poppins"}}>Origen</Text>
            </View>
          </Marker>
        ) : (
          <></>
        )}
        {destination ? (
          <Marker
          coordinate={destination}
          identifier="destMark"
          pinColor="black"
        >
          <View style={{ backgroundColor: "white",  padding: 3,  borderWidth:1 }}>
            <Text style={{fontFamily: "poppins"}}>Destino</Text>
          </View>
        </Marker>
        ) : (
          <></>
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
      <Ionicons
        name="arrow-back"
        size={30}
        color="black"
        style={{ position: "absolute", top: 20, left: 5 }}
        onPress={() => navigation.navigate("Home")}
      />
      <View style={MapStyles.tripInfoContainer}>
        <View>
          <Image
            style={{ width: 150, height: 100, bottom: 10 }}
            source={{
              uri: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_896,h_504/f_auto,q_auto/products/carousel/UberX.png",
            }}
          />
        </View>

        <View style={{ paddingRight: 20 }}>
          <Text style={{ fontFamily: "poppins", fontSize: 15 }}>
            {duration} min
          </Text>
          <Text style={{ fontFamily: "poppins", fontSize: 15 }}>
            {distance} km
          </Text>
          <Text style={{ fontFamily: "poppins", fontSize: 15 }}>
            {price.toFixed(6)} Ethereum (est.)
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontFamily: "poppins" }}>Utilizar FIUCreditos</Text>
        <Switch
          trackColor={{ false: "grey", true: "black" }}
          thumbColor={"white"}
          onValueChange={(newValue) => setPayWithCredits(newValue)}
          value={payWithCreditsBox}
        />
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
      <View></View>
    </View>
  );
}
