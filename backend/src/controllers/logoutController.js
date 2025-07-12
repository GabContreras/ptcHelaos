const logout = {}

logout.logout = async (req, res) => {
    try {
        res.clearCookie("authToken")
        res.status(200).json({ message: "Sesión cerrada exitosamente" })
    } catch (error) {
        console.error('Error en logout:', error)
        res.status(500).json({ message: "Error cerrando sesión" })
    }
}

export default logout