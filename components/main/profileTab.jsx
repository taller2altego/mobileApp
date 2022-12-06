import React, { useState, useEffect } from "react";
import { Pressable, Text, TextInput, View, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import {
  patch,
  authPost,
  get,
  handlerUnauthorizedError,
} from "../../utils/requests";
import { clearUserData, setUserData } from "../../redux/actions/UpdateUserData";
import { Profilestyles } from "../styles";
import envs from "../../config/env";
import {
  clearDriverData,
  setDriverData,
} from "../../redux/actions/UpdateDriverData";
import { clearCurrentTravel } from "../../redux/actions/UpdateCurrentTravel";
import { clearTravelDetails } from "../../redux/actions/UpdateTravelDetails";

export default function ProfileTab({ navigation }) {
  const currentUserData = useSelector((store) => store.userData);
  const currentDriverData = useSelector((store) => store.driverData);
  const dispatch = useDispatch();
  const [nameText, setNameText] = useState(currentUserData.name);
  const [lastnameText, setLastnameText] = useState(currentUserData.lastname);
  const [phoneText, setPhoneText] = useState(currentUserData.phoneNumber);
  const [modelText, setModelText] = useState(currentDriverData.model);
  const [plateText, setPlateText] = useState(currentDriverData.licensePlate);
  const [licenseText, setLicenseText] = useState(currentDriverData.license);
  const [emailText, setEmailText] = useState(currentUserData.email);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { API_URL, _ } = envs;

  useEffect(() => {
    setModelText(currentDriverData.model);
    setPlateText(currentDriverData.licensePlate);
    setLicenseText(currentDriverData.license);
    setNameText(currentUserData.name);
    setLastnameText(currentUserData.lastname);
    setPhoneText(currentUserData.phoneNumber);
  }, [currentDriverData, currentUserData]);

  const logOut = async () => {
    const token = await SecureStore.getItemAsync("token");
    console.log(token);
    return authPost(`${API_URL}/logout`, token)
      .then(async () => {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("id");
        if (await SecureStore.getItemAsync("driverId")) {
          await SecureStore.deleteItemAsync("driverId");
        }
        dispatch(clearCurrentTravel());
        dispatch(clearDriverData());
        dispatch(clearUserData());
        dispatch(clearTravelDetails());
        navigation.navigate("Landing");
      })
      .catch((e) => {
        const errMessage =
          (e.response && e.response.data && e.response.data) || e.message;
        setErrorMessage(errMessage);
      });
  };

  const handleNewDriver = () => {
    navigation.navigate("Driver");
  };

  const handleCancelEdit = () => {
    setIsEditing(!isEditing);
    setNameText(currentUserData.name);
    setLastnameText(currentUserData.lastname);
    setPhoneText(currentUserData.phoneNumber);
    setEmailText(currentUserData.email);

    setModelText(currentDriverData.model);
    setLicenseText(currentDriverData.license);
    setPlateText(currentDriverData.licensePlate);
  };

  const handleUpdate = async () => {
    const id = await SecureStore.getItemAsync("id");
    const token = await SecureStore.getItemAsync("token");
    const body = {
      name: nameText,
      lastname: lastnameText,
      phoneNumber: Number(phoneText),
    };
    patch(`${API_URL}/users/${id}`, token, body)
      .then(() => {
        dispatch(
          setUserData({
            name: nameText,
            lastname: lastnameText,
            phoneNumber: phoneText.toString(),
            email: emailText,
          })
        );
      })
      .catch((error) => handlerUnauthorizedError(navigation, error));

    const driverid = await SecureStore.getItemAsync("driverId");

    await patch(`${API_URL}/drivers/${driverid}`, token, {
      model: modelText,
      license: licenseText,
      licensePlate: plateText,
    })
      .then(() => {
        dispatch(
          setDriverData({
            license: licenseText,
            licensePlate: plateText,
            model: modelText,
          })
        );
      })
      .catch((err) => handlerUnauthorizedError(navigation, err));

    if (driverid) {
      await patch(`${API_URL}/drivers/${driverid}`, token, {
        model: modelText,
        license: licenseText,
        licensePlate: plateText,
      })
        .then(() => {
          dispatch(
            setDriverData({
              license: licenseText,
              licensePlate: plateText,
              model: modelText,
            })
          );
        })
        .catch(() => { });
    }

    setIsEditing(false);
  };

  return (
    <ScrollView>
      <View style={Profilestyles.profile_container}>
        <View style={Profilestyles.profile_text_container}>
          <Text style={[Profilestyles.profile_text, { fontFamily: "poppins" }]}>
            {currentUserData.name} {currentUserData.lastname}
          </Text>
        </View>
        <View style={Profilestyles.profile_inputs}>
          <Text
            style={{
              fontFamily: "poppins-bold",
              fontSize: 20,
              marginTop: 25,
              alignSelf: "center",
              marginBottom: 25,
            }}
          >
            {" "}
            Informacion Personal{" "}
          </Text>
          <View>
            <Text style={[{ fontFamily: "poppins" }]}>Nombre</Text>
            <TextInput
              style={[Profilestyles.profile_input, { fontFamily: "poppins" }]}
              value={nameText}
              onChangeText={setNameText}
              onFocus={() => setIsEditing(true)}
            />
          </View>
          <View>
            <Text style={[{ fontFamily: "poppins" }]}>Apellido</Text>
            <TextInput
              style={[Profilestyles.profile_input, { fontFamily: "poppins" }]}
              value={lastnameText}
              onChangeText={setLastnameText}
              onFocus={() => setIsEditing(true)}
            />
          </View>
          <View>
            <Text style={[{ fontFamily: "poppins" }]}>Telefono</Text>
            <TextInput
              style={[Profilestyles.profile_input, { fontFamily: "poppins" }]}
              value={phoneText}
              onChangeText={setPhoneText}
              onFocus={() => setIsEditing(true)}
            />
          </View>
          <View>
            <Text style={[{ fontFamily: "poppins" }]}>E-mail</Text>
            <TextInput
              style={[Profilestyles.profile_input, { fontFamily: "poppins" }]}
              value={emailText}
              onChangeText={setEmailText}
              editable={false}
              disabledInputStyle={{ color: "red" }}
            />
          </View>
          {currentUserData.isDriver ? (
            <Text
              style={{
                fontFamily: "poppins-bold",
                fontSize: 20,
                marginTop: 25,
                alignSelf: "center",
                marginBottom: 25,
              }}
            >
              {" "}
              Informacion de Conductor{" "}
            </Text>
          ) : (
            <></>
          )}
          {currentUserData.isDriver ? (
            <View>
              <Text style={[{ fontFamily: "poppins" }]}>
                Modelo de Vehiculo
              </Text>
              <TextInput
                style={[Profilestyles.profile_input, { fontFamily: "poppins" }]}
                value={modelText}
                onChangeText={setModelText}
                onFocus={() => setIsEditing(true)}
                disabledInputStyle={{ color: "red" }}
              />
            </View>
          ) : (
            <></>
          )}
          {currentUserData.isDriver ? (
            <View>
              <Text style={[{ fontFamily: "poppins" }]}>
                Numero de Licencia
              </Text>
              <TextInput
                style={[Profilestyles.profile_input, { fontFamily: "poppins" }]}
                value={licenseText}
                onChangeText={setLicenseText}
                disabledInputStyle={{ color: "red" }}
                onFocus={() => setIsEditing(true)}
              />
            </View>
          ) : (
            <></>
          )}
          {currentUserData.isDriver ? (
            <View>
              <Text style={[{ fontFamily: "poppins" }]}>Numero de Patente</Text>
              <TextInput
                style={[Profilestyles.profile_input, { fontFamily: "poppins" }]}
                value={plateText}
                onChangeText={setPlateText}
                disabledInputStyle={{ color: "red" }}
                onFocus={() => setIsEditing(true)}
              />
            </View>
          ) : (
            <></>
          )}
        </View>
        <View style={Profilestyles.edit_profile}>
          {isEditing ? (
            <View
              style={[
                Profilestyles.edit_profile_button_container,
                { flexDirection: "row", marginLeft: 30 },
              ]}
            >
              <Pressable
                onPress={() => {
                  handleUpdate();
                }}
                style={Profilestyles.edit_profile_button}
              >
                <Text
                  style={[
                    Profilestyles.edit_button_text,
                    { fontFamily: "poppins", marginTop: 20 },
                  ]}
                >
                  Guardar Cambios
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  handleCancelEdit();
                }}
                style={Profilestyles.edit_profile_button}
              >
                <Text
                  style={[
                    Profilestyles.edit_button_text,
                    { fontFamily: "poppins", marginTop: 20 },
                  ]}
                >
                  Cancelar
                </Text>
              </Pressable>
            </View>
          ) : (
            <></>
          )}
          <Pressable
            onPress={() =>
              navigation.navigate("WalletVisualization")
            }
            style={[Profilestyles.edit_profile_button, { marginTop: 30 }]}
          >
            <Text style={Profilestyles.edit_button_text}>Wallet</Text>
          </Pressable>
          {!currentUserData.isDriver ? (
            <Pressable
              onPress={() => {
                handleNewDriver();
              }}
              style={Profilestyles.edit_profile_button}
            >
              <Text
                style={[
                  Profilestyles.edit_button_text,
                  { fontFamily: "poppins", marginTop: 20 },
                ]}
              >
                Trabaja con nosotros
              </Text>
            </Pressable>
          ) : (
            <></>
          )}
          <Pressable
            onPress={() => logOut()}
            style={Profilestyles.edit_profile_button}
          >
            <Text
              style={[
                Profilestyles.edit_button_text,
                { fontFamily: "poppins", color: "#e55", marginTop: 20 },
              ]}
            >
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
