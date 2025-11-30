import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LargeButton from '../components/LargeButton';
import { RootStackParamList } from '../../App';
import { useAppState } from '../contexts/AppStateContext';

export type RecordingScreenProps = NativeStackScreenProps<RootStackParamList, 'Recording'>;

const RecordingScreen: React.FC<RecordingScreenProps> = ({ navigation }) => {
  const { agenda, recordingStatus, startRecording, stopRecording, runTranscription } = useAppState();

  const hasAgenda = agenda.length > 0;
  const isRecording = recordingStatus === 'recording';
  const isProcessing = recordingStatus === 'processing';

  const handleRecordPress = async () => {
    if (isRecording) {
      await stopRecording();
      await runTranscription();
      navigation.navigate('Transcription');
    } else {
      await startRecording();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ReferatAppen</Text>
      <Text style={styles.subtitle}>Automatisk referat på dansk</Text>

      <View style={styles.buttons}>
        <LargeButton
          label={hasAgenda ? 'Skift dagsorden' : 'Tilføj dagsorden'}
          onPress={() => navigation.navigate('Agenda')}
          variant="secondary"
          disabled={isProcessing}
        />

        <LargeButton
          label={isRecording ? 'Stop optagelse' : 'Start optagelse'}
          variant="primary"
          onPress={handleRecordPress}
          disabled={!hasAgenda || isProcessing}
          loading={isProcessing}
        />

        <LargeButton
          label="Vis transskription"
          onPress={() => navigation.navigate('Transcription')}
          disabled={!hasAgenda || isProcessing}
        />
      </View>

      <View style={styles.stateBox}>
        <Text style={styles.stateLabel}>Status</Text>
        <Text style={styles.stateValue}>
          {isProcessing
            ? 'Behandler optagelse...'
            : isRecording
            ? 'Optagelse i gang'
            : hasAgenda
            ? 'Klar til optagelse'
            : 'Tilføj dagsorden for at starte'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c1117',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    color: '#f8fafc',
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 24,
  },
  buttons: {
    flex: 1,
    justifyContent: 'center',
  },
  stateBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 8,
  },
  stateLabel: {
    color: '#94a3b8',
    marginBottom: 6,
  },
  stateValue: {
    color: '#f8fafc',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default RecordingScreen;
