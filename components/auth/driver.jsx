import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { View, Text } from "react-native-web";
import { post } from "../../utils/requests";

export default function Driver({ navigation }) {

    const confirmData = async () => {
        const id = await AsyncStorage.getItem("id");
        const token = await AsyncStorage.getItem("token");
        get(`http://127.0.0.1:5000/users/driver/${id}`, token)
        navigation.navigation("Home")
    }

    return (
        <View>
            <Text>CONDUCTOR</Text>
            <Pressable
            onPress={confirmData}>
                <Text>Confirmar</Text>
            </Pressable>
        </View>
    )
}
