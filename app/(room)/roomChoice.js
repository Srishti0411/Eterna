import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Pressable, Easing } from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";

const { width, height } = Dimensions.get("window");

export default function RoomChoice() {
  const router = useRouter();
  const [hearts, setHearts] = useState([]);
  const heartAnim = useRef(new Animated.Value(0)).current;
  const [stars, setStars] = useState([]);

  // Create stars for the galaxy background
  useEffect(() => {
    const tempStars = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      opacity: Math.random(),
      twinkle: new Animated.Value(Math.random()),
    }));
    setStars(tempStars);
    tempStars.forEach(s => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(s.twinkle, { toValue: 1, duration: 1500 + Math.random() * 1000, useNativeDriver: true }),
          Animated.timing(s.twinkle, { toValue: 0, duration: 1500 + Math.random() * 1000, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  const handleHeartClick = (x, y) => {
    const newHearts = Array.from({ length: 20 }).map(() => {
      const id = Date.now() + Math.random();
      return { id, x, y, offsetX: (Math.random() - 0.5) * 80, offsetY: Math.random() * -150 - 50 };
    });
    setHearts(prev => [...prev, ...newHearts]);
    Animated.timing(heartAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setHearts([]);
      heartAnim.setValue(0);
    });
  };

  return (
    <View style={styles.container}>
      {/* Galaxy background */}
      <View style={StyleSheet.absoluteFill}>
        {stars.map((s, i) => (
          <Animated.View
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              borderRadius: s.size / 2,
              backgroundColor: "#fff",
              opacity: s.twinkle,
            }}
          />
        ))}
      </View>

      {/* Overlay with buttons */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Begin Your Journey💖</Text>

        <TouchableOpacity
          onPress={() => router.push("/(room)/createRoom")}
          style={styles.buttonPurple}
        >
          <Text style={styles.buttonText}>Create Room</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(room)/joinRoom")}
          style={styles.buttonBlue}
        >
          <Text style={styles.buttonText}>Join Room</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Exclusively Yours. From this moment on.
        </Text>
      </View>

      {/* Kitty + Click for Hearts */}
      <View style={styles.kittyWrapper}>
        <Pressable
          style={styles.kittyContainer}
          onPress={e => {
            const { locationX, locationY } = e.nativeEvent;
            handleHeartClick(locationX, locationY);
          }}
        >
          <Text style={styles.kittyText}>
{`／＞　 フ
| 　_　_| 
／ ミ_ x ノ 
/　　　　 | 
|　 ヽ　　ﾉ
＼二二二／`}
          </Text>
        </Pressable>
        <TouchableOpacity onPress={(e) => handleHeartClick(width / 2, height / 2)}>
          <Text style={styles.clickText}>Click for hearts 💖</Text>
        </TouchableOpacity>
      </View>

      {/* Floating hearts */}
      {hearts.map(h => (
        <Animated.Text
          key={h.id}
          style={[
            styles.heart,
            {
              left: h.x,
              top: h.y,
              transform: [
                {
                  translateX: heartAnim.interpolate({ inputRange: [0, 1], outputRange: [0, h.offsetX] }),
                },
                {
                  translateY: heartAnim.interpolate({ inputRange: [0, 1], outputRange: [0, h.offsetY] }),
                },
                {
                  scale: heartAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }),
                },
              ],
            },
          ]}
        >
          ❤
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#27273e", // dark blue background
    alignItems: "center", 
    justifyContent: "center" 
  },
  overlay: {
    position: "absolute",
    top: "25%",
    width: "85%",
    backgroundColor: "rgba(33, 25, 53, 0.12)", // pastel pink overlay
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  title: { 
    fontSize: 28, 
    color: "#fff", 
    marginBottom: 30, 
    fontWeight: "600",
  },
  buttonPurple: {
    backgroundColor: "rgba(198, 123, 255, 0.85)", 
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonBlue: {
    backgroundColor: "#27273ea2", 
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { 
    fontSize: 20, 
    color: "#fff",
    fontWeight: "600",
  },
  footerText: {
    marginTop: 20,
    color: "#ffe6f2",
    fontSize: 24,
    fontStyle: "italic",
    textAlign: "center",
    fontWeight: "500",
    fontFamily: "serif",
  },
  kittyWrapper: { 
    position: "absolute", 
    bottom: 20, 
    left: 20, 
    alignItems: "center" 
  },
  kittyContainer: { 
    width: 100, 
    height: 100, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  kittyText: { 
    fontSize: 16, 
    color: "#fff", 
    textAlign: "center", 
    lineHeight: 16 
  },
  clickText: { 
    color: "#fff", 
    marginTop: 10, 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  heart: { 
    position: "absolute", 
    fontSize: 24, 
    zIndex: 10 
  },
});