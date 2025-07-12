import React, { useState } from 'react';
import ReactStars from 'react-rating-stars-component';
import './RateService.css';

function RateService() {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    console.log('Calificación:', rating);
    console.log('Comentario:', comentario);
    // Aquí podrías enviar los datos a tu backend
    alert("¡Gracias por tu opinión!");
  };

  return (
    <div className="calificar-servicio">
      <h2>Califica nuestro servicio</h2>
      <p className="instruccion">Selecciona una calificación del 1 al 5:</p>

      <ReactStars
        count={5}
        onChange={handleRatingChange}
        size={40}
        isHalf={true}
        activeColor="#fcb900"
        value={rating}
      />

      <p className="instruccion">¿Quieres dejarnos un comentario? (opcional)</p>
      <textarea
        className="comentario-box"
        placeholder="Escribe aquí tu comentario..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />

      <button onClick={handleSubmit}>Enviar opinión</button>
    </div>
  );
}

export default RateService;
