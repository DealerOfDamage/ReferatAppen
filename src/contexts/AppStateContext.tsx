import React, { createContext, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';

export type AgendaItem = {
  id: string;
  text: string;
};

export type TranscriptionSection = {
  agendaId?: string;
  agendaTitle: string;
  summary: string;
};

export type RecordingStatus = 'idle' | 'recording' | 'processing';

export type AppState = {
  agenda: AgendaItem[];
  recordingStatus: RecordingStatus;
  transcription: TranscriptionSection[];
  audioUri?: string;
  setAgenda: (items: AgendaItem[]) => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  runTranscription: () => Promise<void>;
  reset: () => void;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

const randomId = () => Math.random().toString(36).slice(2, 8);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agenda, setAgendaItems] = useState<AgendaItem[]>([]);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const [transcription, setTranscription] = useState<TranscriptionSection[]>([]);
  const [audioUri, setAudioUri] = useState<string | undefined>();

  const setAgenda = (items: AgendaItem[]) => {
    setAgendaItems(items.map((item) => ({ ...item, id: item.id ?? randomId() })));
    setTranscription([]);
  };

  const startRecording = async () => {
    try {
      setRecordingStatus('recording');
      setAudioUri(undefined);
    } catch (error) {
      setRecordingStatus('idle');
      Alert.alert('Optagelse mislykkedes', 'Kunne ikke starte optagelsen.');
    }
  };

  const stopRecording = async () => {
    try {
      setRecordingStatus('processing');
      setAudioUri('local://mødeoptagelse.wav');
    } catch (error) {
      setRecordingStatus('idle');
      Alert.alert('Stop mislykkedes', 'Kunne ikke stoppe optagelsen.');
    }
  };

  const runTranscription = async () => {
    if (!audioUri) {
      Alert.alert('Ingen optagelse', 'Der er ingen optagelse at transskribere.');
      return;
    }

    setRecordingStatus('processing');

    const mockTranscript =
      'Tak fordi I kom. Vi gennemgår status på projektet, budgetopfølgning og næste skridt.';

    const sections: TranscriptionSection[] =
      agenda.length > 0
        ? agenda.map((item, index) => ({
            agendaId: item.id,
            agendaTitle: item.text,
            summary: `${item.text}: ${mockTranscript} (punkt ${index + 1})`,
          }))
        : [
            {
              agendaTitle: 'Referat',
              summary: mockTranscript,
            },
          ];

    setTranscription(sections);
    setRecordingStatus('idle');
  };

  const reset = () => {
    setAgendaItems([]);
    setTranscription([]);
    setAudioUri(undefined);
    setRecordingStatus('idle');
  };

  const value = useMemo(
    () => ({
      agenda,
      recordingStatus,
      transcription,
      audioUri,
      setAgenda,
      startRecording,
      stopRecording,
      runTranscription,
      reset,
    }),
    [agenda, recordingStatus, transcription, audioUri],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return ctx;
};
