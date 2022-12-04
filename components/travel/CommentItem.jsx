import React from "react";

import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function CommentItem({
  item,
  onPress,
  backgroundColor,
  textColor,
}) {
  return (
    <TouchableOpacity style={[styles.item, backgroundColor]} onPress={onPress}>
      <Text style={[styles.title, textColor]}>{`${item.description}`}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
  },
});
