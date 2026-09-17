const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1x1 blue PNG buffer
const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkWNz/HwAElQHoXlZpvwAAAABJRU5ErkJggg==',
  'base64'
);

const files = [
  'icon.png',
  'splash.png',
  'adaptive-icon.png',
  'favicon.png',
  'notification-icon.png'
];

files.forEach(file => {
  const filePath = path.join(assetsDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, tinyPng);
    console.log(`Created ${file}`);
  }
});

