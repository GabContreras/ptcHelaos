import { useState } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const useDataPassRecovery = () => {
  const [activeTab, setActiveTab] = useState("requestCode");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);

  const ApiBase = "http://localhost:4000/api/passwordRecovery";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "requestCode") {
        if (!email) return toast.error("Ingrese un correo electrónico válido");

        const res = await fetch(`${ApiBase}/requestCode`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (data.message === "Verification code send") {
          toast.success("Código enviado al correo");
          setActiveTab("verifyCode");
        } else {
          toast.error(data.message || "Error al enviar el código");
        }
      }

      if (activeTab === "verifyCode") {
        if (!code) return toast.error("Ingrese el código enviado");

        const res = await fetch(`${ApiBase}/verifyCode`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code }),
        });

        const data = await res.json();
        if (data.message === "Code verified successfully") {
          toast.success("Código verificado correctamente");
          setActiveTab("newPassword");
        } else {
          toast.error(data.message || "Código inválido");
        }
      }

      if (activeTab === "newPassword") {
        if (!newPassword || !confirmPassword)
          return toast.error("Complete ambos campos de contraseña");

        if (newPassword !== confirmPassword)
          return toast.error("Las contraseñas no coinciden");

        const res = await fetch(`${ApiBase}/newPassword`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ newPassword }),
        });

        const data = await res.json();
        if (data.message === "Password updated successfully") {
          toast.success("Contraseña actualizada con éxito");
          Navigate("/");
          setEmail("");
          setCode("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          toast.error(data.message || "Error al actualizar la contraseña");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleSubmit,
    loading
  };
};

export default useDataPassRecovery;