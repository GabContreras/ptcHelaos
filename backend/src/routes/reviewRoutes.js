import express from 'express';
import reviewController from '../controllers/reviewController.js';
import { validateAuthToken } from '../middlewares/validateAuthToken.js';

const router = express.Router();
// La reseña no se podrá actualizar, en ningún momento el cliente tendrá acceso a esta

// Rutas públicas
router.route('/:id')
    .get(validateAuthToken(['admin', 'employee']), reviewController.getReviewById)
    .delete(validateAuthToken(['admin', 'employee']), reviewController.deleteReview)
// .put(validateAuthToken(['admin', 'employee',]), reviewCtrl.updateReview)

router.route('/')
    //Para ver todas las reviews 
    .get(validateAuthToken(['admin', 'employee']), reviewController.getAllReviews)
    //para subir reviews
    .post(validateAuthToken(['admin', 'employee', 'customer']), reviewController.createReview)

export default router;