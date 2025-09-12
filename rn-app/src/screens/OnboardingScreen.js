import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <View style={styles.logoGlow} />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.title}>Sports India</Text>
        <Text style={styles.subtitle}>Train. Test. Triumph.</Text>
        <Text style={styles.description}>
          Discover your athletic potential with India's premier sports testing platform
        </Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.actions,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.primary} 
          onPress={() => navigation.navigate('ProfileCreate')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.ghost} 
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.7}
        >
          <Text style={styles.ghostText}>Skip (demo)</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  logo: { 
    width: 140, 
    height: 140, 
    borderRadius: 20,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    opacity: 0.1,
    zIndex: -1,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 18, 
    color: '#2563eb', 
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actions: { 
    width: '100%', 
    gap: 16,
    paddingHorizontal: 8,
  },
  primary: { 
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
  primaryText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16,
  },
  ghost: { 
    padding: 16, 
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ghostText: { 
    color: '#64748b',
    fontWeight: '600',
    fontSize: 16,
  },
});
