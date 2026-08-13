import { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Session = {
  id: string;
  subject: string;
  duration: number;
  date: string;
};

const STORAGE_KEY = 'study-sessions';

function getStartOfWeek(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diff = now.getDate() - day;
  const start = new Date(now.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
}

function calculateStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;

  const uniqueDates = [...new Set(sessions.map((s) => s.date))].sort().reverse();

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const dateStr of uniqueDates) {
    const sessionDate = new Date(dateStr);
    sessionDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default function StatsScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadSessions = async () => {
        try {
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored) {
            setSessions(JSON.parse(stored));
          }
        } catch (err) {
          console.error('Failed to load sessions:', err);
        }
      };
      loadSessions();
    }, [])
  );

  const startOfWeek = getStartOfWeek();
  const weekMinutes = sessions
    .filter((s) => new Date(s.date) >= startOfWeek)
    .reduce((sum, s) => sum + s.duration, 0);
  const weekHours = (weekMinutes / 60).toFixed(1);

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const streak = calculateStreak(sessions);

  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Your Stats</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No sessions logged yet — add one from Home to see your stats
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Stats</Text>

      <View style={styles.statCard}>
        <Text style={styles.statValue}>{weekHours}</Text>
        <Text style={styles.statLabel}>Hours this week</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statValue}>{streak}</Text>
        <Text style={styles.statLabel}>Day streak</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statValue}>{totalHours}</Text>
        <Text style={styles.statLabel}>Total hours logged</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statValue}>{sessions.length}</Text>
        <Text style={styles.statLabel}>Total sessions</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  statCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: 32, fontWeight: '700', color: '#3c87f7' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 4 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  emptyStateText: { fontSize: 16, color: '#999', textAlign: 'center' },
});