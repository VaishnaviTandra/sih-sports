import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function TestInstructionScreen({ route, navigation }) {
  const test = route?.params?.test ?? null;

  const goToRecord = (action, preselectedVideoUri = null) => {
    navigation.navigate("TestRecord", { test, action, preselectedVideoUri });
  };

  const handleUploadRecording = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission required", "Please allow media library access.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
    });
    if (result.canceled) return;

    const asset = result.assets?.[0];
  if (asset) navigation.navigate('VideoReview', { videoUri: asset.uri, test, autoAnalyze: true });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{test?.title || "Fitness Test"}</Text>
        <Text style={styles.subtitle}>
          {test?.description || "Follow the instructions before recording."}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get Started</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => goToRecord("record")}
        >
          <Text style={styles.buttonText}>⏺ Start Recording</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleUploadRecording}>
          <Text style={styles.buttonText}>📁 Upload Recording</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#555" },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});