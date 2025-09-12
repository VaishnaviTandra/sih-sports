import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function TestsScreen({ navigation }) {
  // Sample tests — replace or extend with real data as needed
  const tests = [
    { id: '1', title: 'Sprint 100m', description: 'Run 100 meters as fast as you can.' },
    { id: '2', title: 'Vertical Jump', description: 'Jump as high as possible from standing.' },
    { id: '3', title: 'Agility Shuttle', description: 'Shuttle run for agility and speed.' },
    { id: '4', title: 'Endurance Run', description: '2 km endurance run for pacing and stamina.' },
  ];

  const [selectedTest, setSelectedTest] = useState(null);

  const onStartTest = () => {
    if (!selectedTest) return;
    // Navigate to the instruction screen which shows recording/upload options
    navigation.navigate('TestInstruction', { test: selectedTest });
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedTest?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => setSelectedTest(item)}
      >
        <Text style={[styles.title, isSelected && styles.titleSelected]}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Tests</Text>
      <FlatList
        data={tests}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, !selectedTest && styles.startButtonDisabled]}
          onPress={onStartTest}
          disabled={!selectedTest}
        >
          <Text style={styles.startText}>Start Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  item: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  itemSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eef6ff',
  },
  title: { fontSize: 16, fontWeight: '600' },
  titleSelected: { color: '#1e40af' },
  desc: { fontSize: 13, color: '#475569', marginTop: 6 },
  footer: { paddingVertical: 12, alignItems: 'center' },
  startButton: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, width: '100%', alignItems: 'center' },
  startButtonDisabled: { backgroundColor: '#94a3b8' },
  startText: { color: '#fff', fontWeight: '700' },
});