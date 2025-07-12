import PettyCash from '../models/PettyCash.js';

const pettyCashController = {};

// GET - Obtener todos los movimientos de caja chica
pettyCashController.getAllMovements = async (req, res) => {
    try {
        const movements = await PettyCash.find().sort({ date: -1 });
        
        // Hacer populate manual solo para ObjectIds válidos
        const populatedMovements = await Promise.all(
            movements.map(async (movement) => {
                if (movement.employeeId !== 'admin' && movement.employeeId) {
                    try {
                        // Solo intentar populate si es un ObjectId válido
                        if (movement.employeeId.toString().match(/^[0-9a-fA-F]{24}$/)) {
                            await movement.populate('employeeId', 'name email');
                        }
                    } catch (error) {
                        console.log('Error en populate:', error);
                    }
                }
                return movement;
            })
        );
        
        res.json(populatedMovements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - Obtener balance actual de caja chica
pettyCashController.getCurrentBalance = async (req, res) => {
    try {
        const lastMovement = await PettyCash.findOne()
            .sort({ date: -1, createdAt: -1 })
            .select('currentBalance');

        const currentBalance = lastMovement ? lastMovement.currentBalance : 0;
        
        res.json({ currentBalance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST - Operación unificada para caja chica (ingresos y egresos)
pettyCashController.cashOperation = async (req, res) => {
    try {
        const { operationType, amount, reason, employeeId } = req.body;
        const { userType, user } = req.user; // Viene del middleware de autenticación

        // Validar campos requeridos
        if (!operationType || !amount || !reason) {
            return res.status(400).json({
                message: 'Todos los campos son requeridos: operationType, amount, reason'
            });
        }

        // Validar que si no es admin, se proporcione employeeId
        if (userType !== 'admin' && !employeeId) {
            return res.status(400).json({
                message: 'Se requiere employeeId para usuarios no admin'
            });
        }

        // Validar cantidad
        if (amount <= 0) {
            return res.status(400).json({
                message: 'La cantidad debe ser mayor a 0'
            });
        }

        // Obtener el balance actual
        const lastMovement = await PettyCash.findOne()
            .sort({ date: -1, createdAt: -1 })
            .select('currentBalance');

        const previousBalance = lastMovement ? lastMovement.currentBalance : 0;
        let currentBalance;
        let type;
        let message = '';

        switch (operationType) {
            case 'ingreso':
                currentBalance = previousBalance + amount;
                type = 'income';
                message = 'Ingreso registrado exitosamente';
                break;

            case 'egreso':
                // Verificar si hay fondos suficientes
                if (previousBalance < amount) {
                    return res.status(400).json({
                        message: `Fondos insuficientes. Balance actual: ${previousBalance}, Cantidad solicitada: ${amount}`
                    });
                }
                
                currentBalance = previousBalance - amount;
                type = 'expense';
                message = 'Egreso registrado exitosamente';
                break;

            default:
                return res.status(400).json({
                    message: 'Tipo de operación no válido. Use: ingreso, egreso'
                });
        }

        // Crear nuevo movimiento
        const newMovement = new PettyCash({
            date: new Date(), // Siempre fecha del sistema
            employeeId: userType === 'admin' ? 'admin' : (employeeId || user),
            amount,
            reason,
            type,
            previousBalance,
            currentBalance
        });

        await newMovement.save();

        // Poblar el empleado solo si no es admin
        if (userType !== 'admin') {
            await newMovement.populate('employeeId', 'name email');
        }

        res.json({
            message,
            movement: newMovement
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default pettyCashController;