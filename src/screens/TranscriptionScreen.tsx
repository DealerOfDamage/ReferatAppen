import React from 'react';
import { FlatList, SafeAreaView, Share, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppState } from '../contexts/AppStateContext';
import LargeButton from '../components/LargeButton';

export type TranscriptionScreenProps = NativeStackScreenProps<RootStackParamList, 'Transcription'>;

const TranscriptionScreen: React.FC<TranscriptionScreenProps> = ({ navigation }) => {
  const { transcription, reset } = useAppState();

  const handleShare = async () => {
    const text = transcription
      .map((section) => `${section.agendaTitle}\n${section.summary}`)
      .join('\n\n');
    await Share.share({ message: text });
  };

  const handleNew = () => {
    reset();
    navigation.navigate('Recording');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Transskription</Text>
      <Text style={styles.subtitle}>
        Referatet er matchet med dagsordenen for at give tydelige talepunkter.
      </Text>

      <FlatList
        data={transcription}
        keyExtractor={(item, index) => item.agendaId ?? `${index}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.agendaTitle}</Text>
            <Text style={styles.cardBody}>{item.summary}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.card}>            
            <Text style={styles.cardBody}>Ingen transskription tilgængelig endnu.</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <LargeButton label="Del" variant="secondary" onPress={handleShare} disabled={transcription.length === 0} />
        <LargeButton label="Start ny optagelse" variant="primary" onPress={handleNew} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c1117',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 6,
  },
  cardBody: {
    color: '#cbd5e1',
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 8,
  },
});

export default TranscriptionScreen;
