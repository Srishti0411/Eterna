import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Logo from "../assets/logo.png";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user already has a room
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().roomId) {
        router.replace("/(main)/dashboard"); // go to dashboard
      } else {
        setUserExists(true); // logged in but no room
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d28eff" />
      </View>
    );
  }

  // Case 1: Not logged in OR logged in but no room → show HomePage
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logoImage} resizeMode="contain" />


      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(auth)/signIn")}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#e3c6ff" }]}
        onPress={() => router.push("/(auth)/signUp")}
      >
        <Text style={[styles.buttonText, { color: "#4a155d" }]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logoImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f0ff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#27273E",
    paddingHorizontal: 30,
  },
  tagline: {
    fontSize: 14,
    color: "#cbbbe5",
    marginBottom: 50,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 30,
    backgroundColor: "#a55eea",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
