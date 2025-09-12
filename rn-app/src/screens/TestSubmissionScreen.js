import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Animated,
  Dimensions,
  Alert,
  Image
} from 'react-native';

const { width } = Dimensions.get('window');

export default function TestSubmissionScreen({ route, navigation }) {
  const { result, test } = route.params || {};
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = () => {
    Alert.alert(
      'Test Submitted Successfully!',
      'Your test results have been recorded. You can view your performance and compare with benchmarks.',
      [
        {
          text: 'View Performance',
          onPress: () => navigation.navigate('Performance', { result })
        }
      ]
    );
  };

  const handleReattempt = () => {
    Alert.alert(
      'Reattempt Test',
      'Are you sure you want to retake this test? Your current results will be discarded.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reattempt', 
          onPress: () => navigation.navigate('TestRecord', { test })
        }
      ]
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ResultCard = ({ title, value, icon, color = '#2563eb' }) => (
    <Animated.View 
      style={[
        styles.resultCard,
        { 
          borderLeftColor: color,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.resultHeader}>
        <Text style={styles.resultIcon}>{icon}</Text>
        <Text style={styles.resultTitle}>{title}</Text>
      </View>
      <Text style={[styles.resultValue, { color }]}>{value}</Text>
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.title}>Test Results</Text>
        <Text style={styles.subtitle}>Review your test data before submission</Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Test Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Information</Text>
          <View style={styles.testInfoCard}>
            <View style={styles.testInfoHeader}>
              <Text style={styles.testName}>{test?.title}</Text>
              <Text style={styles.testId}>#{test?.id}</Text>
            </View>
            <Text style={styles.testDescription}>
              {result?.test} completed successfully
            </Text>
            <Text style={styles.testTimestamp}>
              {formatTimestamp(result?.timestamp)}
            </Text>
          </View>
        </View>

        {/* Results Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Results</Text>
          <View style={styles.resultsGrid}>
            <ResultCard
              title="Test Result"
              value={`${result?.value} ${result?.unit}`}
              icon="📊"
              color="#10b981"
            />
            <ResultCard
              title="Input Mode"
              value={result?.mode === 'video' ? 'Video Recording' : 'Manual Input'}
              icon={result?.mode === 'video' ? '📹' : '✏️'}
              color="#3b82f6"
            />
            {result?.duration && (
              <ResultCard
                title="Duration"
                value={`${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}`}
                icon="⏱️"
                color="#f59e0b"
              />
            )}
            <ResultCard
              title="Status"
              value="Ready to Submit"
              icon="✅"
              color="#10b981"
            />
          </View>
        </View>

        {/* Video Preview (if applicable) */}
        {result?.videoUri && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Video Recording</Text>
            <View style={styles.videoCard}>
              <Image source={{ uri: result.videoUri }} style={styles.videoThumbnail} />
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>Test Video</Text>
                <Text style={styles.videoDescription}>
                  Your test performance has been recorded
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Performance Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Preview</Text>
          <View style={styles.performanceCard}>
            <View style={styles.performanceHeader}>
              <Text style={styles.performanceTitle}>Estimated Performance</Text>
              <View style={styles.performanceBadge}>
                <Text style={styles.performanceBadgeText}>Above Average</Text>
              </View>
            </View>
            <View style={styles.performanceBar}>
              <View style={styles.performanceFill} />
            </View>
            <Text style={styles.performanceNote}>
              * Final performance analysis will be available after submission
            </Text>
          </View>
        </View>

        {/* Data Accuracy Notice */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>📋 Data Accuracy</Text>
          <Text style={styles.noticeText}>
            Please ensure your test results are accurate. Inaccurate data may affect your performance analysis and leaderboard rankings.
          </Text>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>🔒 Privacy & Data</Text>
          <Text style={styles.privacyText}>
            Your test data will be stored securely and used only for performance analysis and leaderboard rankings. Video recordings are processed locally and not stored on our servers.
          </Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.reattemptButton}
            onPress={handleReattempt}
            activeOpacity={0.8}
          >
            <Text style={styles.reattemptButtonText}>🔄 Reattempt Test</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Submit Results</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  testInfoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  testId: {
    fontSize: 14,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  testDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  testTimestamp: {
    fontSize: 14,
    color: '#9ca3af',
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  resultCard: {
    flex: 1,
    minWidth: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  resultTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  videoThumbnail: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    marginBottom: 12,
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginRight: 12,
  },
  videoDescription: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  performanceCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  performanceBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  performanceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065f46',
  },
  performanceBar: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    marginBottom: 8,
  },
  performanceFill: {
    height: '100%',
    width: '75%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  performanceNote: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  noticeCard: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    marginBottom: 16,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  privacyCard: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0c4a6e',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#0c4a6e',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  reattemptButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reattemptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
