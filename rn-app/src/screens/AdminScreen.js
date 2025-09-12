import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const ATHLETES = [
  { id: 'a1', name: 'A. Kumar', region: 'Maharashtra', age: 17 },
  { id: 'a2', name: 'S. Singh', region: 'Delhi', age: 16 },
];

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin - Athlete Submissions</Text>
      <FlatList data={ATHLETES} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={{ fontWeight: '700' }}>{item.name}</Text>
          <Text style={{ color: '#6b7280' }}>{item.region} • {item.age} yrs</Text>
        </View>
      )} />
      <TouchableOpacity style={styles.export}><Text style={{ color: '#fff' }}>Export CSV</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, title: { fontSize: 18, fontWeight: '800' }, item: { marginTop: 12, padding: 12, backgroundColor: '#fff', borderRadius: 8 }, export: { marginTop: 20, backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center' } });
