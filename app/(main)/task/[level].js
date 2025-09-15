// app/(main)/task/[level].js
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { tasksConfig } from "../../../taskConfig"; 
import { db } from "../../../firebase";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";

export default function TaskScreen() {
  const { level, roomId } = useLocalSearchParams();
  const task = tasksConfig[level];

  const [journalText, setJournalText] = useState("");
  const [image, setImage] = useState(null);
  const [myEntry, setMyEntry] = useState(null);
  const [partnerEntry, setPartnerEntry] = useState(null);

  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  // live listener for partner/my entries
  useEffect(() => {
    if (!roomId || !uid) return;

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const tasks = data?.journeyProgress?.completedTasks?.[level];
        if (tasks) {
          setMyEntry(tasks[uid] || null);
          const partner = Object.entries(tasks).find(([id]) => id !== uid)?.[1];
          setPartnerEntry(partner || null);
        }
      }
    });

    return () => unsubscribe();
  }, [roomId, level]);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>No task found for level {level}</Text>
      </View>
    );
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async (uri) => {
    const data = new FormData();
    data.append("file", {
      uri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    data.append("upload_preset", "YOUR_PRESET"); // replace with your unsigned upload preset
    data.append("cloud_name", "YOUR_CLOUD_NAME");

    const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    if (!result.secure_url) throw new Error("Cloudinary upload failed");
    return result.secure_url;
  };

  const handleSubmit = async () => {
    if (!uid) return;

    let dataToSave = {
      type: task.type,
      prompt: task.prompt,
      completedAt: new Date().toISOString(),
    };

    if (task.type === "journal") {
      dataToSave.answer = journalText;
    } else if (task.type === "task" && image) {
      try {
        const imageUrl = await uploadToCloudinary(image);
        dataToSave.imageUrl = imageUrl;
      } catch (err) {
        console.error("Upload error:", err);
        alert("Image upload failed");
        return;
      }
    }

    try {
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, {
        [`journeyProgress.completedTasks.${level}.${uid}`]: dataToSave,
      });

      alert("Saved successfully!");
    } catch (err) {
      console.error("Firestore update failed:", err);
      alert("Could not save task.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.prompt}>{task.prompt}</Text>

      {/* Task input */}
      {!myEntry && (
        <>
          {task.type === "journal" ? (
            <TextInput
              style={styles.input}
              placeholder="Write your thoughts..."
              value={journalText}
              onChangeText={setJournalText}
              multiline
            />
          ) : (
            <>
              {image && <Image source={{ uri: image }} style={styles.preview} />}
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Pick an Image</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Show entries */}
      {myEntry && (
        <View style={styles.entryBox}>
          <Text style={styles.entryTitle}>Your Entry</Text>
          {myEntry.answer && <Text style={styles.entryText}>{myEntry.answer}</Text>}
          {myEntry.imageUrl && <Image source={{ uri: myEntry.imageUrl }} style={styles.preview} />}
        </View>
      )}

      {partnerEntry && (
        <View style={styles.entryBox}>
          <Text style={styles.entryTitle}>Partner's Entry</Text>
          {partnerEntry.answer && <Text style={styles.entryText}>{partnerEntry.answer}</Text>}
          {partnerEntry.imageUrl && <Image source={{ uri: partnerEntry.imageUrl }} style={styles.preview} />}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#F2C7F2", padding: 20 },
  prompt: { fontSize: 20, fontWeight: "600", marginBottom: 20, color: "#27273E" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  preview: { width: "100%", height: 200, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: "#27273E", padding: 12, borderRadius: 8, marginBottom: 15 },
  buttonText: { color: "#fff", textAlign: "center" },
  saveButton: { backgroundColor: "#222", padding: 15, borderRadius: 10 },
  saveText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  entryBox: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginTop: 20 },
  entryTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  entryText: { fontSize: 16, color: "#333" },
});
