import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ETERNA</Text>
      <Text style={styles.tagline}>where love leaves footprints</Text>

      <View style={styles.buttons}>
        <Link href="/auth/signIn" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/auth/signUp" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1B3A", // deep navy
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "bold",
    letterSpacing: 3,
    marginBottom: 8,
  },
  tagline: {
    color: "#CFC7F8",
    fontSize: 14,
    marginBottom: 60,
    letterSpacing: 1,
  },
  buttons: {
    width: "100%",
    gap: 16,
  },
  button: {
    backgroundColor: "#F4C3F9", // soft pink
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#1E1B3A",
    fontSize: 18,
    fontWeight: "600",
  },
});
