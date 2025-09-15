import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { db } from "../../firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

// Replace these with your Cloudinary info
const CLOUD_NAME = "<dmhn8f3al>";
const UPLOAD_PRESET = "<eterna>";

export default function PebblesScreen() {
  const [pebbles, setPebbles] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openDate, setOpenDate] = useState(null); // user must choose
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchPebbles();
  }, []);

  const fetchPebbles = async () => {
    try {
      const q = query(collection(db, "pebbles"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setPebbles(list);
    } catch (err) {
      console.log("Error fetching pebbles:", err);
    }
  };

  const uploadToCloudinary = async (uri, type) => {
    try {
      const data = new FormData();
      data.append("file", {
        uri,
        type: type === "audio" ? "audio/mpeg" : "image/jpeg",
        name: `${Date.now()}.${type === "audio" ? "mp3" : "jpg"}`,
      });
      data.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${dmhn8f3al}/${type === "audio" ? "video" : "image"}/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const json = await res.json();
      return json.secure_url;
    } catch (err) {
      console.log("Cloudinary upload error:", err);
      Alert.alert("Upload Error", "Failed to upload file.");
    }
  };

  const savePebble = async (type, content, fileUri) => {
    if (type === "text" && content.trim().length === 0) {
      Alert.alert("Empty Pebble", "Please write something!");
      return;
    }

    if (!openDate) {
      Alert.alert("Open Date Required", "Please choose a date for when the pebble should open.");
      return;
    }

    setUploading(true);
    let fileUrl = null;
    if (fileUri) {
      fileUrl = await uploadToCloudinary(fileUri, type);
    }

    try {
      const newPebble = {
        type,
        content,
        fileUrl,
        openAt: openDate,
        createdAt: new Date(),
      };
      await addDoc(collection(db, "pebbles"), newPebble);
      setPebbles([newPebble, ...pebbles]);
      setTextInput("");
      setOpenDate(null);
      Alert.alert("Pebble Saved!", "Your pebble is safely tucked away ✨");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not save pebble.");
    } finally {
      setUploading(false);
    }
  };

  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
    if (result.type === "success") {
      savePebble("audio", "Audio Pebble", result.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      savePebble("image", "Image Pebble", result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>✨ Pebbles ✨</Text>

      <TextInput
        placeholder="Write your thought..."
        placeholderTextColor="#aaa"
        style={styles.input}
        value={textInput}
        onChangeText={setTextInput}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={() => savePebble("text", textInput, null)}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Save Text Pebble</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={pickAudio}>
        <Text style={styles.btnText}>Upload Audio Pebble</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text style={styles.btnText}>Upload Image Pebble</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.btnText}>Choose Open Date</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={openDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setOpenDate(selectedDate);
          }}
        />
      )}

      {openDate && (
        <Text style={styles.cuteMsg}>
          🪨 This pebble will open on: {openDate.toDateString()}
        </Text>
      )}

      <FlatList
        data={pebbles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const locked = new Date(item.openAt) > new Date();
          return (
            <View style={styles.pebbleItem}>
              <Text style={styles.pebbleType}>{item.type.toUpperCase()}</Text>
              {item.type === "text" && <Text style={{ color: "#eee" }}>{item.content}</Text>}
              {item.type === "image" && item.fileUrl && (
                <Image
                  source={{ uri: item.fileUrl }}
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                />
              )}
              {item.type === "audio" && item.fileUrl && (
                <Text style={{ color: "#eee" }}>🎵 Audio pebble saved</Text>
              )}
              <Text style={{ fontStyle: "italic", color: "#bbb", marginTop: 4 }}>
                {locked
                  ? `🔒 Opens on: ${new Date(item.openAt).toDateString()}`
                  : "✅ Pebble is unlocked!"}
              </Text>
            </View>
          );
        }}
      />

      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/(main)/journey")}>
          <Ionicons name="planet" size={28} color="#a29bfe" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(main)/dashboard")}>
          <Ionicons name="home" size={28} color="#a29bfe" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(main)/pebble")}>
          <Ionicons name="diamond" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0a0a23" },
  header: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#3d3d5c",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    color: "#fff",
    backgroundColor: "#1e1e3f",
  },
  btn: {
    backgroundColor: "#6C63FF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  btnSecondary: {
    backgroundColor: "#FFD580",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  btnText: { color: "#0a0a23", textAlign: "center", fontWeight: "bold" },
  cuteMsg: { marginVertical: 10, fontStyle: "italic", color: "#aaa" },
  pebbleItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#3d3d5c",
    borderRadius: 8,
    marginVertical: 6,
    backgroundColor: "#1a1a3c",
  },
  pebbleType: { fontWeight: "bold", color: "#a29bfe", marginBottom: 4 },
  navbar: {
    height: 60,
    backgroundColor: "#151530",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#2c2c54",
  },
});
