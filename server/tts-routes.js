// TTS ROUTES - Text-to-Speech com Piper
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const PIPER_MODEL = path.join(__dirname, '..', 'tts-models', 'pt_BR-faber-medium.onnx');
const TMP_DIR = path.join(__dirname, '..', 'tts-temp');

// Criar diretório temporário se não existir
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

/**
 * POST /api/tts/speak
 * Gera áudio a partir de texto usando Piper TTS
 */
router.post('/speak', async (req, res) => {
  try {
    const { text, voice = 'default' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Texto não fornecido' });
    }

    // Limpar texto (remover emojis e caracteres especiais)
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[*_~`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanText.length === 0) {
      return res.status(400).json({ error: 'Texto vazio após limpeza' });
    }

    // Gerar nome de arquivo único
    const filename = `tts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.wav`;
    const outputPath = path.join(TMP_DIR, filename);

    // Executar Piper
    const command = `echo "${cleanText.replace(/"/g, '\\"')}" | piper --model "${PIPER_MODEL}" --output_file "${outputPath}"`;

    exec(command, { cwd: path.dirname(PIPER_MODEL) }, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro no Piper TTS:', error);
        console.error('stderr:', stderr);
        return res.status(500).json({ error: 'Erro ao gerar áudio', details: stderr });
      }

      // Verificar se arquivo foi criado
      if (!fs.existsSync(outputPath)) {
        return res.status(500).json({ error: 'Arquivo de áudio não foi gerado' });
      }

      // Enviar arquivo
      res.sendFile(outputPath, (err) => {
        if (err) {
          console.error('Erro ao enviar arquivo:', err);
        }

        // Deletar arquivo após enviar (cleanup)
        setTimeout(() => {
          try {
            fs.unlinkSync(outputPath);
          } catch (e) {
            console.error('Erro ao deletar arquivo temporário:', e);
          }
        }, 1000);
      });
    });

  } catch (error) {
    console.error('Erro no endpoint /speak:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * GET /api/tts/status
 * Verifica status do sistema TTS
 */
router.get('/status', (req, res) => {
  const modelExists = fs.existsSync(PIPER_MODEL);
  const tmpDirExists = fs.existsSync(TMP_DIR);

  res.json({
    status: modelExists ? 'online' : 'offline',
    model: path.basename(PIPER_MODEL),
    modelExists,
    tmpDirExists,
    tmpFiles: tmpDirExists ? fs.readdirSync(TMP_DIR).length : 0
  });
});

/**
 * POST /api/tts/cleanup
 * Limpa arquivos temporários antigos (> 1 hora)
 */
router.post('/cleanup', (req, res) => {
  try {
    const files = fs.readdirSync(TMP_DIR);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    let deleted = 0;

    files.forEach(file => {
      const filePath = path.join(TMP_DIR, file);
      const stats = fs.statSync(filePath);

      if (now - stats.mtimeMs > oneHour) {
        fs.unlinkSync(filePath);
        deleted++;
      }
    });

    res.json({ success: true, deleted, remaining: files.length - deleted });
  } catch (error) {
    console.error('Erro no cleanup:', error);
    res.status(500).json({ error: 'Erro ao limpar arquivos' });
  }
});

module.exports = router;
