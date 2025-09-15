import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 This is the Dashboard</Text>

      {/* Bottom Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/(main)/journey")}>
          <Ionicons name="planet" size={28} color="#a29bfe" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(main)/dashboard")}>
          <Ionicons name="home" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(main)/pebble")}>
          <Ionicons name="diamond" size={28} color="#a29bfe" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a23",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    height: 60,
    width: "100%",
    backgroundColor: "#151530",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2c2c54",
  },
});