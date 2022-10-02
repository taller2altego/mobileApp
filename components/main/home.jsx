import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { deleteReq, getReq, patchReq } from "../../utils/requests";
import { Profilestyles } from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setIsDriver, setUserData } from "../../redux/actions/UpdateUserData";
import { Modal } from "react-native-web";
import { setDriverData } from "../../redux/actions/UpdateDriverData";

export default function Home({ navigation }) {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("token");
      getReq(`http://localhost:5000/users/${id}`, token).then(
        ({ data: { name, lastname, email, phoneNumber } }) =>
          dispatch(setUserData({ name, lastname, email, phoneNumber }))
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
    const currentUserData = useSelector((store) => store.userData);
    const dispatch = useDispatch();
    const [nameText, setNameText] = useState(currentUserData.name);
    const [lastnameText, setLastnameText] = useState(currentUserData.lastname);
    const [phoneText, setPhoneText] = useState(currentUserData.phoneNumber);
    const [emailText, setEmailText] = useState(currentUserData.email);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const handleCancelEdit = () => {
      setIsEditing(!isEditing);
      setNameText(currentUserData.name);
      setLastnameText(currentUserData.lastname);
      setPhoneText(currentUserData.phoneNumber);
      setEmailText(currentUserData.email);
    };

    const handleAccountDelete = async () => {
      const id = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("token");
      deleteReq(`http://127.0.0.1:5000/users/${id}`, token, {
        email: currentUserData.email,
      })
        .then(() => {
          dispatch(
            setUserData({
              name: "",
              lastname: "",
              phoneNumber: "",
              email: "",
            })
          );
        })
        .then(async () => {
          const driverId = await AsyncStorage.getItem("driverId");
          if (currentUserData.isDriver === "true") {
            deleteReq(`http://127.0.0.1:5000/users/${id}/driver/${driverId}`);
            dispatch(setIsDriver({ isDriver: "false" }));
            dispatch(
              setDriverData({
                license: "",
                model: "",
                licensePlate: "",
              })
            );
          }
        });
      navigation.navigate("Landing");
    };

    const handleUpdate = async () => {
      const id = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("token");
      patchReq(`http://127.0.0.1:5000/users/${id}`, token, {
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
        <Modal transparent={true} visible={isDeleteModalVisible}>
          <View style={Profilestyles.delete_account_modal}>
            <View style={Profilestyles.delete_account_view}>
              <Text style={Profilestyles.delete_modal_text}>
                ¿Estas seguro que deseas eliminar tu cuenta?
              </Text>
              <Text style={Profilestyles.delete_modal_text_title}>
                Esta accion es irreversible
              </Text>
              <View>
                <Pressable onPress={() => handleAccountDelete()}>
                  <Text style={Profilestyles.delete_modal_text}>Continuar</Text>
                </Pressable>
                <Pressable
                  onPress={() => setIsDeleteModalVisible(!isDeleteModalVisible)}
                >
                  <Text style={Profilestyles.delete_modal_text}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
            <View style={Profilestyles.profile_buttons}>
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
              <Pressable
                onPress={() => {
                  setIsDeleteModalVisible(!isDeleteModalVisible);
                }}
                style={Profilestyles.edit_profile_button}
              >
                <Text style={Profilestyles.delete_button_text}>
                  Eliminar Cuenta
                </Text>
              </Pressable>
            </View>
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
