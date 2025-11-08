import express from 'express';
import thoughtsRouter from './routes/thoughts.js';
import analyzeRouter from './routes/analyze.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/thoughts', thoughtsRouter);
app.use('/analyze', analyzeRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';
  res.status(status).json({ error: message });
});

export default app;
