import { useRef, useState, useCallback, useEffect } from "react";
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapStyles, TravelStyles, modalStyles, customMap } from "../styles";
import MapViewDirections from "react-native-maps-directions";
import { View, Text, Pressable, Image, Modal, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import envs from "../../config/env";
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from "expo-secure-store";
import { get } from "../../utils/requests";

const edgePadding = {
  top: 100,
  right: 100,
  bottom: 100,
  left: 100,
};

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function TravelInProgress({ navigation }) {
  const currentTravelData = useSelector((store) => store.travelDetailsData);
  const userMarkerRef = useRef();
  const travelDetails = useSelector((store) => store.currentTravel);
  const mapRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [modalFinishVisible, setModalFinishVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState({
    currentLoc: {
      latitude: currentTravelData.origin.latitude,
      longitude: currentTravelData.origin.longitude,
    },
    animatedCoords: new AnimatedRegion({
      latitude: currentTravelData.origin.latitude,
      longitude: currentTravelData.origin.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    })
  })
  
  const origin = currentTravelData.origin;
  const destination = currentTravelData.destination;
  const travelId = travelDetails._id;
  const driverId = currentTravelData.driverId;

  const { API_URL, GOOGLE_API_KEY } = envs;

  useFocusEffect(useCallback(() => {
    let interval = setInterval(async () => {
      const token = await SecureStore.getItemAsync("token");

      await get(`${API_URL}/travels/${travelId}/driver`, token).then(({ data }) => {
        if (data.data.isFinished) {
          setModalFinishVisible(true);
        }
        console.log(data.data)
        const position = data.data.currentDriverPosition;
        animate(position.latitude, position.longitude);
        setActualPosition({...actualPosition, currentLoc: {latitude: position.latitude, longitude: position.longitude}})
      }
      );
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []));

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (userMarkerRef.current) {
      console.log(newCoordinate)
      actualPosition.animatedCoords.timing(newCoordinate).start()
        mapRef.current.animateToRegion({
          latitude: newCoordinate.latitude,
          longitude: newCoordinate.longitude,
          longitudeDelta: LONGITUDE_DELTA,
          latitudeDelta: LATITUDE_DELTA,
        });
      };
  };

  const updateTripProps = (args) => {
    if (args) {
      setDistance(args.distance.toFixed(2));
      setDuration(Math.ceil(args.duration));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <MapView
        ref={mapRef}
        customMapStyle={customMap}
        style={MapStyles.mapUserDriverComing}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <Marker.Animated ref={userMarkerRef} coordinate={actualPosition.animatedCoords} image={require("../../assets/user.png")}/>
        {destination && (
          <Marker coordinate={destination} identifier="destMark" image={require("../../assets/flag.png")}/>
        )}
        {actualPosition && destination && (
          <MapViewDirections
            apikey={GOOGLE_API_KEY}
            origin={{latitude: actualPosition.currentLoc.latitude, longitude: actualPosition.currentLoc.longitude}}
            destination={destination}
            strokeColor="black"
            strokeWidth={5}
            onReady={updateTripProps}
          />
        )}
      </MapView>
      <Modal
        transparent={true}
        visible={modalFinishVisible}
        onRequestClose={() => {
          setModalFinishVisible(!modalFinishVisible);
        }}
      >
        <View style={modalStyles.centered_view}>
          <View style={modalStyles.modal_view_travel}>
            <Text style={[modalStyles.text_modal_style, {fontFamily: "poppins"}]}>Has llegado a destino!</Text>
            <Pressable
              style={[modalStyles.button, modalStyles.button_close, {fontFamily: "poppins-bold"}]}
              onPress={() => navigation.replace("Home")}
            >
              <Text style={modalStyles.text_style}>Finalizar Viaje</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
