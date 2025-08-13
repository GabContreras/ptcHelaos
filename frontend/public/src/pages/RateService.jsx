import React, { useState } from 'react';
import './RateService.css';
import Button from "../assets/Button";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function RateService() {
    const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState('');

  const handleClick = (value) => setRating(value);
  const handleMouseEnter = (value) => setHover(value);
  const handleMouseLeave = () => setHover(0);

  const handleSubmit = () => {
        Swal.fire({
          icon: 'success',
          title: 'Opinión enviada',
          text: 'Gracias por darnos a conocer tu opinión.',
          confirmButtonText: 'OK!',
          backdrop: `
            #00000080
            left top
            no-repeat
          `
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/');
          }
        });
  };

  return (
    <>
    <div className="rate-container">
        <div className='rate-content'>
            <h2>Califica nuestro servicio</h2>
            <p className="instruction">Selecciona una calificación del 1 al 5:</p>

            <div className="stars">
                {[1, 2, 3, 4, 5].map((value) => (
                <span
                    key={value}
                    className={`star ${value <= (hover || rating) ? 'active' : ''}`}
                    onClick={() => handleClick(value)}
                    onMouseEnter={() => handleMouseEnter(value)}
                    onMouseLeave={handleMouseLeave}
                >
                    ★
                </span>
                ))}
            </div>

            <p className="instruction">¿Quieres dejarnos un comentario? (opcional)</p>
            <textarea
                className="coment-box"
                placeholder="Escribe aquí tu comentario..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
            />

            <Button titulo="Enviar" color="#8D6CFF" tipoColor="background" onClick={handleSubmit} />
        </div>
    </div>
    </>
  );
}

export default RateService;
