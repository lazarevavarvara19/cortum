const fs = require('fs');
const path = require('path');

const generateSVG = (color) => {
  const dotColor = color === 'white' ? '#FFFFFF' : '#111111';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 80" width="100%" height="100%">
    <defs>
      <pattern id="dot-pattern" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="2.4" fill="${dotColor}" />
      </pattern>
      <clipPath id="logo-clip">
        <text x="0" y="65" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="80" letter-spacing="-2">CORTUM</text>
      </clipPath>
      <linearGradient id="fade-left" x1="0" y1="0" x2="0.25" y2="0">
        <stop offset="0%" stop-color="white" stop-opacity="0" />
        <stop offset="100%" stop-color="white" stop-opacity="1" />
      </linearGradient>
      <mask id="fade-mask">
        <rect width="100%" height="100%" fill="url(#fade-left)" />
      </mask>
    </defs>
    <g mask="url(#fade-mask)">
      <rect width="100%" height="100%" fill="url(#dot-pattern)" clip-path="url(#logo-clip)" />
    </g>
  </svg>`;
};

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'logo-black.svg'), generateSVG('black'));
fs.writeFileSync(path.join(publicDir, 'logo-white.svg'), generateSVG('white'));
console.log('✅ Файлы логотипов успешно сохранены в папку public/');
