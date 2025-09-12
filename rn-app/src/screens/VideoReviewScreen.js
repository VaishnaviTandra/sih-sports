import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as AV from 'expo-av';

export default function VideoReviewScreen({ route, navigation }) {
  const { videoUri, test, autoAnalyze } = route.params || {};
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const VideoComp = AV && (AV.Video || AV.default || AV);

  const handleAnalyzeAndSubmit = async () => {
    setLoading(true);
    try {
      let durationMillis = 0;
      if (videoRef.current && videoRef.current.getStatusAsync) {
        const status = await videoRef.current.getStatusAsync();
        durationMillis = status?.durationMillis || 0;
      }

      const durationSec = Math.round((durationMillis || 0) / 1000);

      // Simple mock analysis based on test type. Replace with real ML logic later.
      let value = null;
      let unit = '';

      switch ((test && test.id) || '') {
        case '1': // Sprint 100m -> time in seconds
          value = durationSec || null;
          unit = 's';
          break;
        case '2': // Vertical Jump -> we can't estimate from video here, mark N/A
          value = 'N/A';
          unit = '';
          break;
        default:
          value = durationSec || null;
          unit = 's';
      }

      // If analysis couldn't derive a value (e.g. duration 0) provide dummy sample data
      if (!value || value === null || value === 'N/A') {
        const dummyMap = {
          '1': { value: 12.34, unit: 's' }, // Sprint 100m
          '2': { value: 0.45, unit: 'm' }, // Vertical jump (meters)
          '3': { value: 8.2, unit: 's' }, // Agility shuttle (time)
          '4': { value: 480, unit: 's' }, // Endurance (seconds)
        };
        const d = dummyMap[(test && test.id) || '1'];
        value = d.value;
        unit = d.unit;
      }

      const result = {
        test: test?.title || 'Unnamed Test',
        value,
        unit,
        mode: 'video',
        duration: durationSec,
        timestamp: Date.now(),
        videoUri,
      };

      // Navigate to the submission screen with the computed result
      navigation.navigate('TestSubmission', { result, test });
    } catch (err) {
      console.log('Analyze error', err);
      Alert.alert('Analysis failed', 'Could not analyze the video. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoAnalyze) {
      // run analysis automatically for uploads
      handleAnalyzeAndSubmit();
    }
  }, [autoAnalyze]);

  if (!videoUri) return (
    <View style={styles.center}>
      <Text>No video provided to review.</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {VideoComp ? (
        <VideoComp
          ref={videoRef}
          source={{ uri: videoUri }}
          style={{ flex: 1 }}
          useNativeControls
          resizeMode="contain"
        />
      ) : (
        <View style={styles.center}>
          <Text style={{ textAlign: 'center' }}>Video player not available in this client.</Text>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.text}>✏️ Edit / Re-upload</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#10b981' }]} onPress={handleAnalyzeAndSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>🧠 Analyze & Submit</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  controls: { padding: 16, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between' },
  button: { flex: 1, backgroundColor: '#2563eb', padding: 14, borderRadius: 10, marginHorizontal: 6, alignItems: 'center' },
  text: { color: '#fff', fontWeight: '700' },
});
