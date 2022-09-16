import React, { useEffect, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";

import { get } from "./../utils/requests";
import styles from "./styles";

export default function Home({ navigation, id }) {
  const [data, setData] = useState([]);

  const getUserData = () => {
    return get(
      `http://127.0.0.1:5000/users/${id}`,
      localStorage.getItem("token"),
    ).then(({ data }) => {
      setData(data);
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text>{data.username}</Text>
    </View>
  );
}
