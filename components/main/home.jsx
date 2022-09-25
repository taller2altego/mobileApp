import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { get, patch } from "../../utils/requests";
import { Profilestyles } from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../redux/actions/UpdateUserData";

export default function Home({ navigation }) {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("token");
      get(`http://localhost:5000/users/${id}`, token).then(
        ({ data: { name, lastname, email, phoneNumber } }) =>
          dispatch(setUserData({ name, lastname, email, phoneNumber })),
      );
    })();
  }, []);

  function HomeTab() {
    return (
      <View>
        <Text>Home</Text>
      </View>
    );
  }

  function ProfileTab() {
    const currentUserData = useSelector((store) => store.updateUser);
    const dispatch = useDispatch();
    const [nameText, setNameText] = useState(currentUserData.name);
    const [lastnameText, setLastnameText] = useState(currentUserData.lastname);
    const [phoneText, setPhoneText] = useState(currentUserData.phoneNumber);
    const [emailText, setEmailText] = useState(currentUserData.email);
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = async () => {
      const id = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("token");
      patch(`http://127.0.0.1:5000/users/${id}`, token, {
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
            Bienvenido {currentUserData.name}
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
        <View style={Profilestyles.edit_profile_button}>
          {isEditing
            ? (
              <Pressable
                onPress={() => {
                  handleUpdate();
                }}
              >
                <Text>Guardar Cambios</Text>
              </Pressable>
            )
            : (
              <Pressable
                onPress={() => {
                  setIsEditing(!isEditing);
                }}
              >
                <Text>Editar Perfil</Text>
              </Pressable>
            )}
          {isEditing && (
            <Pressable
              onPress={() => {
                setIsEditing(!isEditing);
              }}
            >
              <Text>Cancelar</Text>
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
