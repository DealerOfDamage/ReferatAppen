import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { scanFromURLAsync } from 'expo-mlkit-ocr';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import LargeButton from '../components/LargeButton';
import { AgendaItem, useAppState } from '../contexts/AppStateContext';

export type AgendaScreenProps = NativeStackScreenProps<RootStackParamList, 'Agenda'>;

const AgendaScreen: React.FC<AgendaScreenProps> = ({ navigation }) => {
  const { agenda, setAgenda } = useAppState();
  const [manualText, setManualText] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();

  useEffect(() => {
    if (agenda.length === 0) return;

    const agendaAsText = agenda.map((item) => item.text).join('\n');
    setManualText((current) => (current ? current : agendaAsText));
    setOcrText((current) => (current ? current : agendaAsText));
  }, [agenda]);

  const parseAgenda = (text: string): AgendaItem[] =>
    text
      .split(/\n|\r/)
      .map((row) => row.trim())
      .filter(Boolean)
      .map((row, index) => ({ id: `agenda-${index}`, text: row }));

  const ensureCameraAccess = async () => {
    const permission = cameraPermission ?? (await requestCameraPermission());
    if (!permission?.granted) {
      const newPermission = await requestCameraPermission();
      if (!newPermission.granted) {
        Alert.alert('Kameratilladelse', 'Aktivér kameratilladelse for at scanne dagsordenen.');
        return false;
      }
    }
    return true;
  };

  const handleCameraOcr = async () => {
    const canUseCamera = await ensureCameraAccess();
    if (!canUseCamera) return;

    const capture = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
      base64: false,
    });

    if (capture.canceled || !capture.assets?.length) return;

    setIsScanning(true);

    try {
      const imageUri = capture.assets[0]?.uri;
      if (!imageUri) {
        throw new Error('Billedet kunne ikke gemmes.');
      }

      const result = await scanFromURLAsync(imageUri);
      const extractedText = result.blocks.map((block) => block.text).join('\n').trim();

      if (!extractedText) {
        Alert.alert('Ingen tekst fundet', 'Prøv igen i bedre lys eller fokuser på teksten.');
        return;
      }

      setOcrText(extractedText);
      setManualText(extractedText);
      Alert.alert('Kamera + OCR', 'Teksten er hentet fra billedet. Juster teksten om nødvendigt.');
    } catch (error) {
      console.error('OCR-fejl', error);
      Alert.alert('OCR mislykkedes', 'Teksten kunne ikke læses. Prøv igen.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSave = () => {
    const source = manualText || ocrText;
    if (!source.trim()) {
      Alert.alert('Manglende dagsorden', 'Tilføj en dagsorden via kamera eller tekst.');
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
        <Text style={styles.subtitle}>Tilføj punkter via kamera + OCR eller skriv dem manuelt.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Kamera + OCR</Text>
          <Text style={styles.helper}>Tag et billede af dagsordenen. Teksten udtrækkes automatisk.</Text>
          <LargeButton label="Åbn kamera" onPress={handleCameraOcr} loading={isScanning} />
          {ocrText ? <Text style={styles.preview}>{ocrText}</Text> : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Skriv dagsorden</Text>
          <Text style={styles.helper}>Et punkt per linje.</Text>
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
  preview: {
    color: '#cbd5e1',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default AgendaScreen;
