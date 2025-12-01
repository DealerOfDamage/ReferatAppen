# ReferatAppen

En cross-platform mobilapp (iOS & Android) bygget med Expo/React Native til at indsamle en dansk dagsorden, optage møder og transskribere lokalt med efterfølgende matching mod dagsordenspunkter.

## Funktioner
- **Dagsorden**: Tilføj via kamera + OCR (på enheden med ML Kit) eller manuelt tekstinput, derefter aktiveres optagelsesflowet.
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

### Fejlfinding ved opgradering til Expo SDK 54
- Sørg for, at `react-native` og `@types/react-native` er låst til version `0.76.6`, da Expo SDK 54 forventer React Native 0.76.x. Pakkens `overrides`-felt håndhæver dette, men hvis du har en gammel `package-lock.json`, kan du slette den og køre `npm install` igen.
- Hvis npm melder om `peer react-native@"0.74.x"`, skyldes det typisk en forældet `@types/react-native`. Opdatér den til `0.76.6` eller nyere, og geninstaller afhængighederne.
- Hvis du får netværksfejl som `EAI_AGAIN` eller `403 Forbidden` under installation, er det normalt ikke et kodeproblem. Tjek din proxy-/firewallkonfiguration, fjern gamle miljøvariabler som `http_proxy`/`https_proxy`, og prøv igen med projektets bundne versioner (`npm install` i roden frem for `npm install expo@46`).
- Fejlen `PluginError: Failed to resolve plugin for module "expo-image-picker"` betyder næsten altid, at `node_modules` mangler. Sørg for at installere afhængighederne i projektroden (`npm install` eller `npm ci`), og start derefter Expo på ny (`npm start`). Hvis du bruger en proxy, så fjern eller korrigér proxy-miljøvariabler, da de kan blokere download af @react-navigation-pakkerne. `npm start` stopper nu tidligt med en klar fejlbesked, hvis `node_modules` mangler, så du undgår de mindre forståelige Expo-plugin-fejl.

> Bemærk: Kamera + OCR kører nu on-device via Expo ML Kit, mens Whisper/transskription stadig er stubbet. Integrér et on-device Whisper-build for produktionsbrug.
