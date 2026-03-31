# 🏋️‍♂️ FitTrack AI – Mobile Exercise Analysis & Posture Detection

FitTrack AI is a mobile-based intelligent fitness platform that analyzes workout videos (uploaded or live camera) to count repetitions, measure performance, and evaluate exercise posture using real-time pose detection.

---

## 🎯 Key Features

* 📱 Mobile app built with React Native
* 🎥 Upload or capture live workout videos
* 🔢 Automatic counting of exercises (e.g., squats)
* ⏱️ Tracks time taken for workouts
* 🧍 Posture detection using MediaPipe Pose
* ✅ Detects correct vs incorrect exercise form
* ⚡ Real-time feedback and analysis

---

## 🧠 How It Works

1. User records or uploads a workout video via mobile app
2. Frames are processed using MediaPipe Pose
3. Body keypoints are detected in real-time
4. Movement patterns are analyzed
5. Repetitions are counted and posture is evaluated
6. Results are displayed instantly on the app

---

## 📊 Exercise Analysis

* Counts repetitions (e.g., squats, lunges)
* Measures workout duration
* Detects posture errors (e.g., incorrect squat angle)
* Provides actionable feedback for improvement

---

## 🛠️ Tech Stack

| Layer            | Technology             |
| ---------------- | ---------------------- |
| Mobile App       | React Native           |
| Backend          | Python (Flask/FastAPI) |
| Computer Vision  | MediaPipe Pose         |
| Video Processing | OpenCV                 |
| Data Handling    | NumPy                  |

---

## ⚙️ Setup

```bash id="fit2"
git clone https://github.com/your-username/your-repo-name.git
cd fittrack-ai

# Backend
pip install -r requirements.txt
python app.py

# Mobile App
cd mobile
npm install
npx react-native run-android
```

---

## 🔥 Highlights

* Combines **Mobile App + AI + Computer Vision**
* Real-time **pose estimation & exercise tracking**
* Helps users improve **fitness form and performance**

---

## 👩‍💻 Author

Vaishnavi Tandra, Pranavi Manthena, Vyshnavi Arra, Rasagna Kudikyala

---
