import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function ProfileCreateScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    sportInterest: '',
    profilePicture: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ Pick from Gallery
  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Please allow media access to choose a profile image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setFormData(prev => ({ ...prev, profilePicture: { uri: asset.uri } }));
    }
  };

  // ✅ Capture from Camera
  const captureFromCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Please allow camera access to take a profile image.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setFormData(prev => ({ ...prev, profilePicture: { uri: asset.uri } }));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '' && formData.age.trim() !== '';
      case 2:
        return formData.gender !== '' && formData.location.trim() !== '';
      case 3:
        return formData.sportInterest.trim() !== '';
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      Alert.alert('Please fill in all required fields');
    }
  };

  const handleSubmit = () => {
    console.log('Profile created:', formData);
    Alert.alert(
      'Profile Created!',
      'Welcome to Sports India! Your profile has been created successfully.',
      [
        {
          text: 'Continue',
          onPress: () => navigation.navigate('Main'),
        },
      ]
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
          placeholder="Enter your full name"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={(text) => handleInputChange('age', text)}
          placeholder="Enter your age"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Details</Text>
      <Text style={styles.stepSubtitle}>Help us personalize your experience</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender *</Text>
        <View style={styles.genderContainer}>
          {['Male', 'Female', 'Other'].map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.genderOption,
                formData.gender === gender && styles.genderOptionSelected,
              ]}
              onPress={() => handleInputChange('gender', gender)}
            >
              <Text
                style={[
                  styles.genderText,
                  formData.gender === gender && styles.genderTextSelected,
                ]}
              >
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location *</Text>
        <TextInput
          style={styles.input}
          value={formData.location}
          onChangeText={(text) => handleInputChange('location', text)}
          placeholder="City, State"
          placeholderTextColor="#9ca3af"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Sport Interest</Text>
      <Text style={styles.stepSubtitle}>What sports are you interested in?</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Primary Sport Interest *</Text>
        <TextInput
          style={styles.input}
          value={formData.sportInterest}
          onChangeText={(text) => handleInputChange('sportInterest', text)}
          placeholder="e.g., Cricket, Football, Athletics, etc."
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Profile Picture (Optional)</Text>
        <View style={styles.photoActions}>
          <TouchableOpacity style={styles.photoBtn} onPress={pickFromGallery}>
            <Text style={styles.photoBtnText}>Upload from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoBtn} onPress={captureFromCamera}>
            <Text style={styles.photoBtnText}>Capture Photo</Text>
          </TouchableOpacity>
        </View>
        {formData.profilePicture && (
          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <Image
              source={{ uri: formData.profilePicture.uri }}
              style={styles.profileImage}
            />
          </View>
        )}
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Profile</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>
            {currentStep} of {totalSteps}
          </Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${(currentStep / totalSteps) * 100}%` },
          ]}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !validateStep(currentStep) && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!validateStep(currentStep)}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? 'Create Profile' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: { padding: 8 },
  backButtonText: { fontSize: 16, color: '#2563eb', fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  stepIndicator: { padding: 8 },
  stepText: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  progressBar: { height: 4, backgroundColor: '#e2e8f0' },
  progressFill: { height: '100%', backgroundColor: '#2563eb' },
  content: { flex: 1, padding: 20 },
  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  stepSubtitle: { fontSize: 16, color: '#64748b', marginBottom: 32 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  genderContainer: { flexDirection: 'row', gap: 12 },
  genderOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  genderOptionSelected: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  genderText: { fontSize: 16, color: '#374151', fontWeight: '500' },
  genderTextSelected: { color: '#2563eb', fontWeight: '600' },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2563eb',
  },
  photoActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  photoBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  photoBtnText: { color: '#111827', fontWeight: '600' },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  nextButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: { backgroundColor: '#9ca3af', shadowOpacity: 0, elevation: 0 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
