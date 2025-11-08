import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Renova API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Renova API listening on port ${PORT}`);
});
