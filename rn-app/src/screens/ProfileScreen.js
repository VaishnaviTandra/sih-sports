import React, { useContext, useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView,
  Animated,
  Dimensions,
  Alert
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const BADGES = [
  { id: 'bronze', name: 'Bronze Athlete', icon: '🥉', description: 'Complete your first test', earned: true, color: '#cd7f32' },
  { id: 'silver', name: 'Silver Athlete', icon: '🥈', description: 'Score above average in 5 tests', earned: true, color: '#c0c0c0' },
  { id: 'gold', name: 'Gold Athlete', icon: '🥇', description: 'Achieve top performer status', earned: false, color: '#ffd700' },
  { id: 'platinum', name: 'Platinum Athlete', icon: '💎', description: 'Maintain excellence for 30 days', earned: false, color: '#e5e4e2' },
  { id: 'diamond', name: 'Diamond Athlete', icon: '💠', description: 'Reach the top 1% nationally', earned: false, color: '#b9f2ff' },
  { id: 'first_test', name: 'First Test', icon: '🎯', description: 'Complete your first test', earned: true, color: '#10b981' },
  { id: 'consistent', name: 'Consistent Performer', icon: '⭐', description: 'Take tests for 7 consecutive days', earned: false, color: '#f59e0b' },
  { id: 'top_10', name: 'Top 10%', icon: '🏆', description: 'Rank in top 10% nationally', earned: false, color: '#8b5cf6' },
];

const ACHIEVEMENTS = [
  { title: 'Total Tests Completed', value: '12', icon: '📊' },
  { title: 'Best Performance', value: 'Top Performer', icon: '🏆' },
  { title: 'Average Score', value: '87%', icon: '📈' },
  { title: 'Current Rank', value: '#15', icon: '🏅' },
  { title: 'Days Active', value: '28', icon: '📅' },
  { title: 'Improvement', value: '+23%', icon: '📈' },
];

export default function ProfileScreen({ navigation }) {
  const { user, signOut, updateUser } = useContext(AuthContext);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);

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

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  const handleChangeProfilePicture = async () => {
    Alert.alert(
      'Profile Photo',
      'Choose a source',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: captureFromCamera },
        { text: 'Gallery', onPress: pickFromGallery },
      ]
    );
  };

  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Please allow media access to choose a profile image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.image],
      quality: 0.8,
      allowsMultipleSelection: false,
      aspect: [1, 1],
    });
    if (result.canceled) return;
    const asset = result.assets && result.assets[0];
    if (!asset) return;
    const next = { uri: asset.uri };
    setProfilePicture(next);
    updateUser({ profilePicture: next });
    Alert.alert('Success', 'Profile picture updated successfully!');
  };

  const captureFromCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Please allow camera access to take a profile image.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: [ImagePicker.MediaType.image],
      quality: 0.8,
      aspect: [1, 1],
    });
    if (result.canceled) return;
    const asset = result.assets && result.assets[0];
    if (!asset) return;
    const next = { uri: asset.uri };
    setProfilePicture(next);
    updateUser({ profilePicture: next });
    Alert.alert('Success', 'Profile picture updated successfully!');
  };

  const handleSettings = () => {
    Alert.alert(
      'Settings',
      'Settings panel will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  const handleShareProfile = () => {
    Alert.alert(
      'Share Profile',
      'Share your athletic achievements with friends!',
      [{ text: 'OK' }]
    );
  };

  const BadgeCard = ({ badge }) => (
    <Animated.View 
      style={[
        styles.badgeCard,
        badge.earned && styles.badgeCardEarned,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={[styles.badgeIcon, { backgroundColor: badge.color + '20' }]}>
        <Text style={styles.badgeEmoji}>{badge.icon}</Text>
      </View>
      <Text style={[styles.badgeName, badge.earned && styles.badgeNameEarned]}>
        {badge.name}
      </Text>
      <Text style={styles.badgeDescription}>{badge.description}</Text>
      {badge.earned && (
        <View style={styles.earnedIndicator}>
          <Text style={styles.earnedText}>EARNED</Text>
        </View>
      )}
    </Animated.View>
  );

  const AchievementCard = ({ achievement }) => (
    <Animated.View 
      style={[
        styles.achievementCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
      <Text style={styles.achievementValue}>{achievement.value}</Text>
      <Text style={styles.achievementTitle}>{achievement.title}</Text>
    </Animated.View>
  );

  const earnedBadges = BADGES.filter(badge => badge.earned);
  const lockedBadges = BADGES.filter(badge => !badge.earned);

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
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleChangeProfilePicture}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture.uri || profilePicture }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profilePlaceholderText}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </Text>
              </View>
            )}
            <View style={styles.editPhotoButton}>
              <Text style={styles.editPhotoIcon}>📷</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Athlete'}</Text>
            <Text style={styles.profileLocation}>{user?.location || 'Location'}</Text>
            <Text style={styles.profileSport}>{user?.sportInterest || 'Sport Interest'}</Text>
            
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>#{15}</Text>
                <Text style={styles.statLabel}>National Rank</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>87%</Text>
                <Text style={styles.statLabel}>Avg Score</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Tests</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
            <Text style={styles.actionButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShareProfile}>
            <Text style={styles.actionButtonText}>📤 Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSettings}>
            <Text style={styles.actionButtonText}>⚙️ Settings</Text>
          </TouchableOpacity>
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
        {/* Achievements Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((achievement, index) => (
              <AchievementCard key={index} achievement={achievement} />
            ))}
          </View>
        </View>

        {/* Badge Collection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Badge Collection</Text>
            <Text style={styles.badgeCount}>{earnedBadges.length}/{BADGES.length} earned</Text>
          </View>

          <View style={styles.badgeSection}>
            <Text style={styles.badgeSectionTitle}>🏆 Earned Badges</Text>
            <View style={styles.badgesGrid}>
              {earnedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
        </View>
      </View>

          {lockedBadges.length > 0 && (
            <View style={styles.badgeSection}>
              <Text style={styles.badgeSectionTitle}>🔒 Locked Badges</Text>
              <View style={styles.badgesGrid}>
                {lockedBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <Text style={styles.activityIcon}>🏃‍♂️</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Completed Vertical Jump Test</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
              <Text style={styles.activityScore}>42 cm</Text>
            </View>
            
            <View style={styles.activityItem}>
              <Text style={styles.activityIcon}>🏆</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Earned Silver Athlete Badge</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
              <Text style={styles.activityScore}>🥈</Text>
            </View>
            
            <View style={styles.activityItem}>
              <Text style={styles.activityIcon}>📈</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Improved ranking by 5 positions</Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
              <Text style={styles.activityScore}>#15</Text>
            </View>
          </View>
      </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>Jan 20, 2025</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Data Usage</Text>
              <Text style={styles.infoValue}>2.3 MB</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => {
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: signOut }
              ]
            );
          }}
        >
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#2563eb',
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2563eb',
  },
  profilePlaceholderText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editPhotoIcon: {
    fontSize: 14,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 2,
  },
  profileSport: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 12,
  },
  profileStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
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
  badgeCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    minWidth: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  badgeSection: {
    marginBottom: 20,
  },
  badgeSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
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
    backgroundColor: '#fff',
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeNameEarned: {
    color: '#374151',
    fontWeight: '700',
  },
  badgeDescription: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 14,
  },
  earnedIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  earnedText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#fff',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
  },
  activityScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
