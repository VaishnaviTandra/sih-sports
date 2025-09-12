import React, { useRef, useEffect, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

export default function PoseDetectorWeb({
  modelComplexity = 1,
  minDetectionConfidence = 0.5,
  minTrackingConfidence = 0.5,
  downThreshold = 70,
  upThreshold = 110
}) {
  const videoRef = useRef(null);
  const poseRef = useRef(null);
  const cameraRef = useRef(null);
  const [landmarks, setLandmarks] = useState(null);
  const [repCount, setRepCount] = useState(0);
  const isDownRef = useRef(false);

  const angleBetweenPoints = (a, b, c) => {
    if (!a || !b || !c) return null;
    const v1 = { x: a.x - b.x, y: a.y - b.y, z: (a.z || 0) - (b.z || 0) };
    const v2 = { x: c.x - b.x, y: c.y - b.y, z: (c.z || 0) - (b.z || 0) };
    const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
    if (mag1 === 0 || mag2 === 0) return null;
    let cos = dot / (mag1 * mag2);
    cos = Math.min(1, Math.max(-1, cos));
    const rad = Math.acos(cos);
    return (rad * 180) / Math.PI;
  };

  const detectSquatAndCount = (poseLandmarks) => {
    if (!poseLandmarks || poseLandmarks.length === 0) return;
    const leftHip = poseLandmarks[23];
    const rightHip = poseLandmarks[24];
    const leftKnee = poseLandmarks[25];
    const rightKnee = poseLandmarks[26];
    const leftAnkle = poseLandmarks[27];
    const rightAnkle = poseLandmarks[28];

    const leftKneeAngle = angleBetweenPoints(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = angleBetweenPoints(rightHip, rightKnee, rightAnkle);
    const kneeAngles = [leftKneeAngle, rightKneeAngle].filter(v => v !== null);
    if (kneeAngles.length === 0) return;
    const currentAngle = Math.min(...kneeAngles);

    if (!isDownRef.current && currentAngle <= downThreshold) {
      isDownRef.current = true;
    }
    if (isDownRef.current && currentAngle >= upThreshold) {
      isDownRef.current = false;
      setRepCount(prev => prev + 1);
    }
  };

  const handleResults = (results) => {
    if (!results) return;
    const lm = results.poseLandmarks || null;
    if (lm) {
      setLandmarks(lm);
      detectSquatAndCount(lm);
    } else {
      setLandmarks(null);
    }
  };

  useEffect(() => {
    const pose = new Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@latest/${file}` });
    pose.setOptions({ modelComplexity, minDetectionConfidence, minTrackingConfidence });
    pose.onResults(handleResults);
    poseRef.current = pose;

    const startCamera = async () => {
      if (!videoRef.current || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('Camera not available in this environment.');
        return;
      }
      try {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (poseRef.current && videoRef.current) {
              await poseRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
          facingMode: 'environment'
        });
        cameraRef.current = camera;
        camera.start();
      } catch (err) {
        console.error('Failed to start camera', err);
      }
    };

    startCamera();
    return () => {
      try { if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop(); } catch (e) {}
      try { if (poseRef.current && poseRef.current.close) poseRef.current.close(); } catch (e) {}
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 640, height: 480, background: '#000' }}>
        <video ref={videoRef} style={{ width: 640, height: 480, objectFit: 'cover' }} playsInline muted autoPlay />
        <div style={{ position: 'absolute', left: 12, top: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '8px 12px', borderRadius: 8, fontWeight: '700' }}>
          Reps: {repCount}
        </div>
      </div>
      <div style={{ marginTop: 12, width: 640, background: '#fff', padding: 12, borderRadius: 8 }}>
        <div style={{ fontWeight: '700', marginBottom: 8 }}>Latest landmarks (x,y,z) — first 10 shown</div>
        {landmarks ? (
          <pre style={{ maxHeight: 160, overflow: 'auto', margin: 0 }}>
            {JSON.stringify(landmarks.slice(0, 10).map(l => ({ x: Number(l.x.toFixed(3)), y: Number(l.y.toFixed(3)), z: Number((l.z||0).toFixed(3)) })), null, 2)}
          </pre>
        ) : (
          <div style={{ color: '#555' }}>No pose detected yet.</div>
        )}
      </div>
    </div>
  );
}
