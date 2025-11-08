import { Router } from 'express';
import { postThought, getThought } from '../controllers/thoughtsController.js';

const router = Router();

router.post('/', postThought);
router.get('/:id', getThought);

export default router;
