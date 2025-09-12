import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const MOCK_HISTORY = [
  { 
    id: 'h1', 
    date: '2024-12-01', 
    test: 'Vertical Jump', 
    testId: 'vertical',
    score: 32, 
    unit: 'cm',
    performance: 'Needs Improvement',
    mode: 'manual',
    duration: 180
  },
  { 
    id: 'h2', 
    date: '2024-12-08', 
    test: 'Sit-ups', 
    testId: 'situps',
    score: 25, 
    unit: 'reps',
    performance: 'Above Average',
    mode: 'video',
    duration: 240
  },
  { 
    id: 'h3', 
    date: '2024-12-15', 
    test: 'Vertical Jump', 
    testId: 'vertical',
    score: 38, 
    unit: 'cm',
    performance: 'Above Average',
    mode: 'manual',
    duration: 165
  },
  { 
    id: 'h4', 
    date: '2024-12-22', 
    test: 'Shuttle Run', 
    testId: 'shuttle',
    score: 11.5, 
    unit: 'seconds',
    performance: 'Top Performer',
    mode: 'video',
    duration: 300
  },
  { 
    id: 'h5', 
    date: '2024-12-29', 
    test: 'Push-ups', 
    testId: 'pushups',
    score: 28, 
    unit: 'reps',
    performance: 'Above Average',
    mode: 'manual',
    duration: 200
  },
  { 
    id: 'h6', 
    date: '2025-01-05', 
    test: 'Vertical Jump', 
    testId: 'vertical',
    score: 42, 
    unit: 'cm',
    performance: 'Top Performer',
    mode: 'video',
    duration: 150
  },
  { 
    id: 'h7', 
    date: '2025-01-12', 
    test: 'Plank Hold', 
    testId: 'plank',
    score: 75, 
    unit: 'seconds',
    performance: 'Above Average',
    mode: 'manual',
    duration: 75
  },
  { 
    id: 'h8', 
    date: '2025-01-19', 
    test: 'Sit-ups', 
    testId: 'situps',
    score: 35, 
    unit: 'reps',
    performance: 'Top Performer',
    mode: 'video',
    duration: 180
  }
];

const TEST_TYPES = ['All', 'Vertical Jump', 'Sit-ups', 'Shuttle Run', 'Push-ups', 'Plank Hold'];
const TIME_FILTERS = ['All Time', 'Last Month', 'Last 3 Months', 'Last 6 Months'];

