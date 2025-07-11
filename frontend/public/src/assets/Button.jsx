function Button({ titulo, color, tipoColor, onClick }) {
  const isBackground = tipoColor === 'background';

  const backgroundColor = isBackground ? color : '#fff';
  const borderColor = !isBackground ? color : '#fff';
  const shadowColor = !isBackground ? color : '#fff';

  return (
    <button
      style={{
        backgroundColor,
        color: isBackground ? 'white' : color,
        padding: '10px 20px',
        border: `none`,
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        boxShadow: `4px 4px 0px ${shadowColor}, -4px -4px 0px ${shadowColor}`,
        transition: 'all 0.3s ease',
      }}
      onClick={onClick}
    >
      {titulo}
    </button>
  );
}

export default Button;