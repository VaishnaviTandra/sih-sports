import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Dimensions,
  Alert
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const BENCHMARK_DATA = {
  vertical: { average: 45, excellent: 60, poor: 30 },
  situps: { average: 25, excellent: 40, poor: 15 },
  shuttle: { average: 12, excellent: 8, poor: 18 },
  endurance: { average: 15, excellent: 10, poor: 25 },
  pushups: { average: 20, excellent: 35, poor: 10 },
  plank: { average: 60, excellent: 120, poor: 30 },
  sprint: { average: 6.5, excellent: 5.5, poor: 8.0 },
  balance: { average: 45, excellent: 90, poor: 20 }
};

const BADGES = {
  bronze: { name: 'Bronze Athlete', icon: '🥉', threshold: 0.6, color: '#cd7f32' },
  silver: { name: 'Silver Athlete', icon: '🥈', threshold: 0.8, color: '#c0c0c0' },
  gold: { name: 'Gold Athlete', icon: '🥇', threshold: 1.0, color: '#ffd700' },
  platinum: { name: 'Platinum Athlete', icon: '💎', threshold: 1.2, color: '#e5e4e2' },
  diamond: { name: 'Diamond Athlete', icon: '💠', threshold: 1.5, color: '#b9f2ff' }
};

export default function PerformanceScreen({ route, navigation }) {
  const result = route.params?.result;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [badgeAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  // Mock historical data for charts
  const [historicalData] = useState([
    { date: 'Week 1', score: 35 },
    { date: 'Week 2', score: 38 },
    { date: 'Week 3', score: 42 },
    { date: 'Week 4', score: 45 },
    { date: 'This Week', score: result ? parseFloat(result.value) || 0 : 0 }
  ]);

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
    ]).start();

    // Badge animation
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(badgeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        )
      ]).start();
    }, 1000);
  }, []);

  const getPerformanceData = () => {
    if (!result) return { userScore: 0, benchmark: 50, comparison: 'No Data' };
    
    const testId = result.testId || 'vertical';
    const userScore = parseFloat(result.value) || 0;
    const benchmark = BENCHMARK_DATA[testId] || BENCHMARK_DATA.vertical;
    
    let comparison = 'Needs Improvement';
    let performanceLevel = 'poor';
    
    if (userScore >= benchmark.excellent) {
      comparison = 'Top Performer';
      performanceLevel = 'excellent';
    } else if (userScore >= benchmark.average) {
      comparison = 'Above Average';
      performanceLevel = 'average';
    }
    
    return { userScore, benchmark: benchmark.average, comparison, performanceLevel };
  };

  const getEarnedBadge = () => {
    const { userScore, benchmark } = getPerformanceData();
    const ratio = userScore / benchmark;
    
    if (ratio >= BADGES.diamond.threshold) return BADGES.diamond;
    if (ratio >= BADGES.platinum.threshold) return BADGES.platinum;
    if (ratio >= BADGES.gold.threshold) return BADGES.gold;
    if (ratio >= BADGES.silver.threshold) return BADGES.silver;
    return BADGES.bronze;
  };

  const getPerformanceColor = (level) => {
    switch (level) {
      case 'excellent': return '#10b981';
      case 'average': return '#3b82f6';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const performanceData = getPerformanceData();
  const earnedBadge = getEarnedBadge();

  const chartData = {
    labels: ['You', 'Average', 'Excellent'],
    datasets: [{
      data: [
        performanceData.userScore,
        performanceData.benchmark,
        BENCHMARK_DATA[result?.testId || 'vertical']?.excellent || 60
      ]
    }]
  };

  const lineChartData = {
    labels: historicalData.map(d => d.date),
    datasets: [{
      data: historicalData.map(d => d.score),
      color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
      strokeWidth: 3
    }]
  };

  const PerformanceCard = ({ title, value, subtitle, color, icon }) => (
    <Animated.View 
      style={[
        styles.performanceCard,
        { 
          borderLeftColor: color,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </Animated.View>
  );

  const BadgeCard = ({ badge, isEarned }) => (
    <Animated.View 
      style={[
        styles.badgeCard,
        isEarned && styles.badgeCardEarned,
        isEarned && { transform: [{ scale: pulseAnim }] }
      ]}
    >
      <Text style={styles.badgeIcon}>{badge.icon}</Text>
      <Text style={[styles.badgeName, isEarned && styles.badgeNameEarned]}>
        {badge.name}
      </Text>
      {isEarned && (
        <Animated.View 
          style={[
            styles.badgeEarnedIndicator,
            { opacity: badgeAnim }
          ]}
        >
          <Text style={styles.badgeEarnedText}>EARNED!</Text>
        </Animated.View>
      )}
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
        <Text style={styles.title}>Performance Analysis</Text>
        <Text style={styles.subtitle}>
          {result ? `Your ${result.test} results` : 'View your athletic performance'}
        </Text>
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
        {/* Current Test Results */}
      {result && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Test Results</Text>
            <View style={styles.resultsGrid}>
              <PerformanceCard
                title="Your Score"
                value={`${performanceData.userScore} ${result.unit || ''}`}
                icon="🎯"
                color="#2563eb"
              />
              <PerformanceCard
                title="Performance"
                value={performanceData.comparison}
                subtitle="vs. National Average"
                icon="📊"
                color={getPerformanceColor(performanceData.performanceLevel)}
              />
              <PerformanceCard
                title="Benchmark"
                value={`${performanceData.benchmark} ${result.unit || ''}`}
                subtitle="National Average"
                icon="📈"
                color="#64748b"
              />
              <PerformanceCard
                title="Test Mode"
                value={result.mode === 'video' ? 'Video' : 'Manual'}
                subtitle="Input Method"
                icon={result.mode === 'video' ? '📹' : '✏️'}
                color="#8b5cf6"
              />
            </View>
        </View>
      )}

        {/* Performance Comparison Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Comparison</Text>
          <View style={styles.chartContainer}>
      <BarChart
              data={chartData}
              width={width - 60}
        height={220}
        fromZero
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                decimalPlaces: 1,
                barPercentage: 0.7,
              }}
              style={styles.chart}
            />
          </View>
        </View>

        {/* Progress Over Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Over Time</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={lineChartData}
              width={width - 60}
              height={220}
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                decimalPlaces: 0,
                strokeWidth: 3,
              }}
              style={styles.chart}
            />
          </View>
        </View>

        {/* Badge Collection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badge Collection</Text>
          <View style={styles.badgesGrid}>
            {Object.values(BADGES).map((badge, index) => (
              <BadgeCard
                key={index}
                badge={badge}
                isEarned={badge.name === earnedBadge.name}
              />
            ))}
          </View>
        </View>

        {/* Performance Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Insights</Text>
          <View style={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>💡</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Keep It Up!</Text>
                <Text style={styles.insightText}>
                  {performanceData.comparison === 'Top Performer' 
                    ? 'You\'re performing exceptionally well! Consider challenging yourself with more difficult tests.'
                    : performanceData.comparison === 'Above Average'
                    ? 'Great job! You\'re above the national average. Keep training to reach the top tier.'
                    : 'There\'s room for improvement. Focus on consistent training and proper technique.'
                  }
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Tests')}
          >
            <Text style={styles.actionButtonText}>Take Another Test</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              View Leaderboard
            </Text>
      </TouchableOpacity>
    </View>
      </Animated.View>
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
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  performanceCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#9ca3af',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    borderRadius: 8,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    flex: 1,
    minWidth: (width - 60) / 2,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  badgeCardEarned: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  badgeNameEarned: {
    color: '#92400e',
    fontWeight: '700',
  },
  badgeEarnedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeEarnedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  insightsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 4,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
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
  secondaryButton: {
    backgroundColor: '#f1f5f9',
    shadowOpacity: 0,
    elevation: 0,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#374151',
  },
});