export default function HistoryScreen() {
  const [selectedTest, setSelectedTest] = useState('All');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('All Time');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

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
  }, []);

  const getFilteredHistory = () => {
    let filtered = MOCK_HISTORY;
    
    if (selectedTest !== 'All') {
      filtered = filtered.filter(item => item.test === selectedTest);
    }
    
    // Time filtering logic (simplified for demo)
    const now = new Date();
    const filterDate = new Date();
    
    switch (selectedTimeFilter) {
      case 'Last Month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'Last 3 Months':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case 'Last 6 Months':
        filterDate.setMonth(now.getMonth() - 6);
        break;
      default:
        return filtered;
    }
    
    if (selectedTimeFilter !== 'All Time') {
      filtered = filtered.filter(item => new Date(item.date) >= filterDate);
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Top Performer': return '#10b981';
      case 'Above Average': return '#3b82f6';
      case 'Needs Improvement': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getChartData = () => {
    const filtered = getFilteredHistory();
    const verticalJumpData = filtered.filter(item => item.testId === 'vertical');
    
    if (verticalJumpData.length === 0) return null;
    
    return {
      labels: verticalJumpData.map(item => 
        new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
      ),
      datasets: [{
        data: verticalJumpData.map(item => item.score),
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        strokeWidth: 3
      }]
    };
  };

  const getOverallStats = () => {
    const filtered = getFilteredHistory();
    const totalTests = filtered.length;
    const averageScore = filtered.reduce((sum, item) => sum + item.score, 0) / totalTests;
    const topPerformances = filtered.filter(item => item.performance === 'Top Performer').length;
    const improvement = totalTests > 1 ? 
      ((filtered[0]?.score - filtered[filtered.length - 1]?.score) / filtered[filtered.length - 1]?.score * 100) : 0;
    
    return { totalTests, averageScore: averageScore.toFixed(1), topPerformances, improvement: improvement.toFixed(1) };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const FilterButton = ({ title, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const HistoryItem = ({ item }) => (
    <Animated.View 
      style={[
        styles.historyItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.testName}>{item.test}</Text>
          <Text style={styles.testDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.itemScore}>
          <Text style={styles.scoreValue}>{item.score}</Text>
          <Text style={styles.scoreUnit}>{item.unit}</Text>
        </View>
      </View>
      
      <View style={styles.itemFooter}>
        <View style={[styles.performanceBadge, { backgroundColor: getPerformanceColor(item.performance) + '20' }]}>
          <Text style={[styles.performanceText, { color: getPerformanceColor(item.performance) }]}>
            {item.performance}
          </Text>
        </View>
        <View style={styles.itemMeta}>
          <Text style={styles.metaText}>{item.mode === 'video' ? '📹' : '✏️'}</Text>
          <Text style={styles.metaText}>{Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}</Text>
        </View>
      </View>
    </Animated.View>
  );

  const StatsCard = ({ title, value, subtitle, icon, color = '#2563eb' }) => (
    <Animated.View 
      style={[
        styles.statsCard,
        { 
          borderLeftColor: color,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.statsHeader}>
        <Text style={styles.statsIcon}>{icon}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
      </View>
      <Text style={[styles.statsValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
    </Animated.View>
  );

  const filteredHistory = getFilteredHistory();
  const chartData = getChartData();
  const stats = getOverallStats();

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
      <Text style={styles.title}>Performance History</Text>
        <Text style={styles.subtitle}>Track your athletic journey and improvements</Text>
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
        {/* Overall Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Statistics</Text>
          <View style={styles.statsGrid}>
            <StatsCard
              title="Total Tests"
              value={stats.totalTests}
              icon="📊"
              color="#2563eb"
            />
            <StatsCard
              title="Average Score"
              value={stats.averageScore}
              subtitle="across all tests"
              icon="📈"
              color="#10b981"
            />
            <StatsCard
              title="Top Performances"
              value={stats.topPerformances}
              subtitle="excellent results"
              icon="🏆"
              color="#f59e0b"
            />
            <StatsCard
              title="Improvement"
              value={`${stats.improvement}%`}
              subtitle="since first test"
              icon="📈"
              color="#8b5cf6"
            />
          </View>
        </View>

        {/* Progress Chart */}
        {chartData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progress Over Time</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={chartData}
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
        )}

        {/* Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter Results</Text>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Test Type</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContainer}
            >
              {TEST_TYPES.map((test) => (
                <FilterButton
                  key={test}
                  title={test}
                  isSelected={selectedTest === test}
                  onPress={() => setSelectedTest(test)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Time Period</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContainer}
            >
              {TIME_FILTERS.map((filter) => (
                <FilterButton
                  key={filter}
                  title={filter}
                  isSelected={selectedTimeFilter === filter}
                  onPress={() => setSelectedTimeFilter(filter)}
                />
              ))}
            </ScrollView>
          </View>
        </View>

        {/* History List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Test History</Text>
            <Text style={styles.resultsCount}>{filteredHistory.length} results</Text>
          </View>
          
          {filteredHistory.length > 0 ? (
            <FlatList
              data={filteredHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <HistoryItem item={item} />}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyTitle}>No Results Found</Text>
              <Text style={styles.emptyText}>
                {selectedTest !== 'All' || selectedTimeFilter !== 'All Time'
                  ? 'Try adjusting your filters to see more results'
                  : 'Start taking tests to build your performance history'
                }
              </Text>
        </View>
          )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsCard: {
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
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  statsValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  statsSubtitle: {
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
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  filtersContainer: {
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTextSelected: {
    color: '#fff',
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  testDate: {
    fontSize: 14,
    color: '#64748b',
  },
  itemScore: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2563eb',
  },
  scoreUnit: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  performanceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
