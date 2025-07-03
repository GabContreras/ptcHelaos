import nodemailer from 'nodemailer'
import { config } from '../config.js'

const sendVerificationEmail = async (emails, verificationCodes, userType = 'customer') => {
    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: config.email.email_user,
            pass: config.email.email_pass
        }
    })

    // Configurar contenido según el tipo de usuario
    const getEmailContent = (type) => {
        const baseConfig = {
            customer: {
                emoji: '🛍️',
                title: '¡Bienvenido como Cliente!',
                description: 'Gracias por registrarte como cliente en Moon Ice Cream.',
                subtitle: 'Disfruta de nuestros deliciosos sabores 🍦'
            },
            employee: {
                emoji: '👥',
                title: '¡Bienvenido al Equipo!',
                description: 'Gracias por unirte como empleado a Moon Ice Cream.',
                subtitle: 'Juntos creamos momentos dulces 💼'
            }
        }
        return baseConfig[type] || baseConfig.customer
    }

    const content = getEmailContent(userType)

    const mailOptions = {
        from: config.email.email_user,
        to: emails,
        subject: `Verificación de correo - ${userType === 'employee' ? 'Empleado' : 'Cliente'} | Moon Ice Cream`,
        html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verificación de Correo</title>
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
                        background: linear-gradient(135deg, ${userType === 'employee' ? '#B9B8FF 0%, #8D6CFF 100%' : '#FFBAE7 0%, #99DBFF 100%'});
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
                        background: linear-gradient(135deg, #F2E8D5 0%, #FFBAE7 100%);
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

                    .footer {
                        background: linear-gradient(135deg, #F2E8D5 0%, #99DBFF 100%);
                        color: #666;
                        text-align: center;
                        font-size: 13px;
                        padding: 20px;
                        border-top: 1px solid rgba(141, 108, 255, 0.1);
                    }

                    .icon {
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
                            <span class="icon">${content.emoji}</span>
                            Moon Ice Cream
                        </div>
                        <h1>${content.title}</h1>
                    </div>
                    <div class="content">
                        <p>¡Estimado/a! 👋</p>
                        <p>${content.description} Para completar tu verificación, por favor utiliza el siguiente código:</p>
                        <div class="code-box">${verificationCodes}</div>
                        <p>Este código expirará en <strong>2 horas</strong>. Si no solicitaste este correo, por favor ignóralo de forma segura.</p>
                        <p>Si necesitas asistencia, puedes comunicarte con nuestro equipo de soporte.</p>
                    </div>
                    <div class="footer">
                        ${content.subtitle}<br/>
                        &copy; ${new Date().getFullYear()} Moon Ice Cream. Todos los derechos reservados.
                    </div>
                </div>
            </body>
            </html>
        `
    }

    return transporter.sendMail(mailOptions)
}

// Función específica para clientes
const sendCustomerVerificationEmail = async (email, verificationCode) => {
    return sendVerificationEmail(email, verificationCode, 'customer')
}

// Función específica para empleados  
const sendEmployeeVerificationEmail = async (email, verificationCode) => {
    return sendVerificationEmail(email, verificationCode, 'employee')
}

export default sendVerificationEmail
export { sendCustomerVerificationEmail, sendEmployeeVerificationEmail }