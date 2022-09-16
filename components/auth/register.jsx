import React, { useEffect, useState } from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import { post } from "../../utils/requests";
import styles from "../styles";
import { Picker } from "@react-native-picker/picker";

export default function Register({ navigation, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [isDriver, setIsDriver] = useState(false);

  const onSignUp = () => {
    return post("http://127.0.0.1:5001/users", {
      name,
      lastname,
      phoneNumber: Number(phone),
      email,
      password,
    })
      .then(({ data: { id } }) => {
        if (isDriver) {
          navigation.navigate("Login", { id });
        } else {
          navigation.navigate("DriverData", { id });
        }
      });
  };

  return (
    <View>
      <TextInput
        placeholder="Name"
        onChangeText={(name) => setName(name)}
      />
      <TextInput
        placeholder="Lastname"
        onChangeText={(password) => setLastName(password)}
      />
      <TextInput
        placeholder="Email"
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        placeholder="Phone Number"
        keyboardType="numeric"
        onChangeText={(phone) => {
          setPhone(phone.replace(/[^0-9]/, ""));
        }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Pressable style={styles.regButton} onPress={() => onSignUp()}>
        <Text style={styles.textButton}>Sign Up</Text>
      </Pressable>
      <Picker
        onValueChange={(isDriver) => setIsDriver(isDriver)}
      >
        <Picker.Item label="Conductor" value={true} />
        <Picker.Item label="Pasajero" value={false} />
      </Picker>
    </View>
  );
}
