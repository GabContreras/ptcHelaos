// Login.jsx
import { useLogin } from '../../hooks/LoginHook/useLogin';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        handleSubmit,
    } = useLogin();

    return (
        <div className="login-container">
            <div className="login-form-container">
                <div className="login-logo">
                    <span className="logo-icon">🍦</span>
                    <span className="logo-text">Moon Ice Cream</span>
                </div>

                <h1>Iniciar Sesión</h1>

                {error && <div className="error-message">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="tu-email@moonicecream.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Tu contraseña"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </div>

                    <div className="forgot-password">
                        <Link to="/recuperacion">¿Olvidaste tu contraseña?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;