const YTDlpWrap = require('yt-dlp-wrap').default;
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');
const COOKIES_PATH = path.join(__dirname, '..', '..', 'cookies.txt');

// Pastas de saída
const MP3_DIR = path.join(__dirname, '..', '..', 'public', 'mp3');
const MP4_DIR = path.join(__dirname, '..', '..', 'public', 'mp4');

// Pasta onde o binário do yt-dlp será salvo
const BIN_DIR = path.join(__dirname, '..', '..', 'bin');
const YTDLP_BIN = path.join(BIN_DIR, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');

// Caminho do Node.js (usado como JS runtime pelo yt-dlp)
const NODE_PATH = process.execPath;

// Garante que as pastas existam
[MP3_DIR, MP4_DIR, BIN_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

let ytDlp = null;

/**
 * Inicializa o yt-dlp, baixando o binário se necessário
 */
const initYtDlp = async () => {
  if (ytDlp) return ytDlp;

  if (!fs.existsSync(YTDLP_BIN)) {
    console.log('⬇️  Baixando binário do yt-dlp automaticamente...');
    await YTDlpWrap.downloadFromGithub(YTDLP_BIN);
    console.log('✅ yt-dlp baixado com sucesso!');
  }

  ytDlp = new YTDlpWrap(YTDLP_BIN);
  return ytDlp;
};

/**
 * Argumentos padrão que incluem o Node.js como JS runtime
 */
const defaultArgs = () => {
  const args = [
    '--js-runtimes', `node:${NODE_PATH}`,
    '--no-playlist',
    '--proxy', 'http://wfccxydm:wb6f6tse3w69@185.72.240.69:7105',
  ];

  if (fs.existsSync(COOKIES_PATH)) {
    args.push('--cookies', COOKIES_PATH);
  }

  return args;
};


/**
 * Gera um nome de arquivo seguro
 */
const sanitizeFileName = (name) => {
  return name.replace(/[^a-z0-9]/gi, '_').substring(0, 100);
};

/**
 * Obtém o título do vídeo usando --dump-json (sem -f best)
 */
const getVideoTitle = async (url) => {
  const yt = await initYtDlp();

  const output = await yt.execPromise([
    url,
    '--dump-json',
    '--no-warnings',
    ...defaultArgs(),
  ]);

  try {
    const info = JSON.parse(output);
    return info.title || 'video_' + Date.now();
  } catch {
    return 'video_' + Date.now();
  }
};

/**
 * Download do vídeo como MP3
 */
const downloadAsMp3 = async (url) => {
  const yt = await initYtDlp();
  const title = await getVideoTitle(url);
  const fileName = sanitizeFileName(title) + '.mp3';
  const outputPath = path.join(MP3_DIR, fileName);

  await yt.execPromise([
    url,
    '--extract-audio',
    '--audio-format', 'mp3',
    '--audio-quality', '0',
    '--ffmpeg-location', path.dirname(ffmpegPath),
    '-o', outputPath,
    ...defaultArgs(),
  ]);

  return {
    fileName,
    publicPath: outputPath,
    fileUrl: `/public/mp3/${fileName}`,
  };
};

/**
 * Download do vídeo como MP4
 */
const downloadAsMp4 = async (url) => {
  const yt = await initYtDlp();
  const title = await getVideoTitle(url);
  const fileName = sanitizeFileName(title) + '.mp4';
  const outputPath = path.join(MP4_DIR, fileName);

  await yt.execPromise([
    url,
    '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    '--merge-output-format', 'mp4',
    '--ffmpeg-location', path.dirname(ffmpegPath),
    '-o', outputPath,
    ...defaultArgs(),
  ]);

  return {
    fileName,
    publicPath: outputPath,
    fileUrl: `/public/mp4/${fileName}`,
  };
};

module.exports = { downloadAsMp3, downloadAsMp4 };
