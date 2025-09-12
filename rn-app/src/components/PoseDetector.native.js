import React from 'react';
import { View, Text } from 'react-native';

export default function PoseDetectorNative() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Pose Detector</Text>
      <Text style={{ textAlign: 'center', color: '#555' }}>
        The MediaPipe web pose detector is only available on web. To test pose detection on mobile, open the app in a browser (expo start --web) or embed a webview that points to the web detector.
      </Text>
    </View>
  );
}
