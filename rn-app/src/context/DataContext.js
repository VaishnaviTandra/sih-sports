import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DataContext = createContext({});

export function DataProvider({ children }) {
  const [athleteProfile, setAthleteProfile] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [badges, setBadges] = useState([]);
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadData();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [athleteProfile, testResults, badges, performanceHistory]);

  const loadData = async () => {
    try {
      const [
        profileData,
        resultsData,
        badgesData,
        historyData,
        leaderboardData
      ] = await Promise.all([
        AsyncStorage.getItem('athleteProfile'),
        AsyncStorage.getItem('testResults'),
        AsyncStorage.getItem('badges'),
        AsyncStorage.getItem('performanceHistory'),
        AsyncStorage.getItem('leaderboardData')
      ]);

      if (profileData) {
        setAthleteProfile(JSON.parse(profileData));
      }

      if (resultsData) {
        setTestResults(JSON.parse(resultsData));
      }

      if (badgesData) {
        setBadges(JSON.parse(badgesData));
      }

      if (historyData) {
        setPerformanceHistory(JSON.parse(historyData));
      }

      if (leaderboardData) {
        setLeaderboardData(JSON.parse(leaderboardData));
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('athleteProfile', JSON.stringify(athleteProfile)),
        AsyncStorage.setItem('testResults', JSON.stringify(testResults)),
        AsyncStorage.setItem('badges', JSON.stringify(badges)),
        AsyncStorage.setItem('performanceHistory', JSON.stringify(performanceHistory)),
        AsyncStorage.setItem('leaderboardData', JSON.stringify(leaderboardData))
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Profile Management
  const updateProfile = (profileData) => {
    setAthleteProfile(prev => ({ ...prev, ...profileData }));
  };

  const createProfile = (profileData) => {
    const newProfile = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...profileData
    };
    setAthleteProfile(newProfile);
    return newProfile;
  };

  // Test Results Management
  const addTestResult = (result) => {
    const newResult = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...result
    };
    setTestResults(prev => [newResult, ...prev]);
    updatePerformanceHistory(newResult);
    checkForNewBadges(newResult);
    return newResult;
  };

  const getTestResults = (testId = null, limit = null) => {
    let results = testResults;
    
    if (testId) {
      results = results.filter(result => result.testId === testId);
    }
    
    if (limit) {
      results = results.slice(0, limit);
    }
    
    return results;
  };

  const getLatestResult = (testId = null) => {
    const results = getTestResults(testId, 1);
    return results.length > 0 ? results[0] : null;
  };

  // Performance History Management
  const updatePerformanceHistory = (newResult) => {
    setPerformanceHistory(prev => {
      const updated = [...prev];
      const existingIndex = updated.findIndex(
        entry => entry.testId === newResult.testId && 
        entry.date === new Date(newResult.timestamp).toDateString()
      );
      
      if (existingIndex >= 0) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          score: newResult.value,
          timestamp: newResult.timestamp
        };
      } else {
        updated.push({
          id: Date.now().toString(),
          testId: newResult.testId,
          testName: newResult.test,
          score: parseFloat(newResult.value) || 0,
          date: new Date(newResult.timestamp).toDateString(),
          timestamp: newResult.timestamp
        });
      }
      
      return updated.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });
  };

  const getPerformanceStats = () => {
    if (testResults.length === 0) {
      return {
        totalTests: 0,
        averageScore: 0,
        improvement: 0,
        topPerformances: 0,
        currentRank: 0
      };
    }

    const totalTests = testResults.length;
    const averageScore = testResults.reduce((sum, result) => sum + (parseFloat(result.value) || 0), 0) / totalTests;
    const topPerformances = testResults.filter(result => result.performance === 'Top Performer').length;
    
    // Calculate improvement (simplified)
    const sortedResults = [...testResults].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const firstScore = parseFloat(sortedResults[0]?.value) || 0;
    const latestScore = parseFloat(sortedResults[sortedResults.length - 1]?.value) || 0;
    const improvement = firstScore > 0 ? ((latestScore - firstScore) / firstScore) * 100 : 0;

    return {
      totalTests,
      averageScore: Math.round(averageScore * 10) / 10,
      improvement: Math.round(improvement * 10) / 10,
      topPerformances,
      currentRank: Math.floor(Math.random() * 50) + 1 // Mock rank
    };
  };

  // Badge Management
  const checkForNewBadges = (newResult) => {
    const newBadges = [];
    
    // First Test Badge
    if (testResults.length === 0 && !badges.find(b => b.id === 'first_test')) {
      newBadges.push({
        id: 'first_test',
        name: 'First Test',
        icon: '🎯',
        description: 'Complete your first test',
        earnedAt: new Date().toISOString(),
        color: '#10b981'
      });
    }

    // Bronze Athlete Badge
    if (testResults.length >= 1 && !badges.find(b => b.id === 'bronze')) {
      newBadges.push({
        id: 'bronze',
        name: 'Bronze Athlete',
        icon: '🥉',
        description: 'Complete your first test',
        earnedAt: new Date().toISOString(),
        color: '#cd7f32'
      });
    }

    // Silver Athlete Badge
    if (testResults.length >= 5 && !badges.find(b => b.id === 'silver')) {
      const aboveAverageCount = testResults.filter(r => r.performance === 'Above Average' || r.performance === 'Top Performer').length;
      if (aboveAverageCount >= 5) {
        newBadges.push({
          id: 'silver',
          name: 'Silver Athlete',
          icon: '🥈',
          description: 'Score above average in 5 tests',
          earnedAt: new Date().toISOString(),
          color: '#c0c0c0'
        });
      }
    }

    // Gold Athlete Badge
    if (!badges.find(b => b.id === 'gold')) {
      const topPerformerCount = testResults.filter(r => r.performance === 'Top Performer').length;
      if (topPerformerCount >= 3) {
        newBadges.push({
          id: 'gold',
          name: 'Gold Athlete',
          icon: '🥇',
          description: 'Achieve top performer status',
          earnedAt: new Date().toISOString(),
          color: '#ffd700'
        });
      }
    }

    if (newBadges.length > 0) {
      setBadges(prev => [...prev, ...newBadges]);
      return newBadges;
    }

    return [];
  };

  const getEarnedBadges = () => {
    return badges.filter(badge => badge.earnedAt);
  };

  const getLockedBadges = () => {
    const earnedIds = badges.map(b => b.id);
    const allBadges = [
      { id: 'bronze', name: 'Bronze Athlete', icon: '🥉', description: 'Complete your first test', color: '#cd7f32' },
      { id: 'silver', name: 'Silver Athlete', icon: '🥈', description: 'Score above average in 5 tests', color: '#c0c0c0' },
      { id: 'gold', name: 'Gold Athlete', icon: '🥇', description: 'Achieve top performer status', color: '#ffd700' },
      { id: 'platinum', name: 'Platinum Athlete', icon: '💎', description: 'Maintain excellence for 30 days', color: '#e5e4e2' },
      { id: 'diamond', name: 'Diamond Athlete', icon: '💠', description: 'Reach the top 1% nationally', color: '#b9f2ff' },
      { id: 'first_test', name: 'First Test', icon: '🎯', description: 'Complete your first test', color: '#10b981' },
      { id: 'consistent', name: 'Consistent Performer', icon: '⭐', description: 'Take tests for 7 consecutive days', color: '#f59e0b' },
      { id: 'top_10', name: 'Top 10%', icon: '🏆', description: 'Rank in top 10% nationally', color: '#8b5cf6' },
    ];
    
    return allBadges.filter(badge => !earnedIds.includes(badge.id));
  };

  // Leaderboard Management
  const updateLeaderboard = (newResult) => {
    // In a real app, this would sync with a backend
    // For now, we'll just update local data
    setLeaderboardData(prev => {
      const updated = [...prev];
      const existingIndex = updated.findIndex(entry => entry.athleteId === athleteProfile?.id);
      
      if (existingIndex >= 0) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          score: Math.max(updated[existingIndex].score, parseFloat(newResult.value) || 0),
          lastUpdated: new Date().toISOString()
        };
      } else if (athleteProfile) {
        updated.push({
          id: Date.now().toString(),
          athleteId: athleteProfile.id,
          name: athleteProfile.name,
          location: athleteProfile.location,
          score: parseFloat(newResult.value) || 0,
          rank: updated.length + 1,
          lastUpdated: new Date().toISOString()
        });
      }
      
      return updated.sort((a, b) => b.score - a.score).map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
    });
  };

  const getLeaderboard = (type = 'national', limit = 10) => {
    // Mock leaderboard data for different types
    const mockData = {
      national: [
        { id: '1', name: 'Arjun Kumar', location: 'Delhi', score: 98, rank: 1 },
        { id: '2', name: 'Sneha Singh', location: 'Mumbai', score: 95, rank: 2 },
        { id: '3', name: 'Rahul Patel', location: 'Bangalore', score: 92, rank: 3 },
        // ... more mock data
      ],
      state: [
        { id: '1', name: 'Arjun Kumar', location: 'Delhi', score: 98, rank: 1 },
        { id: '2', name: 'Rohit Verma', location: 'Delhi', score: 85, rank: 2 },
        // ... more mock data
      ],
      district: [
        { id: '1', name: 'Arjun Kumar', location: 'New Delhi', score: 98, rank: 1 },
        { id: '2', name: 'Neha Kapoor', location: 'New Delhi', score: 75, rank: 2 },
        // ... more mock data
      ]
    };

    return mockData[type]?.slice(0, limit) || [];
  };

  // Data Export/Import
  const exportData = () => {
    return {
      athleteProfile,
      testResults,
      badges,
      performanceHistory,
      exportedAt: new Date().toISOString()
    };
  };

  const importData = (data) => {
    if (data.athleteProfile) setAthleteProfile(data.athleteProfile);
    if (data.testResults) setTestResults(data.testResults);
    if (data.badges) setBadges(data.badges);
    if (data.performanceHistory) setPerformanceHistory(data.performanceHistory);
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      await AsyncStorage.multiRemove([
        'athleteProfile',
        'testResults',
        'badges',
        'performanceHistory',
        'leaderboardData'
      ]);
      
      setAthleteProfile(null);
      setTestResults([]);
      setBadges([]);
      setPerformanceHistory([]);
      setLeaderboardData([]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const value = {
    // State
    athleteProfile,
    testResults,
    badges,
    performanceHistory,
    leaderboardData,
    isLoading,

    // Profile Management
    updateProfile,
    createProfile,

    // Test Results Management
    addTestResult,
    getTestResults,
    getLatestResult,

    // Performance Management
    getPerformanceStats,

    // Badge Management
    getEarnedBadges,
    getLockedBadges,

    // Leaderboard Management
    updateLeaderboard,
    getLeaderboard,

    // Data Management
    exportData,
    importData,
    clearAllData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
