import { analyzeThought } from '../services/analyzeService.js';

export async function postAnalyze(req, res, next) {
  try {
    const analysis = await analyzeThought(req.body);
    res.json({ data: analysis });
  } catch (error) {
    next(error);
  }
}
