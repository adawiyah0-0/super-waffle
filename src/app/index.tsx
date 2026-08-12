import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Modal, TextInput } from 'react-native';

type Session = {
  id: string;
  subject: string;
  duration: number;
  date: string;
};

const initialSessions: Session[] = [
  { id: '1', subject: 'Data Structures', duration: 45, date: '2026-08-10' },
  { id: '2', subject: 'React Native', duration: 30, date: '2026-08-09' },
  { id: '3', subject: 'Database Systems', duration: 60, date: '2026-08-08' },
];

export default function HomeScreen() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [modalVisible, setModalVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');

  const handleAdd = () => {
    if (!subject.trim() || !duration.trim()) return;

    const newSession: Session = {
      id: Date.now().toString(),
      subject: subject.trim(),
      duration: Number(duration),
      date: new Date().toISOString().split('T')[0],
    };

    setSessions([newSession, ...sessions]);
    setSubject('');
    setDuration('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Study Sessions</Text>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.details}>{item.duration} min · {item.date}</Text>
          </View>
        )}
      />

      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Session</Text>

            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={subject}
              onChangeText={setSubject}
            />
            <TextInput
              style={styles.input}
              placeholder="Duration (minutes)"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleAdd}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  list: { paddingBottom: 100 },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  subject: { fontSize: 16, fontWeight: '600' },
  details: { fontSize: 14, color: '#666', marginTop: 4 },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#3c87f7',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  addButtonText: { color: 'white', fontSize: 28, lineHeight: 30 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  cancelButton: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelButtonText: { color: '#666', fontSize: 16 },
  saveButton: {
    backgroundColor: '#3c87f7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});