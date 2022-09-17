import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { get } from "../../utils/requests";
import styles from "../styles";

export default function Home({ navigation, id }) {
  const Tab = createBottomTabNavigator();
  const [userData, setUserData] = useState({});

  // FIXME reemplazar esto por request para obtener informacion de usuario
  useEffect(() => {
    setUserData({
      "nombre": "nacho",
      "apellido": "avecilla",
      "telefono": 123,
      "email": "test",
    });
  }, []);

  function HomeTab() {
    return (
      <View>
        <Text>Home</Text>
      </View>
    );
  }

  function ProfileTab() {
    const [nameText, setNameText] = useState(userData.nombre);
    const [lastnameText, setLastnameText] = useState(userData.apellido);
    const [phoneText, setPhoneText] = useState(userData.telefono);
    const [emailText, setEmailText] = useState(userData.email);
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = () => {
      //TODO hacer request para actualizar los datos
    };

    return (
      <View style={styles.profile_container}>
        <View style={styles.profile_text_container}>
          <Text style={styles.profile_text}>Bienvenido {userData.nombre}</Text>
        </View>
        <View style={styles.profile_inputs}>
          <TextInput
            style={styles.profile_input}
            value={nameText}
            onChangeText={setNameText}
            editable={isEditing}
          />
          <TextInput
            style={styles.profile_input}
            value={lastnameText}
            onChangeText={setLastnameText}
            editable={isEditing}
          />
          <TextInput
            style={styles.profile_input}
            value={phoneText}
            onChangeText={setPhoneText}
            editable={isEditing}
          />
          <TextInput
            style={styles.profile_input}
            value={emailText}
            onChangeText={setEmailText}
            editable={isEditing}
          />
        </View>
        <View style={styles.edit_profile_button}>
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
