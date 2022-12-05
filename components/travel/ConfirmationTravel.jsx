import { useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import CheckBox from 'expo-checkbox';
import { MapStyles, TravelStyles, modalStyles } from "../styles";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as SecureStore from "expo-secure-store";
import MapViewDirections from "react-native-maps-directions";
import { View, Text, Pressable, Image, Modal, StyleSheet } from "react-native";
import WaitingModal from "./Waiting";
import { useDispatch, useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { authPost, get, handlerUnauthorizedError } from "../../utils/requests";
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
  // redux
  const currentTravelData = useSelector((store) => store.travelDetailsData);
  const currentUserData = useSelector((store) => store.userData);

  const origin = currentTravelData.origin;
  const destination = currentTravelData.destination;

  const dispatch = useDispatch();

  // states
  const [payWithCreditsBox, setPayWithCredits] = useState(false)
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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
      await get(`${API_URL}/price/${id}`, token, null, params)
        .then(({ data }) => {
          setPrice(data.data.price)
        })
        .catch(err => handlerUnauthorizedError(navigation, err));
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
      .then((responseJson) => responseJson.results[0].formatted_address);

    const body = {
      paidWithCredits: true,
      userId: id,
      email: currentUserData.email,
      price: 0.001,
      // price: price,
      source: origin,
      sourceAddress: srcAddress,
      destination: destination,
      destinationAddress: dstAddress,
      date: date,
      paidWithCredits: payWithCreditsBox,
    };

    return authPost(`${API_URL}/travels`, token, body)
      .then(({ data }) => {
        dispatch(setNewTravel({ _id: data.data._id }));
        setModalWaitingVisible(!modalWaitingVisible);
      })
      .catch((error) => {
        setModalVisible(true);
        return handlerUnauthorizedError(navigation, error)
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
        <View style={{
          right: 0,
          width: 75,
          height: 50,
          margin: 10,
          marginTop: 12,
          zIndex: 100,
        }}>
          <Text>
            FIUCreditos
          </Text>
          <CheckBox
            tintColors={{ true: '#F15927', false: 'black' }}
            style={{ left: 25, marginTop: 10 }}
            value={payWithCreditsBox}
            onValueChange={(newValue) => setPayWithCredits(newValue)}
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
            {price.toFixed(6)} Ethereum (est.)
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
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={modalStyles.centered_view}>
              <View style={modalStyles.modal_view_travel}>
                <Text style={modalStyles.text_modal_style}>Fondos Insuficientes </Text>
                <Pressable
                  style={[modalStyles.button, modalStyles.button_close]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={modalStyles.text_style}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
        <View>
        </View>
      </View>
    </View>
  );
}