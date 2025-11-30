# ReferatAppen

En cross-platform mobilapp (iOS & Android) bygget med Expo/React Native til at indsamle en dansk dagsorden, optage møder og transskribere lokalt med efterfølgende matching mod dagsordenspunkter.

## Funktioner
- **Dagsorden**: Tilføj via kamera + OCR eller manuelt tekstinput, derefter aktiveres optagelsesflowet.
- **Optagelse**: Start/stop optagelse fra hovedskærmen; status vises tydeligt.
- **Transskription & matching**: Efter stop behandles optagelsen (placeholder Whisper-kald) og resultaterne vises pr. dagsordenpunkt med muligheder for deling eller ny optagelse.
- **Dansk UI**: Hele appen er på dansk og fokuserer på enkel betjening med tre store knapper på hovedskærmen.

## Projektstruktur
- `App.tsx`: Navigation og tema.
- `src/contexts/AppStateContext.tsx`: Delt state for dagsorden, optagelse og transskription.
- `src/screens/RecordingScreen.tsx`: Hovedskærm med de tre primære knapper.
- `src/screens/AgendaScreen.tsx`: Flow til kamera+OCR eller manuelt input.
- `src/screens/TranscriptionScreen.tsx`: Viser transskriptionen matchet mod dagsordenen samt deling/genstart.
- `src/components/LargeButton.tsx`: Genanvendelig knap-komponent til de store CTA'er.

## Kom i gang
1. Installer afhængigheder: `npm install` (kræver Node 18+).
2. Start udviklingsserveren: `npm start` (åbner Expo Dev Tools).
3. Kør på enhed/simulator: `npm run ios` eller `npm run android`.

> Bemærk: OCR og Whisper-kald er beskrevet i koden som stub-implementeringer. Integrér enhedens kamera/medie-API'er samt et on-device Whisper-build for produktionsbrug.
