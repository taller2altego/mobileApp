import { useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapStyles, TravelStyles } from "../styles";
import MapViewDirections from "react-native-maps-directions";
import { View, Text, Pressable, Image } from "react-native";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { get } from "../../utils/requests";
import * as SecureStore from "expo-secure-store";

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

export default function TravelInProgress({ navigation }) {
  const currentTravelData = useSelector((store) => store.travelDetailsData);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [driver, setDriver] = useState("Raul Gomez");
  const [modalWaitingVisible, setModalWaitingVisible] = useState(false);
  const origin = currentTravelData.origin;
  const destination = currentTravelData.destination;

  // origen -- actual conductor hasta llegar a la casa del chabon
  // destino -- casa del chabon

  // origen actual posicion del conductor con el chabon, inicial en domicilio del chabon
  // destino -- travel.destination

  // const driverId = await SecureStore.getItemAsync("id");
  // const token = await SecureStore.getItemAsync("token");
  // get()

  const cancelTravel = (navigation) => {
    // request para eliminar el viaje en el travel
    // limpiar inputs de destino y origen en main
    navigation.navigate("Home");
  };

  const mapRef = useRef(null);
  const [fontsLoaded] = useFonts({
    poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
    "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  // const onDriverSearch = () => {
  //   navigation.navigate("DriverSearch");
  // };

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
        </View>
      </View>
      <View style={TravelStyles.travelContainer}>
        <View style={TravelStyles.buttonContainer}>
          <Pressable
            style={MapStyles.confirmTripButton}
            onPress={() => navigation.navigate("ProfileVisualization")}
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
