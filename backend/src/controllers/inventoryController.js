import Inventory from '../models/Inventory.js';
import Batch from '../models/Batches.js';

const inventoryController = {};

// GET - Obtener todos los inventarios con sus lotes
inventoryController.getInventory = async (req, res) => {
    try {
        const inventories = await Inventory.find()
            .populate('categoryId', 'name')
            .populate('batchId');
        res.json(inventories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - Obtener todos los lotes
inventoryController.getAllBatches = async (req, res) => {
    try {
        const batches = await Batch.find();
        
        // Populate selectivo para movements.employeeId
        for (let batch of batches) {
            for (let movement of batch.movements) {
                if (movement.employeeId !== 'admin' && typeof movement.employeeId === 'object') {
                    await batch.populate('movements.employeeId', 'name email');
                }
            }
        }
        
        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - Obtener inventario específico con sus lotes
inventoryController.getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id)
            .populate('categoryId', 'name')
            .populate('batchId');
        if (!inventory) {
            return res.status(404).json({ message: 'Inventario no encontrado' });
        }

        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST - Crear nuevo inventario
inventoryController.createInventory = async (req, res) => {
    try {
        const { name, categoryId, supplier, extraPrice, unitType, description } = req.body;

        // Verificar si ya existe un inventario con el mismo nombre
        const existingInventory = await Inventory.findOne({ name });
        if (existingInventory) {
            return res.status(400).json({
                message: 'Ya existe un inventario con ese nombre',
                isExisting: true
            });
        }

        // Crear nuevo inventario
        const newInventory = new Inventory({
            name,
            categoryId,
            supplier,
            extraPrice,
            unitType,
            description,
            batchId: [],
            currentStock: 0
        });

        await newInventory.save();
        res.json({
            message: 'Inventario creado exitosamente',
            inventory: newInventory,
            isExisting: false
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST - Crear nuevo lote para un inventario
inventoryController.createBatch = async (req, res) => {
    try {
        const inventoryId = req.params.id;
        const { quantity, expirationDate, purchaseDate, notes, reason } = req.body;
        const { userType, user } = req.user; // Viene del middleware de autenticación

        // Verificar que el inventario existe
        const inventory = await Inventory.findById(inventoryId);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventario no encontrado' });
        }

        // Crear nuevo lote
        const newBatch = new Batch({
            quantity,
            expirationDate,
            purchaseDate: purchaseDate || new Date(),
            notes,
            movements: [{
                type: 'entrada',
                quantity,
                reason: reason || 'Lote inicial',
                employeeId: userType === 'admin' ? 'admin' : user
            }]
        });

        await newBatch.save();

        // Agregar el lote al inventario
        inventory.batchId.push(newBatch._id);
        inventory.currentStock += quantity;
        await inventory.save();

        res.json({
            message: 'Lote creado exitosamente',
            batch: newBatch
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT - Actualizar inventario básico
inventoryController.updateInventory = async (req, res) => {
    try {
        const { name, categoryId, supplier, extraPrice, unitType, description } = req.body;

        const updatedInventory = await Inventory.findByIdAndUpdate(
            req.params.id,
            { name, categoryId, supplier, extraPrice, unitType, description },
            { new: true }
        );

        if (!updatedInventory) {
            return res.status(404).json({ message: 'Inventario no encontrado' });
        }

        res.json({
            message: 'Inventario actualizado exitosamente',
            inventory: updatedInventory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT - Operación unificada para lotes
inventoryController.batchOperation = async (req, res) => {
    try {
        const { batchId } = req.params;
        const { operationType, quantity, reason } = req.body;
        const { userType, user } = req.user; // Viene del middleware de autenticación

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        // Encontrar el inventario que contiene este lote
        const inventory = await Inventory.findOne({ batchId: batchId });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventario asociado no encontrado' });
        }

        let message = '';

        switch (operationType) {
            case 'salida':
                if (!quantity || quantity <= 0) {
                    return res.status(400).json({ message: 'La cantidad debe ser mayor a 0' });
                }

                if (batch.quantity < quantity) {
                    return res.status(400).json({
                        message: `Cantidad insuficiente. Disponible: ${batch.quantity}, Solicitado: ${quantity}`
                    });
                }

                // Actualizar lote
                batch.quantity -= quantity;

                if (batch.quantity === 0) {
                    batch.status = 'Agotado';
                    batch.completedDate = new Date();
                }

                // Agregar movimiento de SALIDA
                batch.movements.push({
                    type: 'salida',
                    quantity,
                    reason: reason || 'Consumo',
                    employeeId: userType === 'admin' ? 'admin' : user
                });

                await batch.save();
                inventory.currentStock -= quantity;
                await inventory.save();

                message = 'Salida registrada exitosamente';
                break;

            case 'entrada':
                if (!quantity || quantity <= 0) {
                    return res.status(400).json({ message: 'La cantidad debe ser mayor a 0' });
                }

                // Actualizar lote
                batch.quantity += quantity;

                if (batch.status === 'Agotado') {
                    batch.status = 'En uso';
                    batch.completedDate = null;
                }

                // Agregar movimiento de ENTRADA
                batch.movements.push({
                    type: 'entrada',
                    quantity,
                    reason: reason || 'Ingreso adicional',
                    employeeId: userType === 'admin' ? 'admin' : user
                });

                await batch.save();
                inventory.currentStock += quantity;
                await inventory.save();

                message = 'Entrada registrada exitosamente';
                break;

            case 'daño':
                if (!quantity || quantity <= 0) {
                    return res.status(400).json({ message: 'La cantidad dañada debe ser mayor a 0' });
                }

                if (batch.quantity < quantity) {
                    return res.status(400).json({
                        message: `Cantidad insuficiente. Disponible: ${batch.quantity}, A dañar: ${quantity}`
                    });
                }

                // Actualizar lote
                batch.quantity -= quantity;

                if (batch.quantity === 0) {
                    batch.status = 'Agotado';
                    batch.completedDate = new Date();
                }

                // Agregar movimiento de DAÑO
                batch.movements.push({
                    type: 'daño',
                    quantity,
                    reason: reason || 'Producto dañado',
                    employeeId: userType === 'admin' ? 'admin' : user
                });

                await batch.save();
                inventory.currentStock -= quantity;
                await inventory.save();

                message = 'Daño registrado exitosamente';
                break;

            default:
                return res.status(400).json({
                    message: 'Tipo de operación no válido. Use: entrada, salida, daño'
                });
        }

        res.json({
            message,
            batch: batch
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - Obtener historial de movimientos de un lote
inventoryController.getBatchMovements = async (req, res) => {
    try {
        const { batchId } = req.params;

        const batch = await Batch.findById(batchId);

        if (!batch) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        // Populate selectivo para movements.employeeId
        for (let movement of batch.movements) {
            if (movement.employeeId !== 'admin' && typeof movement.employeeId === 'object') {
                await batch.populate('movements.employeeId', 'name email');
            }
        }

        res.json(batch.movements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE - Eliminar inventario (solo si no tiene lotes activos)
inventoryController.deleteInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventario no encontrado' });
        }

        // Verificar que no tenga lotes activos
        const activeBatches = await Batch.find({
            _id: { $in: inventory.batchId },
            status: 'En uso',
            quantity: { $gt: 0 }
        });

        if (activeBatches.length > 0) {
            return res.status(400).json({
                message: 'No se puede eliminar el inventario porque tiene lotes activos'
            });
        }

        // Eliminar todos los lotes asociados
        await Batch.deleteMany({ _id: { $in: inventory.batchId } });

        // Eliminar el inventario
        await Inventory.findByIdAndDelete(req.params.id);

        res.json({ message: 'Inventario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE - Eliminar lote específico
inventoryController.deleteBatch = async (req, res) => {
    try {
        const { batchId } = req.params;

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        // Verificar que el lote esté agotado o vencido
        if (batch.status === 'En uso' && batch.quantity > 0) {
            return res.status(400).json({
                message: 'No se puede eliminar un lote que está en uso y tiene cantidad disponible'
            });
        }

        // Encontrar y actualizar el inventario
        const inventory = await Inventory.findOne({ batchId: batchId });
        if (inventory) {
            inventory.batchId = inventory.batchId.filter(id => !id.equals(batchId));
            inventory.currentStock -= batch.quantity;
            await inventory.save();
        }

        // Eliminar el lote
        await Batch.findByIdAndDelete(batchId);

        res.json({ message: 'Lote eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default inventoryController;