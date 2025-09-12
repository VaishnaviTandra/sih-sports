import React from 'react';
import PoseDetector from '../components/PoseDetector';

export default function PoseScreen() {
  // Platform-resolved import: Metro will select PoseDetector.android.js / .native.js on mobile
  // and PoseDetector.web.jsx on web. This avoids bundling web-only deps on Android.
  return <PoseDetector />;
}
