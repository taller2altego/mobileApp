import React, { useEffect, useState } from "react";
import { Text, View, Button, Pressable } from "react-native";

import { get } from "./../utils/requests";
import styles from "./styles";

export default function Home({ navigation, id }) {
  const [data, setData] = useState([]);

  const getUserData = () => {
    return get(localStorage.getItem('token'), `http://127.0.0.1:5000/users/${id}`).then(({ data }) => {
      setData(data);
    });
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text>{data.username}</Text>
    </View>
  );
}
