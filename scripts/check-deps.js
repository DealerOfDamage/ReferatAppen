const fs = require('fs');
const path = require('path');

const root = process.cwd();
const nodeModulesPath = path.join(root, 'node_modules');
const missingNodeModules = !fs.existsSync(nodeModulesPath);
const missingImagePicker = !missingNodeModules && !fs.existsSync(path.join(nodeModulesPath, 'expo-image-picker'));

if (missingNodeModules || missingImagePicker) {
  const messages = [
    'Afhængighederne ser ikke ud til at være installeret.',
    'Kør "npm install" (eller "npm ci") i projektroden før du starter Expo.',
    'Hvis du sidder bag en proxy/firewall, så tjek dine http_proxy/https_proxy-miljøvariabler,',
    'da de kan blokere download af @react-navigation-pakkerne og give 403-fejl.',
  ];

  console.error('\n' + messages.join('\n'));
  process.exit(1);
}
