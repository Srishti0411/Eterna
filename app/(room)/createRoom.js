import { 
  View, Text, TouchableOpacity, StyleSheet, Alert, Animated, 
  Easing, Dimensions, Platform 
} from "react-native";
import * as Clipboard from "@react-native-clipboard/clipboard";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { 
  doc, setDoc, getDoc, serverTimestamp 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";  

export default function CreateRoom() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
    createRoomInFirestore(id);

    // Particles setup
    const { width, height } = Dimensions.get("window");
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

  const createRoomInFirestore = async (roomId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user?.uid;

    if (!uid) {
      console.error("No user signed in");
      return;
    }

    try {
      // Fetch username from users collection
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error("User document not found");
        return;
      }

      const username = userSnap.data().username;

      // Create room doc
      await setDoc(doc(db, "rooms", roomId), {
        createdBy: uid,                        // UID
        createdAt: serverTimestamp(),          // Firestore timestamp
        members: [username],                   // array of usernames
        journeyProgress: {
          completedTasks: {},                  // empty map
          level: 1                             // default level
        }
      });

      // Add room ID to user doc
      await setDoc(userRef, { room: roomId }, { merge: true });

      console.log("✅ Room created successfully with journeyProgress and user updated");
    } catch (err) {
      console.error("❌ Error creating room:", err);
    }
  };

  const copyToClipboard = async () => {
    try {
      if (Platform.OS === "web") {
        await navigator.clipboard.writeText(roomId);
      } else {
        await Clipboard.setStringAsync(roomId);
      }
      Alert.alert("Copied!", "Room code copied to clipboard.");
    } catch (err) {
      Alert.alert("Error", "Could not copy text.");
    }
  };

  const handleContinue = () => {
    router.push({ pathname: "/(main)/journey", params: { roomId } });
  };

  return (
    <View style={styles.container}>
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
              { translateX: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, p.offsetX] }) },
              { translateY: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, p.offsetY] }) },
            ],
          }}
        />
      ))}

      <View style={styles.content}>
        <Text style={styles.title}>Your Room ID!</Text>
        <Text style={styles.roomId}>{roomId}</Text>

        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
          <Text style={styles.copyText}>Copy & Invite</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#27273E", alignItems: "center", justifyContent: "center" },
  content: { alignItems: "center" },
  title: { fontSize: 30, color: "#F2C7F2", fontWeight: "700", fontStyle: "italic", fontFamily: "serif", marginBottom: 15 },
  roomId: { fontSize: 42, color: "#fff", fontWeight: "800", letterSpacing: 6, fontStyle: "italic", fontFamily: "serif", marginBottom: 25 },
  copyButton: { backgroundColor: "rgba(222, 199, 242, 0.8)", paddingVertical: 12, paddingHorizontal: 35, borderRadius: 25, marginBottom: 15 },
  copyText: { color: "#27273E", fontSize: 18, fontWeight: "600", fontStyle: "italic", fontFamily: "serif" },
  continueButton: { backgroundColor: "rgba(39,39,62,0.5)", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25 },
  continueText: { color: "#F2C7F2", fontSize: 20, fontWeight: "700", fontStyle: "italic", fontFamily: "serif" },
});
