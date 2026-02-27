const downloadService = require('../services/downloadService');

const downloadMp3 = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL do vídeo é obrigatória.' });
  }

  try {
    const result = await downloadService.downloadAsMp3(url);
    return res.status(200).json({
      message: 'Download MP3 concluído com sucesso!',
      file: result.fileName,
      path: result.publicPath,
      url: result.fileUrl,
    });
  } catch (error) {
    console.error('[MP3 Error]', error.message);
    return res.status(500).json({ error: 'Erro ao baixar o vídeo como MP3.', details: error.message });
  }
};

const downloadMp4 = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL do vídeo é obrigatória.' });
  }

  try {
    const result = await downloadService.downloadAsMp4(url);
    return res.status(200).json({
      message: 'Download MP4 concluído com sucesso!',
      file: result.fileName,
      path: result.publicPath,
      url: result.fileUrl,
    });
  } catch (error) {
    console.error('[MP4 Error]', error.message);
    return res.status(500).json({ error: 'Erro ao baixar o vídeo como MP4.', details: error.message });
  }
};

module.exports = { downloadMp3, downloadMp4 };