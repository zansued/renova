import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { texto, emocao, usuario_id } = req.body;
  const { data, error } = await supabase
    .from("thoughts")
    .insert([{ texto, emocao, usuario_id, created_at: new Date() }]);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Pensamento salvo com sucesso", data });
});

export default router;
