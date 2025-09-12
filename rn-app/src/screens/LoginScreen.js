import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const { signIn, saveReferenceFace } = useContext(AuthContext);
  const [selfieUri, setSelfieUri] = useState(null);
  const [detectedBounds, setDetectedBounds] = useState(null);

  const sendOTP = () => {
    // prototype: navigate to OTP screen; in real app integrate SMS/OTP
    navigation.navigate('OTP', { phone });
  };

  const captureSelfie = async () => {
    const camPerm = await ImagePicker.requestCameraPermissionsAsync();
    if (!camPerm.granted) {
      Alert.alert('Permission required', 'Camera access is required to capture your face.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: [ImagePicker.MediaType.image],
      quality: 0.8,
    });
    if (res.canceled) return;
    const asset = res.assets && res.assets[0];
    if (!asset) return;
    setSelfieUri(asset.uri);
    try {
      const FaceDetector = await import('expo-face-detector');
      const detection = await FaceDetector.detectFacesAsync(asset.uri, {
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.none,
      });
      if (!detection.faces || detection.faces.length === 0) {
        setDetectedBounds(null);
        Alert.alert('No face detected', 'Please try again with your face clearly visible.');
        return;
      }
      const face = detection.faces[0];
      setDetectedBounds(face.bounds);
      saveReferenceFace({ uri: asset.uri, bounds: face.bounds });
      Alert.alert('Face saved', 'Your reference face has been saved.');
    } catch (e) {
      // Fallback when native module isn't available in Expo Go
      setDetectedBounds({ origin: { x: 0, y: 0 }, size: { width: 1, height: 1 } });
      saveReferenceFace({ uri: asset.uri, bounds: { origin: { x: 0, y: 0 }, size: { width: 1, height: 1 } } });
      Alert.alert('Face module unavailable', 'Saved selfie without detection (dev mode).');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login / Sign up</Text>
      <Text style={styles.label}>Phone number</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
      />
      <TouchableOpacity style={styles.secondary} onPress={captureSelfie}>
        <Text style={styles.secondaryText}>{selfieUri ? 'Retake Selfie' : 'Capture Selfie'}</Text>
      </TouchableOpacity>
      {selfieUri && (
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Image source={{ uri: selfieUri }} style={{ width: 160, height: 160, borderRadius: 80 }} />
          <Text style={{ marginTop: 6, color: detectedBounds ? '#16a34a' : '#ef4444' }}>
            {detectedBounds ? 'Face detected' : 'No face found'}
          </Text>
        </View>
      )}
      <TouchableOpacity style={styles.primary} onPress={sendOTP}>
        <Text style={styles.primaryText}>Send OTP</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.ghost} onPress={() => { signIn({ name: 'Demo Athlete' }); navigation.replace('Main'); }}>
        <Text style={styles.ghostText}>Continue as demo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  label: { fontSize: 14, color: '#374151', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', padding: 12, borderRadius: 8, marginTop: 8 },
  primary: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: { backgroundColor: '#f1f5f9', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  secondaryText: { color: '#111827', fontWeight: '600' },
  ghost: { padding: 12, alignItems: 'center', marginTop: 12 },
  ghostText: { color: '#374151' },
});
