function Button({ titulo, color }) {
    return (
        <button style={{ 
        backgroundColor: color, 
        color: 'white', 
        padding: '10px 20px', 
        border: '#fff 2px solid', 
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        boxShadow: '4px 4px 0px #fff',}}>
        {titulo}
        </button>
    );
}

export default Button;