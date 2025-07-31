import express from 'express';
import eventsController from '../controllers/eventsController.js';

const router = express.Router();

router.route('/')
.get(eventsController.getEvent)
.post(eventsController.insertEvent);

router.route('/:id')
.delete(eventsController.deleteEvent)
.put(eventsController.updateEvent)

export default router;