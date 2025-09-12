import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');

const MOCK_LEADERBOARD_DATA = {
  national: [
    { id: '1', name: 'Arjun Kumar', age: 17, score: 98, location: 'Delhi', sport: 'Athletics', badge: 'Diamond', profilePic: null },
    { id: '2', name: 'Sneha Singh', age: 16, score: 95, location: 'Mumbai', sport: 'Gymnastics', badge: 'Platinum', profilePic: null },
    { id: '3', name: 'Rahul Patel', age: 18, score: 92, location: 'Bangalore', sport: 'Swimming', badge: 'Gold', profilePic: null },
    { id: '4', name: 'Priya Sharma', age: 17, score: 89, location: 'Chennai', sport: 'Tennis', badge: 'Gold', profilePic: null },
    { id: '5', name: 'Vikram Reddy', age: 16, score: 87, location: 'Hyderabad', sport: 'Cricket', badge: 'Silver', profilePic: null },
    { id: '6', name: 'Ananya Joshi', age: 18, score: 85, location: 'Pune', sport: 'Badminton', badge: 'Silver', profilePic: null },
    { id: '7', name: 'Karan Malhotra', age: 17, score: 83, location: 'Kolkata', sport: 'Football', badge: 'Bronze', profilePic: null },
    { id: '8', name: 'Meera Iyer', age: 16, score: 81, location: 'Kochi', sport: 'Volleyball', badge: 'Bronze', profilePic: null },
    { id: '9', name: 'Rohan Agarwal', age: 18, score: 79, location: 'Ahmedabad', sport: 'Basketball', badge: 'Bronze', profilePic: null },
    { id: '10', name: 'Sakshi Gupta', age: 17, score: 77, location: 'Jaipur', sport: 'Hockey', badge: 'Bronze', profilePic: null },
  ],
  state: [
    { id: '1', name: 'Arjun Kumar', age: 17, score: 98, location: 'Delhi', sport: 'Athletics', badge: 'Diamond', profilePic: null },
    { id: '2', name: 'Rohit Verma', age: 16, score: 85, location: 'Delhi', sport: 'Cricket', badge: 'Silver', profilePic: null },
    { id: '3', name: 'Kavya Nair', age: 18, score: 82, location: 'Delhi', sport: 'Tennis', badge: 'Silver', profilePic: null },
    { id: '4', name: 'Amit Khanna', age: 17, score: 80, location: 'Delhi', sport: 'Football', badge: 'Bronze', profilePic: null },
    { id: '5', name: 'Deepika Rao', age: 16, score: 78, location: 'Delhi', sport: 'Badminton', badge: 'Bronze', profilePic: null },
  ],
  district: [
    { id: '1', name: 'Arjun Kumar', age: 17, score: 98, location: 'New Delhi', sport: 'Athletics', badge: 'Diamond', profilePic: null },
    { id: '2', name: 'Neha Kapoor', age: 16, score: 75, location: 'New Delhi', sport: 'Swimming', badge: 'Bronze', profilePic: null },
    { id: '3', name: 'Rajesh Kumar', age: 18, score: 72, location: 'New Delhi', sport: 'Cricket', badge: 'Bronze', profilePic: null },
  ]
};

const LEADERBOARD_TYPES = [
  { key: 'national', title: 'National', icon: '🇮🇳' },
  { key: 'state', title: 'State', icon: '🏛️' },
  { key: 'district', title: 'District', icon: '🏘️' }
];

const TEST_TYPES = ['All Tests', 'Vertical Jump', 'Sit-ups', 'Shuttle Run', 'Push-ups', 'Plank Hold'];

