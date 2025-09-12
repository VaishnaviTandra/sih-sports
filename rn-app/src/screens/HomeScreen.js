import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Animated,
  Dimensions 
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  // Mock data - in real app, this would come from state management or API
  const [athleteData] = useState({
    name: user?.name || 'Athlete',
    profilePicture: user?.profilePicture || null,
    lastTest: {
      type: 'Vertical Jump',
      score: '34 cm',
      date: '2 days ago',
      performance: 'Above Average'
    },
    badges: [
      { name: 'Bronze Athlete', icon: '🥉', earned: true },
      { name: 'First Test', icon: '🎯', earned: true },
      { name: 'Consistent Performer', icon: '⭐', earned: false },
      { name: 'Top 10%', icon: '🏆', earned: false },
    ],
    stats: {
      totalTests: 5,
      averageScore: 78,
      improvement: '+12%',
      rank: 15
    }
  });

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

  const QuickActionButton = ({ title, icon, onPress, color = '#2563eb' }) => (
    <TouchableOpacity style={[styles.quickAction, { borderLeftColor: color }]} onPress={onPress}>
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, subtitle, icon }) => (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const BadgeItem = ({ badge }) => (
    <View style={[styles.badgeItem, !badge.earned && styles.badgeItemLocked]}>
      <Text style={styles.badgeIcon}>{badge.icon}</Text>
      <Text style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]}>
        {badge.name}
      </Text>
    </View>
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
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}</Text>
            <Text style={styles.welcomeName}>{athleteData.name}</Text>
          </View>
          {athleteData.profilePicture ? (
            <Image source={{ uri: athleteData.profilePicture.uri }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profilePlaceholderText}>
                {athleteData.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
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
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionButton
              title="Start Test"
              icon="🏃‍♂️"
              onPress={() => navigation.navigate('Tests')}
              color="#10b981"
            />
            <QuickActionButton
              title="My Performance"
              icon="📊"
              onPress={() => navigation.navigate('Performance')}
              color="#3b82f6"
            />
            <QuickActionButton
              title="Leaderboard"
              icon="🏆"
              onPress={() => navigation.navigate('Leaderboard')}
              color="#f59e0b"
            />
            <QuickActionButton
              title="Profile"
              icon="👤"
              onPress={() => navigation.navigate('Profile')}
              color="#8b5cf6"
            />
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Tests"
              value={athleteData.stats.totalTests}
              icon="📈"
            />
            <StatCard
              title="Average Score"
              value={`${athleteData.stats.averageScore}%`}
              icon="🎯"
            />
            <StatCard
              title="Improvement"
              value={athleteData.stats.improvement}
              icon="📈"
              subtitle="This month"
            />
            <StatCard
              title="Rank"
              value={`#${athleteData.stats.rank}`}
              icon="🏅"
              subtitle="In your state"
            />
          </View>
        </View>

        {/* Last Test Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last Test Performance</Text>
          <View style={styles.lastTestCard}>
            <View style={styles.lastTestHeader}>
              <Text style={styles.lastTestType}>{athleteData.lastTest.type}</Text>
              <View style={[styles.performanceBadge, 
                athleteData.lastTest.performance === 'Above Average' && styles.performanceGood,
                athleteData.lastTest.performance === 'Top Performer' && styles.performanceExcellent
              ]}>
                <Text style={styles.performanceText}>{athleteData.lastTest.performance}</Text>
              </View>
            </View>
            <Text style={styles.lastTestScore}>{athleteData.lastTest.score}</Text>
            <Text style={styles.lastTestDate}>{athleteData.lastTest.date}</Text>
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => navigation.navigate('Performance')}
            >
              <Text style={styles.viewDetailsText}>View Details →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Badges Collection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges Collection</Text>
          <View style={styles.badgesGrid}>
            {athleteData.badges.map((badge, index) => (
              <BadgeItem key={index} badge={badge} />
            ))}
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "The only impossible journey is the one you never begin."
          </Text>
          <Text style={styles.quoteAuthor}>— Tony Robbins</Text>
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
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#2563eb',
  },
  profilePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  lastTestCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lastTestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lastTestType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  performanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fef3c7',
  },
  performanceGood: {
    backgroundColor: '#d1fae5',
  },
  performanceExcellent: {
    backgroundColor: '#dbeafe',
  },
  performanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  lastTestScore: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: 4,
  },
  lastTestDate: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  viewDetailsButton: {
    alignSelf: 'flex-start',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeItem: {
    flex: 1,
    minWidth: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeItemLocked: {
    backgroundColor: '#f9fafb',
    opacity: 0.6,
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: '#9ca3af',
  },
  quoteCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#fff',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'right',
  },
});
