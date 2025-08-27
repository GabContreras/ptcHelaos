import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, rating, comentario } = req.body;

  try {
    // Configuración del transporte con Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `<${process.env.EMAIL_USER}>`,
      to: "noreply.moonsicecreamrolls@gmail.com", // destinatario
      subject: "Nueva calificación de servicio",
      text: `Cliente: ${email || "Correo no proporcionado"}
             Puntaje: ${rating}/5
             Comentario: ${comentario || "Sin comentario"}`,
      html: `
        <h2>Nueva calificación</h2>
        <p><strong>Cliente:</strong> ${email || "Correo no proporcionado"}</p>
        <p><strong>Puntaje:</strong> ${rating}/5</p>
        <p><strong>Comentario:</strong> ${comentario || "Sin comentario"}</p>
      `,
    });

    res.json({ success: true, message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ success: false, message: "Error enviando correo" });
  }
});

export default router;
