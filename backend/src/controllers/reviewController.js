import Review from '../models/ReviewModel.js';

const reviewController = {};

// GET - Obtener todas las reseñas
reviewController.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST - Crear nueva reseña
reviewController.createReview = async (req, res) => {
    try {
        const { comment, rating } = req.body;
        // Crear nueva reseña
        const newReview = new Review({
            comment,
            rating
        });

        await newReview.save();

        res.status(201).json({
            message: 'Reseña creada exitosamente',
            review: newReview
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// La reseña no se podrá actualizar, en ningún momento el cliente tendrá acceso a esta

// DELETE - Eliminar reseña
reviewController.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return res.status(404).json({ message: 'Reseña no encontrada' });
        }

        res.json({ message: 'Reseña eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default reviewController;