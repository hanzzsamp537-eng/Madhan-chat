import dotenv from 'dotenv';
import path from 'path';

// 1. Load environment variables FIRST
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import express from 'express';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 2. Import API handler dynamically AFTER dotenv
  const { default: apiHandler } = await import('./api/index.js');

  app.all('/api', async (req, res) => {
    try {
      await apiHandler(req, res);
    } catch (error) {
      console.error('API Handler Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
