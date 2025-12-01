import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import LargeButton from '../components/LargeButton';
import { AgendaItem, useAppState } from '../contexts/AppStateContext';

export type AgendaScreenProps = NativeStackScreenProps<RootStackParamList, 'Agenda'>;

const AgendaScreen: React.FC<AgendaScreenProps> = ({ navigation }) => {
  const { agenda, setAgenda } = useAppState();
  const [manualText, setManualText] = useState('');

  useEffect(() => {
    if (agenda.length === 0) return;

    const agendaAsText = agenda.map((item) => item.text).join('\n');
    setManualText((current) => (current ? current : agendaAsText));
  }, [agenda]);

  const parseAgenda = (text: string): AgendaItem[] =>
    text
      .split(/\n|\r/)
      .map((row) => row.trim())
      .filter(Boolean)
      .map((row, index) => ({ id: `agenda-${index}`, text: row }));

  const handleSave = () => {
    const source = manualText;
    if (!source.trim()) {
      Alert.alert('Manglende dagsorden', 'Tilføj en dagsorden ved at indtaste den manuelt.');
      return;
    }
    const items = parseAgenda(source);
    setAgenda(items);
    navigation.navigate('Recording');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dagsorden</Text>
        <Text style={styles.subtitle}>Tilføj punkter ved at skrive dem manuelt.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Skriv dagsorden</Text>
          <Text style={styles.helper}>
            Kamera-scanning er midlertidigt slået fra. Indtast dine punkter manuelt (ét punkt per linje).
          </Text>
          <TextInput
            multiline
            placeholder="Skriv dagsorden her..."
            placeholderTextColor="#6b7280"
            style={styles.input}
            value={manualText}
            onChangeText={setManualText}
          />
        </View>

        <LargeButton label="Færdig" variant="primary" onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c1117',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 16,
  },
  label: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  helper: {
    color: '#94a3b8',
    marginBottom: 10,
  },
  input: {
    minHeight: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    color: '#f8fafc',
    backgroundColor: '#0f172a',
    textAlignVertical: 'top',
  },
});

export default AgendaScreen;