export default function LeaderboardScreen() {
  const [selectedType, setSelectedType] = useState('national');
  const [selectedTest, setSelectedTest] = useState('All Tests');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [pulseAnim] = useState(new Animated.Value(1));

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

  const getCurrentData = () => {
    return MOCK_LEADERBOARD_DATA[selectedType] || MOCK_LEADERBOARD_DATA.national;
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Diamond': return '#b9f2ff';
      case 'Platinum': return '#e5e4e2';
      case 'Gold': return '#ffd700';
      case 'Silver': return '#c0c0c0';
      case 'Bronze': return '#cd7f32';
      default: return '#f1f5f9';
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Diamond': return '💠';
      case 'Platinum': return '💎';
      case 'Gold': return '🥇';
      case 'Silver': return '🥈';
      case 'Bronze': return '🥉';
      default: return '🏅';
    }
  };

  const handleChallengeFriend = (athlete) => {
    Alert.alert(
      'Challenge Friend',
      `Challenge ${athlete.name} to a friendly competition?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Challenge', 
          onPress: () => {
            Alert.alert('Challenge Sent!', `Your challenge has been sent to ${athlete.name}`);
          }
        }
      ]
    );
  };

  const handleViewProfile = (athlete) => {
    Alert.alert(
      'Athlete Profile',
      `${athlete.name}\nAge: ${athlete.age}\nLocation: ${athlete.location}\nSport: ${athlete.sport}\nBadge: ${athlete.badge}`,
      [{ text: 'OK' }]
    );
  };

  const LeaderboardTypeButton = ({ type, isSelected }) => (
    <TouchableOpacity
      style={[styles.typeButton, isSelected && styles.typeButtonSelected]}
      onPress={() => setSelectedType(type.key)}
      activeOpacity={0.7}
    >
      <Text style={styles.typeIcon}>{type.icon}</Text>
      <Text style={[styles.typeText, isSelected && styles.typeTextSelected]}>
        {type.title}
      </Text>
    </TouchableOpacity>
  );

  const TestFilterButton = ({ test, isSelected }) => (
    <TouchableOpacity
      style={[styles.testButton, isSelected && styles.testButtonSelected]}
      onPress={() => setSelectedTest(test)}
      activeOpacity={0.7}
    >
      <Text style={[styles.testText, isSelected && styles.testTextSelected]}>
        {test}
      </Text>
    </TouchableOpacity>
  );

  const AthleteCard = ({ athlete, index }) => (
    <Animated.View 
      style={[
        styles.athleteCard,
        index < 3 && styles.podiumCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.rankContainer}>
        {index < 3 ? (
          <Animated.View 
            style={[
              styles.podiumRank,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Text style={styles.podiumIcon}>
              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
            </Text>
          </Animated.View>
        ) : (
          <View style={styles.rankNumber}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
        )}
      </View>

      <View style={styles.athleteInfo}>
        <View style={styles.athleteHeader}>
          <View style={styles.athleteDetails}>
            <Text style={styles.athleteName}>{athlete.name}</Text>
            <Text style={styles.athleteLocation}>{athlete.location} • {athlete.age} yrs</Text>
          </View>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: getBadgeColor(athlete.badge) }]}>
              <Text style={styles.badgeIcon}>{getBadgeIcon(athlete.badge)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.athleteFooter}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{athlete.score}</Text>
          </View>
          <Text style={styles.sportText}>{athlete.sport}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleViewProfile(athlete)}
            >
              <Text style={styles.actionButtonText}>👤</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleChallengeFriend(athlete)}
            >
              <Text style={styles.actionButtonText}>⚔️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const currentData = getCurrentData();

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
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Compete with athletes across India</Text>
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
        {/* Leaderboard Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leaderboard Type</Text>
          <View style={styles.typeContainer}>
            {LEADERBOARD_TYPES.map((type) => (
              <LeaderboardTypeButton
                key={type.key}
                type={type}
                isSelected={selectedType === type.key}
              />
            ))}
          </View>
        </View>

        {/* Test Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter by Test</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testFiltersContainer}
          >
            {TEST_TYPES.map((test) => (
              <TestFilterButton
                key={test}
                test={test}
                isSelected={selectedTest === test}
              />
            ))}
          </ScrollView>
        </View>

        {/* Podium for Top 3 */}
        {currentData.length >= 3 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Podium</Text>
            <View style={styles.podiumContainer}>
              <View style={styles.podiumItem}>
                <Text style={styles.podiumRank}>2</Text>
                <Text style={styles.podiumName}>{currentData[1]?.name}</Text>
                <Text style={styles.podiumScore}>{currentData[1]?.score}</Text>
              </View>
              <View style={[styles.podiumItem, styles.podiumFirst]}>
                <Text style={styles.podiumRank}>1</Text>
                <Text style={styles.podiumName}>{currentData[0]?.name}</Text>
                <Text style={styles.podiumScore}>{currentData[0]?.score}</Text>
              </View>
              <View style={styles.podiumItem}>
                <Text style={styles.podiumRank}>3</Text>
                <Text style={styles.podiumName}>{currentData[2]?.name}</Text>
                <Text style={styles.podiumScore}>{currentData[2]?.score}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Leaderboard List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rankings</Text>
            <Text style={styles.resultsCount}>{currentData.length} athletes</Text>
          </View>
          
          <FlatList
            data={currentData}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => <AthleteCard athlete={item} index={index} />}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>

        {/* Challenge Friends Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Challenge Friends</Text>
          <View style={styles.challengeCard}>
            <Text style={styles.challengeIcon}>⚔️</Text>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>Start a Challenge</Text>
              <Text style={styles.challengeText}>
                Challenge your friends to beat your scores and climb the leaderboard together!
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.challengeButton}
              onPress={() => Alert.alert('Coming Soon', 'Friend challenges will be available soon!')}
            >
              <Text style={styles.challengeButtonText}>Challenge</Text>
        </TouchableOpacity>
          </View>
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
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  typeButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  typeTextSelected: {
    color: '#fff',
  },
  testFiltersContainer: {
    paddingRight: 20,
  },
  testButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  testButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  testText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  testTextSelected: {
    color: '#fff',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    marginHorizontal: 4,
  },
  podiumFirst: {
    backgroundColor: '#fef3c7',
    transform: [{ scale: 1.1 }],
    marginHorizontal: 8,
  },
  podiumRank: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  podiumIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumScore: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563eb',
  },
  athleteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  podiumCard: {
    borderWidth: 2,
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rankContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  rankNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },
  podiumRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumIcon: {
    fontSize: 20,
  },
  athleteInfo: {
    flex: 1,
  },
  athleteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  athleteDetails: {
    flex: 1,
  },
  athleteName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  athleteLocation: {
    fontSize: 14,
    color: '#64748b',
  },
  badgeContainer: {
    marginLeft: 12,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeIcon: {
    fontSize: 20,
  },
  athleteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563eb',
  },
  sportText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
  },
  challengeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  challengeIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  challengeText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  challengeButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 16,
  },
  challengeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
