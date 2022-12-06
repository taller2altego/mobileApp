import { useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapStyles, TravelStyles, modalStyles } from "../styles";
import MapViewDirections from "react-native-maps-directions";
import { View, Text, Pressable, Image, Modal } from "react-native";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import envs from "../../config/env";

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
  const travelDetails = useSelector((store) => store.currentTravel);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [modalFinishVisible, setModalFinishVisible] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState(origin);
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
        
        const position = data.data.currentDriverPosition;
        setCurrentOrigin(position);
      }
      );
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []));

  const mapRef = useRef(null);
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
      {modalFinishVisible && <WaitingModal navigation={navigation}></WaitingModal>}
      <MapView
        ref={mapRef}
        style={MapStyles.map}
        provider={PROVIDER_GOOGLE}
        onMapLoaded={() => {
          zoomOnDirections();
        }}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
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
            Driver: {driverId}
          </Text>
          <Text style={{ fontFamily: "poppins", fontSize: 15 }}>
            {" "}
            {distance} km
          </Text>
        </View>
      </View>
      <Modal
        transparent={true}
        visible={modalFinishVisible}
        onRequestClose={() => {
          setModalFinishVisible(!modalFinishVisible);
        }}
      >
        <View style={modalStyles.centered_view}>
          <View style={modalStyles.modal_view_travel}>
            <Text style={modalStyles.text_modal_style}>Has llegado a destino!</Text>
            <Pressable
              style={[modalStyles.button, modalStyles.button_close]}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={modalStyles.text_style}>Finalizar Viaje</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={TravelStyles.travelContainer}>
        <View style={TravelStyles.buttonContainer}>
          <Pressable
            style={MapStyles.confirmTripButton}
            onPress={() => navigation.navigate("DriverProfileVisualization")}
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
