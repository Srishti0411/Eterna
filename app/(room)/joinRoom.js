import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing 
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { 
  doc, getDoc, updateDoc, arrayUnion, arrayRemove 
} from "firebase/firestore";
import { db } from "../../firebase";

export default function JoinRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [particles, setParticles] = useState([]);
  const [error, setError] = useState("");   // ✅ inline error

  // floating background particles
  useEffect(() => {
    const { width, height } = require("react-native").Dimensions.get("window");

    const tempParticles = Array.from({ length: 60 }).map(() => {
      const anim = new Animated.Value(0);
      const size = Math.random() * 20 + 10;
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const offsetX = Math.random() * width - width / 2;
      const offsetY = Math.random() * -height - 100;

      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 6000 + Math.random() * 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      return {
        anim,
        size,
        startX,
        startY,
        offsetX,
        offsetY,
        opacity: Math.random() * 0.3 + 0.1,
      };
    });

    setParticles(tempParticles);
  }, []);

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      setError("Please enter a room code.");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const uid = user?.uid;
      if (!uid) {
        setError("User not logged in.");
        return;
      }

      // fetch user profile
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        setError("User profile not found.");
        return;
      }
      const { username, room: oldRoomId } = userSnap.data();

      // check if room exists
      const roomRef = doc(db, "rooms", roomCode);
      const roomSnap = await getDoc(roomRef);
      if (!roomSnap.exists()) {
        setError("No room found with this code.");
        return;
      }

      const roomData = roomSnap.data();

      // enforce max 2 members
      if (roomData.members && roomData.members.length >= 2) {
        setError("This room already has 2 members.");
        return;
      }

      // if user already in another room → remove them
      if (oldRoomId && oldRoomId !== roomCode) {
        const oldRoomRef = doc(db, "rooms", oldRoomId);
        await updateDoc(oldRoomRef, { members: arrayRemove(username) });
      }

      // add user to new room
      await updateDoc(roomRef, { members: arrayUnion(username) });

      // update user doc with new room
      await updateDoc(userRef, { room: roomCode });

      setError(""); // ✅ clear error on success
      router.replace({ pathname: "/(main)/journey", params: { roomId: roomCode } });

    } catch (err) {
      console.error("Error joining room:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* floating particles */}
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: `rgba(242,199,242,${p.opacity})`,
            top: p.startY,
            left: p.startX,
            transform: [
              {
                translateX: p.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, p.offsetX],
                }),
              },
              {
                translateY: p.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, p.offsetY],
                }),
              },
            ],
          }}
        />
      ))}

      <View style={styles.content}>
        <Text style={styles.title}>Join Room💖</Text>

        <TextInput
          style={styles.input}
          value={roomCode}
          onChangeText={(text) => {
            setRoomCode(text);
            setError(""); // ✅ clear error when user types again
          }}
          autoCapitalize="characters"
          maxLength={6}
          placeholder="enter room code"
          placeholderTextColor="rgba(255,255,255,0.4)"
        />

        {/* ✅ inline error message */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
          <Text style={styles.joinText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#27273E",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    width: "80%",
    zIndex: 1,
  },
  title: {
    fontSize: 30,
    color: "#F2C7F2",
    fontWeight: "700",
    fontStyle: "italic",
    fontFamily: "serif",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "rgba(85, 85, 117, 0.55)",
    color: "#F2C7F2",
    fontSize: 24,
    fontWeight: "600",
    fontStyle: "italic",
    fontFamily: "serif",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 10,
    width: "100%",
  },
  error: {
    color: "#ff6b6b",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  joinButton: {
    backgroundColor: "rgba(222, 199, 242, 0.8)",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  joinText: {
    color: "#27273E",
    fontSize: 20,
    fontWeight: "700",
    fontStyle: "italic",
    fontFamily: "serif",
  },
});
