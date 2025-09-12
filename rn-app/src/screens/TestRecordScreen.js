import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import { Video } from "expo-av";

export default function TestRecordScreen({ route, navigation }) {
  const { test, action, preselectedVideoUri } = route.params || {};
  const [hasPermission, setHasPermission] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(preselectedVideoUri || null);
  const cameraRef = useRef(null);

  // Safe fallback for Camera.Constants when running in a client that doesn't
  // expose the native expo-camera constants (prevents TypeError: Cannot read property 'Type' of undefined)
  const CamConsts = (Camera && Camera.Constants) ? Camera.Constants : { Type: { back: 'back', front: 'front' }, VideoQuality: {} };

  useEffect(() => {
    (async () => {
      // If we are here because the user uploaded a video, we don't need camera permissions.
      if (action === 'upload' && preselectedVideoUri) {
        setVideoUri(preselectedVideoUri);
        setHasPermission(true);
        return;
      }

      // Guard permission requests in case expo-camera native helpers are not available
      if (Camera && Camera.requestCameraPermissionsAsync && Camera.requestMicrophonePermissionsAsync) {
        try {
          const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
          const { status: micStatus } = await Camera.requestMicrophonePermissionsAsync();
          const granted = cameraStatus === "granted" && micStatus === "granted";
          setHasPermission(granted);
          if (!granted) {
            Alert.alert("Permission required", "Camera and microphone access are needed to record video.");
          }
        } catch (err) {
          console.log('Camera permission error', err);
          setHasPermission(false);
          Alert.alert('Camera unavailable', 'Camera permissions cannot be requested in this client. Use Expo Go matching SDK or a development client.');
        }
      } else {
        console.log('expo-camera native module not available');
        setHasPermission(false);
      }
    })();
  }, []);

  const startRecording = async () => {
    if (!cameraRef.current) {
      console.log("❌ Camera ref not ready");
      Alert.alert("Error", "Camera not ready yet.");
      return;
    }
    try {
      console.log("▶ Starting recording...");
      setRecording(true);
      // Use guarded CamConsts for video quality when available
      const quality = (CamConsts && CamConsts.VideoQuality && CamConsts.VideoQuality['480p']) ? CamConsts.VideoQuality['480p'] : undefined;
      const video = await cameraRef.current.recordAsync({ maxDuration: 60, quality });
      console.log("✅ Video recorded:", video.uri);
      setVideoUri(video.uri);
    } catch (err) {
      console.log("❌ Recording error:", err);
      Alert.alert("Recording Error", err?.message || "Unknown error");
    } finally {
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      console.log("⏹ Stopping recording...");
      cameraRef.current.stopRecording();
    }
  };

  if (hasPermission === null) return <ActivityIndicator />;
  // If permissions are false and user intended to record, show guidance; if they intended upload but no videoUri, show message.
  if (hasPermission === false) {
    if (action === 'upload') {
      return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>No Uploaded Video</Text>
          <Text style={{ textAlign: 'center', color: '#475569' }}>No uploaded video was found. Please go back and upload one.</Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Camera unavailable</Text>
        <Text style={{ textAlign: 'center', color: '#475569' }}>
          The camera or microphone is not available in this client. If you are using Expo Go, make sure you have the matching Expo Go version for SDK 53 or use a custom development client.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {!videoUri && action === "record" && (
        <Camera
          style={{ flex: 1 }}
          ref={cameraRef}
          // guarded access to Camera.Constants.Type
          type={CamConsts && CamConsts.Type ? CamConsts.Type.back : 'back'}
          ratio="16:9"
          onCameraReady={() => console.log("✅ Camera ready")}
          onMountError={(err) => {
            console.log("❌ Camera mount error:", err);
            Alert.alert("Camera Error", JSON.stringify(err));
          }}
        />
      )}

      {/* If user uploaded a video or we have a recorded uri, show the player */}

      {videoUri && (
        <Video
          source={{ uri: videoUri }}
          style={{ flex: 1 }}
          useNativeControls
          resizeMode="contain"
        />
      )}

      {/* Controls */}
      <View style={styles.controls}>
        {!videoUri && action === "record" && !recording && (
          <TouchableOpacity style={styles.button} onPress={startRecording}>
            <Text style={styles.text}>🎥 Start Recording</Text>
          </TouchableOpacity>
        )}
        {!videoUri && action === "record" && recording && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "red" }]}
            onPress={stopRecording}
          >
            <Text style={styles.text}>⏹ Stop Recording</Text>
          </TouchableOpacity>
        )}
        {videoUri && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.text}>✅ Done</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});