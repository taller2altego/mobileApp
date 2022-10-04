import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { get, patch } from "../../utils/requests";
import { Profilestyles } from "../styles";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../redux/actions/UpdateUserData";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import { Homestyles } from "../styles";
import * as SecureStore from 'expo-secure-store';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";

export default function Home({ navigation }) {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const id = await SecureStore.getItemAsync("id");
      const token = await SecureStore.getItemAsync("token");
      get(`http://10.0.2.2:5000/users/${id}`, token).then(
        ({ data: { name, lastname, email, phoneNumber } }) =>
          dispatch(setUserData({ name, lastname, email, phoneNumber })),
      );
    })();
  }, []);

  function HomeTab() {
    const mapRef = useRef(null);
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const edgePadding = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    }

    const INITIAL_POSITION = {
      latitude: -34.6035,
      longitude: -58.4611,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    }

    const zoomIn = () => {
      if (origin && destination) {
        mapRef.current.fitToCoordinates([origin, destination], {edgePadding})
      }
    }

    const moveTo = async (position) => {
      const camera = await mapRef.current.getCamera();
      if (camera) {
        camera.center = position;
        mapRef.current.animateCamera(camera, {duration: 1000});
      }
    };

    const handleLocation = (details, flag) => {
      const set = flag === "origin" ? setOrigin : setDestination;
      const position = {latitude: details.geometry.location.lat, longitude: details.geometry.location.lng};
      set(position);
      moveTo(position);
    };

    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <MapView ref={mapRef} style={Homestyles.map} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_POSITION}>
          {origin && <Marker coordinate={origin}/>}
          {destination && <Marker coordinate={destination}/>}
          {origin && destination && <MapViewDirections apikey="" origin={origin} destination={destination} strokeColor="black" strokeWidth={5}/>}
        </MapView>
        <View style={Homestyles.searchContainer}>
        <GooglePlacesAutocomplete
          styles={{ textInput: Homestyles.searchInput}}
          placeholder='Punto de partida'
          fetchDetails
          onPress={(data, details) => {
            handleLocation(details, "origin");
          }}
          query={{
            key: '',
            language: 'en',
          }}
        />
        <GooglePlacesAutocomplete
          styles={{ textInput: Homestyles.searchInput}}
          placeholder='Punto de llegada'
          fetchDetails
          onPress={(data, details) => {
            handleLocation(details, "destination");
          }}
          query={{
            key: '',
            language: 'en',
          }}
        />
        </View>
      </View>
    );
  }

  function ProfileTab() {
    const currentUserData = useSelector((store) => store.userData);
    const dispatch = useDispatch();
    const [nameText, setNameText] = useState(currentUserData.name);
    const [lastnameText, setLastnameText] = useState(currentUserData.lastname);
    const [phoneText, setPhoneText] = useState(currentUserData.phoneNumber);
    const [emailText, setEmailText] = useState(currentUserData.email);
    const [isEditing, setIsEditing] = useState(false);

    const handleCancelEdit = () => {
      setIsEditing(!isEditing);
      setNameText(currentUserData.name);
      setLastnameText(currentUserData.lastname);
      setPhoneText(currentUserData.phoneNumber);
      setEmailText(currentUserData.email);
    };

    const handleUpdate = async () => {
      const id = await SecureStore.getItemAsync("id");
      const token = await SecureStore.getItemAsync("token");
      patch(`http://10.0.2.2:5000/users/${id}`, token, {
        name: nameText,
        lastname: lastnameText,
        phoneNumber: Number(phoneText),
      }).then(() => {
        dispatch(setUserData({
          name: nameText,
          lastname: lastnameText,
          phoneNumber: Number(phoneText),
          email: emailText,
        }));
      });
      setIsEditing(false);
    };

    return (
      <View style={Profilestyles.profile_container}>
        <View style={Profilestyles.profile_text_container}>
          <Text style={Profilestyles.profile_text}>
            {currentUserData.name} {currentUserData.lastname}
          </Text>
        </View>
        <View style={Profilestyles.profile_inputs}>
          <TextInput
            style={Profilestyles.profile_input}
            value={nameText}
            onChangeText={setNameText}
            editable={isEditing}
          />
          <TextInput
            style={Profilestyles.profile_input}
            value={lastnameText}
            onChangeText={setLastnameText}
            editable={isEditing}
          />
          <TextInput
            style={Profilestyles.profile_input}
            value={phoneText}
            onChangeText={setPhoneText}
            editable={isEditing}
          />
          <TextInput
            style={Profilestyles.profile_input}
            value={emailText}
            onChangeText={setEmailText}
            editable={false}
          />
        </View>
        <View style={Profilestyles.edit_profile}>
          {isEditing
            ? (
              <View style={Profilestyles.edit_profile_button_container}>
                <Pressable
                  onPress={() => {
                    handleUpdate();
                  }}
                  style={Profilestyles.edit_profile_button}
                >
                  <Text style={Profilestyles.edit_button_text}>
                    Guardar Cambios
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    handleCancelEdit();
                  }}
                  style={Profilestyles.edit_profile_button}
                >
                  <Text style={Profilestyles.edit_button_text}>Cancelar</Text>
                </Pressable>
              </View>
            )
            : (
              <Pressable
                onPress={() => {
                  setIsEditing(!isEditing);
                }}
                style={Profilestyles.edit_profile_button}
              >
                <Text style={Profilestyles.edit_button_text}>
                  Editar Perfil
                </Text>
              </Pressable>
            )}
        </View>
      </View>
    );
  }
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Main"
        component={HomeTab}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileTab}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
