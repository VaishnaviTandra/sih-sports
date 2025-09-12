import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function OTPVerificationScreen({ route, navigation }) {
  const { phone } = route.params || {};
  const [otp, setOtp] = useState('');
  const { signIn } = useContext(AuthContext);

  const verify = () => {
    // prototype: accept any OTP
    signIn({ name: 'Athlete ' + (phone || 'User'), phone });
    navigation.replace('ProfileCreate');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Code sent to {phone || 'your phone'}</Text>
      <TextInput style={styles.input} keyboardType="number-pad" value={otp} onChangeText={setOtp} placeholder="Enter OTP" />
      <TouchableOpacity style={styles.primary} onPress={verify}>
        <Text style={styles.primaryText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#6b7280', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', padding: 12, borderRadius: 8, marginTop: 8 },
  primary: { backgroundColor: '#10b981', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  primaryText: { color: '#fff', fontWeight: '700' },
});
