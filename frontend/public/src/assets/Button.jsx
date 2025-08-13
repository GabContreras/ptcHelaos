function Button({ titulo, color, tipoColor, onClick, className }) {
  const isBackground = tipoColor === 'background';

  const backgroundColor = isBackground ? color : '#fff';
  const borderColor = !isBackground ? color : '#fff';
  const shadowColor = !isBackground ? color : '#fff';

  return (
    <button
      className={`responsive-button ${className || ''}`}
      style={{
        backgroundColor,
        color: isBackground ? 'white' : color,
        border: `2px solid ${borderColor}`,
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: 'inherit',
        fontWeight: '600',
        boxShadow: `3px 3px 0px ${shadowColor}`,
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        outline: 'none',
        whiteSpace: 'nowrap',
        // Tamaños base que serán sobrescritos por CSS
        padding: '8px 16px',
        minWidth: '100px',
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = `4px 4px 0px ${shadowColor}`;
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = `3px 3px 0px ${shadowColor}`;
      }}
      onMouseDown={(e) => {
        e.target.style.transform = 'translateY(1px)';
        e.target.style.boxShadow = `1px 1px 0px ${shadowColor}`;
      }}
      onMouseUp={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = `4px 4px 0px ${shadowColor}`;
      }}
      onClick={onClick}
    >
      {titulo}
    </button>
  );
}

export default Button;