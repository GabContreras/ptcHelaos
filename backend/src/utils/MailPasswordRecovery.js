import nodemailer from "nodemailer";
import { config } from "../config.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: config.email.email_user,
        pass: config.email.email_pass
    }
});

const sendMail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"Moon Ice Cream" <info@moonicecream.com>',
            to,
            subject,
            text,
            html
        });
        return info;
    } catch (error) {
        console.log("Error sending recovery mail:", error);
        throw error;
    }
};

const HTMLRecoveryEmail = (code) => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Recuperación de Contraseña</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #8D6CFF 0%, #99DBFF 50%, #FFBAE7 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .container {
                max-width: 500px;
                margin: 20px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(141, 108, 255, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .header {
                background: linear-gradient(135deg, #8D6CFF 0%, #B9B8FF 100%);
                padding: 30px 25px;
                text-align: center;
                color: white;
                position: relative;
                overflow: hidden;
            }

            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: shimmer 3s ease-in-out infinite;
            }

            @keyframes shimmer {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(180deg); }
            }

            .header h1 {
                font-size: 26px;
                margin: 0;
                font-weight: 600;
                position: relative;
                z-index: 2;
            }

            .logo {
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 8px;
                color: white;
                position: relative;
                z-index: 2;
            }

            .content {
                padding: 35px 25px;
                color: #4a5568;
                font-size: 16px;
                line-height: 1.7;
                background: white;
            }

            .code-box {
                background: linear-gradient(135deg, #FFBAE7 0%, #F2E8D5 100%);
                border: 2px solid #8D6CFF;
                color: #8D6CFF;
                font-size: 32px;
                font-weight: 800;
                letter-spacing: 8px;
                text-align: center;
                padding: 25px;
                margin: 30px 0;
                border-radius: 15px;
                box-shadow: 0 10px 25px rgba(141, 108, 255, 0.2);
                position: relative;
                overflow: hidden;
            }

            .code-box::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                animation: slide 2s infinite;
            }

            @keyframes slide {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            .button {
                display: inline-block;
                background: linear-gradient(135deg, #99DBFF 0%, #8D6CFF 100%);
                color: white;
                text-decoration: none;
                padding: 15px 30px;
                font-weight: 600;
                border-radius: 25px;
                margin: 20px 0;
                transition: all 0.3s ease;
                box-shadow: 0 8px 20px rgba(141, 108, 255, 0.3);
            }

            .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 25px rgba(141, 108, 255, 0.4);
            }

            .footer {
                background: linear-gradient(135deg, #F2E8D5 0%, #FFBAE7 100%);
                color: #666;
                text-align: center;
                font-size: 13px;
                padding: 20px;
                border-top: 1px solid rgba(141, 108, 255, 0.1);
            }

            .ice-cream-icon {
                font-size: 28px;
                margin-bottom: 5px;
                display: block;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <span class="ice-cream-icon">🍦</span>
                    Moon Ice Cream
                </div>
                <h1>Recuperación de Contraseña</h1>
            </div>
            <div class="content">
                <p>¡Hola! 👋</p>
                <p>Hemos recibido una solicitud para restablecer tu contraseña. Si fuiste tú, usa el siguiente código de verificación:</p>
                <div class="code-box">${code}</div>
                <p>Este código expirará en <strong>30 minutos</strong>. Si no realizaste esta solicitud, puedes ignorar este mensaje de forma segura.</p>
                <p style="text-align: center;">
                    <a href="#" class="button">Ir a Moon Ice Cream</a>
                </p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Moon Ice Cream. Todos los derechos reservados.<br/>
                Este correo fue enviado automáticamente, por favor no respondas a este mensaje.
            </div>
        </div>
    </body>
    </html>
    `;
};

export { sendMail, HTMLRecoveryEmail };