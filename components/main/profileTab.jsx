import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";

import { patch } from "../../utils/requests";
import { setUserData } from "../../redux/actions/UpdateUserData";
import { Profilestyles } from "../styles";

export default function ProfileTab() {
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
      dispatch(
        setUserData({
          name: nameText,
          lastname: lastnameText,
          phoneNumber: Number(phoneText),
          email: emailText,
        })
      );
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
        {isEditing ? (
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
        ) : (
          <Pressable
            onPress={() => {
              setIsEditing(!isEditing);
            }}
            style={Profilestyles.edit_profile_button}
          >
            <Text style={Profilestyles.edit_button_text}>Editar Perfil</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}