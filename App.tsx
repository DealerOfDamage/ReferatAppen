import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStateProvider } from './src/contexts/AppStateContext';
import RecordingScreen from './src/screens/RecordingScreen';
import AgendaScreen from './src/screens/AgendaScreen';
import TranscriptionScreen from './src/screens/TranscriptionScreen';

export type RootStackParamList = {
  Recording: undefined;
  Agenda: undefined;
  Transcription: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#0c1117',
      primary: '#0c6cf2',
      text: '#f8fafc',
      card: '#111827',
      border: '#1f2937',
    },
  };

  return (
    <AppStateProvider>
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Recording" component={RecordingScreen} />
          <Stack.Screen name="Agenda" component={AgendaScreen} />
          <Stack.Screen name="Transcription" component={TranscriptionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppStateProvider>
  );
};

export default App;
