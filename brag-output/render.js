import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compDir = path.resolve(__dirname, 'composition');
const outputMp4 = path.resolve(__dirname, 'brag.mp4');
const outputJpg = path.resolve(__dirname, 'brag.jpg');

console.log('🎬 JanSahayak Launch Video Renderer');
console.log('Composition Directory:', compDir);
console.log('Target Output:', outputMp4);

try {
  console.log('\n[1/2] Rendering MP4 via Hyperframes...');
  const cmd = `npx -y hyperframes render "${compDir}" -o "${outputMp4}"`;
  console.log('Running:', cmd);
  execSync(cmd, { stdio: 'inherit' });
  console.log('✅ Video rendered successfully to:', outputMp4);

  console.log('\n[2/2] Extracting poster thumbnail at t=21.0s...');
  // Find ffmpeg
  const ffmpegPaths = [
    'ffmpeg',
    'C:\\Users\\rauts\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.1-full_build\\bin\\ffmpeg.exe',
  ];
  
  let ffmpegBin = 'ffmpeg';
  for (const p of ffmpegPaths) {
    if (fs.existsSync(p)) {
      ffmpegBin = `"${p}"`;
      break;
    }
  }

  const thumbCmd = `${ffmpegBin} -y -ss 00:00:21 -i "${outputMp4}" -vframes 1 -q:v 2 "${outputJpg}"`;
  console.log('Running:', thumbCmd);
  execSync(thumbCmd, { stdio: 'inherit' });
  console.log('✅ Poster extracted successfully to:', outputJpg);

} catch (err) {
  console.error('❌ Render failed:', err.message);
  process.exit(1);
}
