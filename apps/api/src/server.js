import express from "express";
import dotenv from "dotenv";
import analyzeRouter from "./routes/analyze.js";
import entriesRouter from "./routes/entries.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/analyze", analyzeRouter);
app.use("/entries", entriesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
