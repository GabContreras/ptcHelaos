// Importación del modelo de reseñas
import Review from '../models/ReviewModel.js';

const reviewController = {};

// CONTROLADOR PARA OBTENER TODAS LAS RESEÑAS
reviewController.getAllReviews = async (req, res) => {
    try {
        // Buscar todas las reseñas en la base de datos
        const reviews = await Review.find()
        
        res.json(reviews);
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: error.message });
    }
};

// CONTROLADOR PARA CREAR UNA NUEVA RESEÑA
reviewController.createReview = async (req, res) => {
    try {
        // Extraer datos de la reseña del cuerpo de la petición
        const { comment, rating } = req.body;
        
        // CREAR NUEVA RESEÑA
        // Solo requiere comentario y calificación - diseño simplificado
        const newReview = new Review({
            comment,
            rating
        });

        // Guardar la reseña en la base de datos
        await newReview.save();

        res.status(201).json({
            message: 'Reseña creada exitosamente',
            review: newReview
        });
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: error.message });
    }
};

// NOTA: LA RESEÑA NO SE PODRÁ ACTUALIZAR
// Por decisión de negocio, en ningún momento el cliente tendrá acceso 
// a modificar una reseña una vez creada para mantener la integridad 
// y autenticidad de las opiniones

// CONTROLADOR PARA ELIMINAR UNA RESEÑA
reviewController.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar y eliminar la reseña por ID
        const deletedReview = await Review.findByIdAndDelete(id);

        // Verificar si la reseña existía
        if (!deletedReview) {
            return res.status(404).json({ message: 'Reseña no encontrada' });
        }

        res.json({ message: 'Reseña eliminada exitosamente' });
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: error.message });
    }
};

export default reviewController;