import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ExpoCamera from "expo-camera";
import * as AV from "expo-av"; // if using SDK 54+, replace with expo-video

export default function TestRecordScreen({ route, navigation }) {
  const { test, action, preselectedVideoUri } = route.params || {};
  const [hasPermission, setHasPermission] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(preselectedVideoUri || null);
  const cameraRef = useRef(null);
  // Resolve Camera and Video components and constants robustly
  const CameraComp = ExpoCamera && (ExpoCamera.Camera || ExpoCamera.default || ExpoCamera);
  const VideoComp = AV && (AV.Video || AV.default || AV);
  const CamConsts = (ExpoCamera && ExpoCamera.Constants)
    ? ExpoCamera.Constants
    : (ExpoCamera && ExpoCamera.Camera && ExpoCamera.Camera.Constants)
    ? ExpoCamera.Camera.Constants
    : { Type: { back: 'back', front: 'front' }, VideoQuality: {} };

  // Try different permission APIs depending on expo-camera version
  const ensureCameraAndMicPermissions = async () => {
    let cameraStatus = 'denied';
    let micStatus = 'denied';
    try {
      // camera permission
      if (ExpoCamera.requestCameraPermissionsAsync) {
        const res = await ExpoCamera.requestCameraPermissionsAsync();
        cameraStatus = res?.status ?? cameraStatus;
      } else if (ExpoCamera.requestPermissionsAsync) {
        const res = await ExpoCamera.requestPermissionsAsync();
        cameraStatus = res?.status ?? cameraStatus;
      } else if (ExpoCamera.Camera && ExpoCamera.Camera.requestPermissionsAsync) {
        const res = await ExpoCamera.Camera.requestPermissionsAsync();
        cameraStatus = res?.status ?? cameraStatus;
      } else if (ExpoCamera.getPermissionsAsync) {
        const res = await ExpoCamera.getPermissionsAsync();
        cameraStatus = (res && (res.status || (res.camera && res.camera.status))) ?? cameraStatus;
      }

      // microphone / audio permission
      if (ExpoCamera.requestMicrophonePermissionsAsync) {
        const res = await ExpoCamera.requestMicrophonePermissionsAsync();
        micStatus = res?.status ?? micStatus;
      } else if (ExpoCamera.requestAudioRecordingPermissionsAsync) {
        const res = await ExpoCamera.requestAudioRecordingPermissionsAsync();
        micStatus = res?.status ?? micStatus;
      } else if (ExpoCamera.getPermissionsAsync) {
        const res = await ExpoCamera.getPermissionsAsync();
        micStatus = (res && (res.status || (res.microphone && res.microphone.status))) ?? micStatus;
      }
    } catch (err) {
      console.log('permission helper error', err);
    }
    return { cameraStatus, micStatus };
  };

  useEffect(() => {
    (async () => {
      if (action === "upload" && preselectedVideoUri) {
        setVideoUri(preselectedVideoUri);
        setHasPermission(true);
        return;
      }

      try {
        const { cameraStatus, micStatus } = await ensureCameraAndMicPermissions();
        const granted = cameraStatus === 'granted' && micStatus === 'granted';
        setHasPermission(granted);
        if (!granted) {
          Alert.alert('Permission required', 'Camera and microphone access are needed to record video.');
        }
      } catch (err) {
        console.log('Camera permission error', err);
        setHasPermission(false);
        Alert.alert('Camera unavailable', 'Cannot request camera permissions. Use matching Expo Go or a development client.');
      }
    })();
  }, []);

  const startRecording = async () => {
    if (!cameraRef.current) {
      Alert.alert("Error", "Camera not ready yet.");
      return;
    }
    try {
      setRecording(true);
      const quality = (CamConsts && CamConsts.VideoQuality && CamConsts.VideoQuality['480p']) ? CamConsts.VideoQuality['480p'] : undefined;
      const video = await cameraRef.current.recordAsync({ maxDuration: 60, quality });
      setVideoUri(video.uri);
    } catch (err) {
      console.log("Recording error:", err);
      Alert.alert("Recording Error", err?.message || "Unknown error");
    } finally {
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  if (hasPermission === null) return <ActivityIndicator />;

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>
          {action === "upload" ? "No Uploaded Video" : "Camera unavailable"}
        </Text>
        <Text style={styles.subtitle}>
          {action === "upload"
            ? "No uploaded video found. Please go back and upload one."
            : "Camera or microphone is not available. Use matching Expo Go or a custom dev client."}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {!videoUri && action === "record" ? (
        (CameraComp && (typeof CameraComp === 'function' || typeof CameraComp === 'string')) ? (
          <CameraComp
            style={{ flex: 1 }}
            ref={cameraRef}
            type={CamConsts && CamConsts.Type ? CamConsts.Type.back : 'back'}
            ratio="16:9"
            onCameraReady={() => console.log("Camera ready")}
            onMountError={(err) => Alert.alert("Camera Error", JSON.stringify(err))}
          />
        ) : (
          <View style={styles.center}>
            <Text style={styles.title}>Camera component not available</Text>
            <Text style={styles.subtitle}>Use a matching Expo Go or a dev client that includes native camera modules.</Text>
          </View>
        )
      ) : (
        videoUri && (
          (VideoComp && (typeof VideoComp === 'function' || typeof VideoComp === 'string')) ? (
            <VideoComp
              source={{ uri: videoUri }}
              style={{ flex: 1 }}
              useNativeControls
              resizeMode="contain"
            />
          ) : (
            <View style={styles.center}>
              <Text style={styles.title}>Player not available</Text>
              <Text style={styles.subtitle}>Video playback is not available in this client.</Text>
            </View>
          )
        )
      )}

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
            onPress={() => navigation.navigate('VideoReview', { videoUri, test })}
          >
            <Text style={styles.text}>✅ Review & Submit</Text>
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
  center: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: "#fff" },
  subtitle: { textAlign: "center", color: "#ccc" },
});
