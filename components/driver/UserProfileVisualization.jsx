import React, { useState, useCallback } from "react";
import { Text, View, FlatList } from "react-native";
import * as SecureStore from "expo-secure-store";
import { get } from "../../utils/requests";
import envs from "../../config/env";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import CommentItem from "../travel/CommentItem";

export default function VisualizationTab({ route, navigation }) {
    // States
    const [name, setName] = useState();
    const [lastname, setLastName] = useState();
    const [userScore, setUserScore] = useState();
    const [data, setData] = useState([]);

    const { API_URL, _ } = envs;

    function renderItem({ item }) {
        const backgroundColor = item.id === selectedId ? "#f2f2f200" : "white";
        return (
            <CommentItem
                item={item}
                onPress={() => handleSelectedTrip(item)}
                backgroundColor={{ backgroundColor }}
            />
        );
    }

    useFocusEffect(useCallback(() => {
        (async () => {
            const token = await SecureStore.getItemAsync("token");
            const { userId } = route.params;

            await get(`${API_URL}/users/${userId}`, token).then(
                ({ data: { name, lastname, totalScore } }) => {
                    setName(name);
                    setLastName(lastname);
                    setUserScore(totalScore);
                });
            await get(`${API_URL}/comments/user/${userId}`, token)
                .then((data) => {
                    setData(data.data.comments);
                });

        })();
    }, []));

    return (
        <View style={{ flex: 1 }}>
            <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ alignSelf: "flex-start", top: 40, left: 10 }}
                onPress={() => navigation.goBack()}
            />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontFamily: "poppins", fontSize: 25 }}>
                    {name} {lastname}
                </Text>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontFamily: "poppins", fontSize: 25 }}>
                        {userScore != 0 ? userScore : "-"}
                    </Text>
                    <FontAwesome
                        name="star"
                        size={20}
                        color="black"
                        style={{ marginLeft: 4, marginTop: 4 }}
                    />
                </View>
            </View>
            <View style={{ flex: 3 }}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </View>
    );
}
