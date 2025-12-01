const fs = require('fs');
const path = require('path');

const root = process.cwd();
const nodeModulesPath = path.join(root, 'node_modules');
const missingNodeModules = !fs.existsSync(nodeModulesPath);
if (missingNodeModules) {
  const messages = [
    'Afhængighederne ser ikke ud til at være installeret.',
    'Kør "npm install" (eller "npm ci") i projektroden før du starter Expo.',
    'Hvis du sidder bag en proxy/firewall, så tjek dine http_proxy/https_proxy-miljøvariabler,',
    'da de kan blokere download af @react-navigation-pakkerne og give 403-fejl.',
    '',
    'Hvis du ser 403-fejl, så prøv fx at køre:',
    '  unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY npm_config_http_proxy npm_config_https_proxy',
    '  npm config delete proxy && npm config delete https-proxy',
    '  npm config set registry https://registry.npmjs.org/',
    'og forsøg derefter igen med "npm install".',
  ];

  console.error('\n' + messages.join('\n'));
  process.exit(1);
}
