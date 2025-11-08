import { createThought, getThoughtById } from '../services/thoughtService.js';

export async function postThought(req, res, next) {
  try {
    const thought = await createThought(req.body);
    res.status(201).json({ data: thought });
  } catch (error) {
    next(error);
  }
}

export async function getThought(req, res, next) {
  try {
    const thought = await getThoughtById(req.params.id);
    res.json({ data: thought });
  } catch (error) {
    next(error);
  }
}
