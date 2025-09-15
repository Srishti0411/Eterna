import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";

// 🌌 Starry background generator
function StarryBackground({ starCount = 100 }) {
  const stars = Array.from({ length: starCount });
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#0a0a23" }]}>
      {stars.map((_, i) => {
        const size = Math.random() * 2 + 1;
        const left = Math.random() * 100 + "%";
        const top = Math.random() * 100 + "%";
        const opacity = Math.random() * 0.8 + 0.2;

        return (
          <View
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: "white",
              left,
              top,
              opacity,
            }}
          />
        );
      })}
    </View>
  );
}

export default function Journey() {
  const { roomId } = useLocalSearchParams();
  const router = useRouter();

  const [progress, setProgress] = useState(null);
  const totalLevels = 30;
  const batchSize = 10;

  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, async (snap) => {
      if (snap.exists()) {
        setProgress(snap.data().journeyProgress || { level: 1 });
      } else {
        try {
          await setDoc(roomRef, { journeyProgress: { level: 1 } }, { merge: true });
          setProgress({ level: 1 });
        } catch (e) {
          console.warn("Failed to initialize room document:", e);
          setProgress({ level: 1 });
        }
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  if (!progress) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#a29bfe" />
        <Text style={{ color: "#fff", marginTop: 15 }}>Loading Journey...</Text>
      </View>
    );
  }

  const currentLevel = progress.level;

  const maxUnlocked = Math.min(
    1 + Math.floor((currentLevel - 1) / batchSize) * batchSize + batchSize,
    totalLevels
  );

  return (
    <View style={styles.container}>
      <StarryBackground />

      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <Text style={styles.title}>Your milestones, together ★</Text>

          {/* {[...Array(maxUnlocked)].map((_, i) => {
            const level = i + 1;
            let state = "locked";
            if (level < currentLevel) state = "done";
            else if (level === currentLevel) state = "current";

            return (
              <View key={level} style={styles.levelWrapper}>
                {level > 1 && <View style={styles.connector} />}
                <TouchableOpacity
                  style={[
                    styles.levelCircle,
                    state === "done" && styles.done,
                    state === "current" && styles.current,
                  ]}
                  disabled={state === "locked"}
                  onPress={() =>
                    router.push({
                      pathname: "/(main)/task/[level]",
                      params: { level, roomId },
                    })
                  }
                >
                  {state === "done" ? (
                    <Ionicons name="checkmark-circle" size={34} color="#fff" />
                  ) : state === "locked" ? (
                    <Ionicons name="lock-closed" size={28} color="#fff" />
                  ) : (
                    <Text style={styles.levelText}>{level}</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })} */}

          {maxUnlocked < totalLevels && (
            <View style={styles.oopsBox}>
              <Ionicons name="alert-circle" size={28} color="#9b5a5aff" />
              <Text style={styles.oopsText}>Oops! Levels are work under progress right now 🔒</Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity
            onPress={() => router.push("/(main)/journey")}
            style={styles.navItem}
          >
            <Ionicons name="planet" size={28} color="#fff" />
            <Text style={[styles.navText, styles.activeNav]}>Journey</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(main)/dashboard")}
            style={styles.navItem}
          >
            <Ionicons name="home" size={28} color="#a29bfe" />
            <Text style={styles.navText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(main)/pebble")}
            style={styles.navItem}
          >
            <Ionicons name="diamond" size={28} color="#a29bfe" />
            <Text style={styles.navText}>Pebble</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a23",
  },
  contentWrapper: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 120,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  levelWrapper: {
    alignItems: "center",
  },
  connector: {
    width: 4,
    height: 50,
    backgroundColor: "#a29bfe",
    borderRadius: 2,
    marginVertical: 5,
  },
  levelCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3d3d5c",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  levelText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  done: {
    backgroundColor: "#6c5ce7",
  },
  current: {
    backgroundColor: "#e056fd",
  },
  oopsBox: {
    marginTop: 20,
    backgroundColor: "#2c2c54",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  oopsText: {
    color: "#9b5a5aff",
    fontSize: 16,
    marginLeft: 10,
  },
  navbar: {
    height: 70,
    backgroundColor: "#151530",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2c2c54",
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: "#a29bfe",
    marginTop: 3,
  },
  activeNav: {
    color: "#fff",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a23",
  },
});
