// Importaciones de modelos necesarios
import Inventory from '../models/Inventory.js';
import Batch from '../models/Batches.js';

const inventoryController = {};

// CONTROLADOR PARA OBTENER TODOS LOS INVENTARIOS CON SUS LOTES
inventoryController.getInventory = async (req, res) => {
    try {
        // Buscar todos los inventarios y hacer populate de categoría y lotes
        const inventories = await Inventory.find()
            .populate('categoryId', 'name')    // Popular solo el nombre de la categoría
            .populate('batchId');              // Popular todos los datos de los lotes
        
        res.json(inventories);
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: error.message });
    }
};

// CONTROLADOR PARA OBTENER TODOS LOS LOTES CON INFORMACIÓN DE EMPLEADOS
inventoryController.getAllBatches = async (req, res) => {
    try {
        // Buscar todos los lotes
        const batches = await Batch.find();
        
        // POPULATE SELECTIVO PARA MOVEMENTS.EMPLOYEEID
        // Recorrer cada lote para hacer populate solo cuando sea necesario
        for (let batch of batches) {
            for (let movement of batch.movements) {
                // Solo hacer populate si NO es admin y es un ObjectId válido
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

// CONTROLADOR PARA OBTENER UN INVENTARIO ESPECÍFICO POR ID
inventoryController.getInventoryById = async (req, res) => {
    try {
        // Buscar inventario por ID y hacer populate de categoría y lotes
        const inventory = await Inventory.findById(req.params.id)
            .populate('categoryId', 'name')
            .populate('batchId');
            
        // Verificar si el inventario existe
        if (!inventory) {
            return res.status(404).json({ message: 'Inventario no encontrado' });
        }

        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CONTROLADOR PARA CREAR UN NUEVO INVENTARIO
inventoryController.createInventory = async (req, res) => {
    try {
        // Extraer datos del inventario del cuerpo de la petición
        const { name, categoryId, supplier, extraPrice, unitType, description } = req.body;

        // VERIFICAR SI YA EXISTE UN INVENTARIO CON EL MISMO NOMBRE
        const existingInventory = await Inventory.findOne({ name });
        if (existingInventory) {
            return res.status(400).json({
                message: 'Ya existe un inventario con ese nombre',
                isExisting: true
            });
        }

        // CREAR NUEVO INVENTARIO CON VALORES INICIALES
        const newInventory = new Inventory({
            name,
            categoryId,
            supplier,
            extraPrice,
            unitType,
            description,
            batchId: [],        // Array vacío de lotes inicialmente
            currentStock: 0     // Stock inicial en 0
        });

        // Guardar el nuevo inventario en la base de datos
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

// CONTROLADOR PARA CREAR UN NUEVO LOTE PARA UN INVENTARIO ESPECÍFICO
inventoryController.createBatch = async (req, res) => {
    try {
        const inventoryId = req.params.id;
        const { quantity, expirationDate, purchaseDate, notes, reason } = req.body;
        // Obtener información del usuario autenticado del middleware
        const { userType, user } = req.user;

        // VERIFICAR QUE EL INVENTARIO EXISTE
        const inventory = await Inventory.findById(inventoryId);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventario no encontrado' });
        }

        // CREAR NUEVO LOTE CON MOVIMIENTO INICIAL
        const newBatch = new Batch({
            quantity,
            expirationDate,
            purchaseDate: purchaseDate || new Date(), // Fecha actual si no se proporciona
            notes,
            movements: [{
                type: 'entrada',
                quantity,
                reason: reason || 'Lote inicial',
                // Asignar 'admin' si es admin, sino el ID del usuario
                employeeId: userType === 'admin' ? 'admin' : user
            }]
        });

        // Guardar el nuevo lote
        await newBatch.save();

        // ACTUALIZAR EL INVENTARIO: agregar lote y actualizar stock
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

// CONTROLADOR PARA ACTUALIZAR INFORMACIÓN BÁSICA DEL INVENTARIO
inventoryController.updateInventory = async (req, res) => {
    try {
        // Extraer datos a actualizar
        const { name, categoryId, supplier, extraPrice, unitType, description } = req.body;

        // Actualizar inventario y devolver el documento actualizado
        const updatedInventory = await Inventory.findByIdAndUpdate(
            req.params.id,
            { name, categoryId, supplier, extraPrice, unitType, description },
            { new: true } // Devolver el documento actualizado
        );

        // Verificar si el inventario existe
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

// CONTROLADOR PARA OPERACIONES UNIFICADAS EN LOTES (ENTRADA, SALIDA, DAÑO)
inventoryController.batchOperation = async (req, res) => {
    try {
        const { batchId } = req.params;
        const { operationType, quantity, reason } = req.body;
        // Obtener información del usuario autenticado
        const { userType, user } = req.user;

        // BUSCAR EL LOTE
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        // ENCONTRAR EL INVENTARIO QUE CONTIENE ESTE LOTE
        const inventory = await Inventory.findOne({ batchId: batchId });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventario asociado no encontrado' });
        }

        let message = '';

        // SWITCH PARA MANEJAR DIFERENTES TIPOS DE OPERACIONES
        switch (operationType) {
            case 'salida':
                // VALIDAR CANTIDAD
                if (!quantity || quantity <= 0) {
                    return res.status(400).json({ message: 'La cantidad debe ser mayor a 0' });
                }

                // VERIFICAR STOCK DISPONIBLE
                if (batch.quantity < quantity) {
                    return res.status(400).json({
                        message: `Cantidad insuficiente. Disponible: ${batch.quantity}, Solicitado: ${quantity}`
                    });
                }

                // ACTUALIZAR LOTE: reducir cantidad
                batch.quantity -= quantity;

                // VERIFICAR SI EL LOTE SE AGOTÓ
                if (batch.quantity === 0) {
                    batch.status = 'Agotado';
                    batch.completedDate = new Date();
                }

                // AGREGAR MOVIMIENTO DE SALIDA AL HISTORIAL
                batch.movements.push({
                    type: 'salida',
                    quantity,
                    reason: reason || 'Consumo',
                    employeeId: userType === 'admin' ? 'admin' : user
                });

                // Guardar cambios en lote e inventario
                await batch.save();
                inventory.currentStock -= quantity;
                await inventory.save();

                message = 'Salida registrada exitosamente';
                break;

            case 'entrada':
                // VALIDAR CANTIDAD
                if (!quantity || quantity <= 0) {
                    return res.status(400).json({ message: 'La cantidad debe ser mayor a 0' });
                }

                // ACTUALIZAR LOTE: aumentar cantidad
                batch.quantity += quantity;

                // REACTIVAR LOTE SI ESTABA AGOTADO
                if (batch.status === 'Agotado') {
                    batch.status = 'En uso';
                    batch.completedDate = null;
                }

                // AGREGAR MOVIMIENTO DE ENTRADA AL HISTORIAL
                batch.movements.push({
                    type: 'entrada',
                    quantity,
                    reason: reason || 'Ingreso adicional',
                    employeeId: userType === 'admin' ? 'admin' : user
                });

                // Guardar cambios en lote e inventario
                await batch.save();
                inventory.currentStock += quantity;
                await inventory.save();

                message = 'Entrada registrada exitosamente';
                break;

            case 'daño':
                // VALIDAR CANTIDAD
                if (!quantity || quantity <= 0) {
                    return res.status(400).json({ message: 'La cantidad dañada debe ser mayor a 0' });
                }

                // VERIFICAR STOCK DISPONIBLE
                if (batch.quantity < quantity) {
                    return res.status(400).json({
                        message: `Cantidad insuficiente. Disponible: ${batch.quantity}, A dañar: ${quantity}`
                    });
                }

                // ACTUALIZAR LOTE: reducir cantidad por daño
                batch.quantity -= quantity;

                // VERIFICAR SI EL LOTE SE AGOTÓ
                if (batch.quantity === 0) {
                    batch.status = 'Agotado';
                    batch.completedDate = new Date();
                }

                // AGREGAR MOVIMIENTO DE DAÑO AL HISTORIAL
                batch.movements.push({
                    type: 'daño',
                    quantity,
                    reason: reason || 'Producto dañado',
                    employeeId: userType === 'admin' ? 'admin' : user
                });

                // Guardar cambios en lote e inventario
                await batch.save();
                inventory.currentStock -= quantity;
                await inventory.save();

                message = 'Daño registrado exitosamente';
                break;

            default:
                // TIPO DE OPERACIÓN NO VÁLIDO
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

// CONTROLADOR PARA OBTENER HISTORIAL DE MOVIMIENTOS DE UN LOTE
inventoryController.getBatchMovements = async (req, res) => {
    try {
        const { batchId } = req.params;

        // Buscar el lote por ID
        const batch = await Batch.findById(batchId);

        if (!batch) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        // POPULATE SELECTIVO PARA MOVEMENTS.EMPLOYEEID
        // Solo hacer populate cuando no sea 'admin' y sea un ObjectId
        for (let movement of batch.movements) {
            if (movement.employeeId !== 'admin' && typeof movement.employeeId === 'object') {
                await batch.populate('movements.employeeId', 'name email');
            }
        }

        // Devolver solo los movimientos del lote
        res.json(batch.movements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CONTROLADOR PARA ELIMINAR INVENTARIO (SOLO SI NO TIENE LOTES ACTIVOS)
inventoryController.deleteInventory = async (req, res) => {
    try {
        // Buscar el inventario a eliminar
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventario no encontrado' });
        }

        // VERIFICAR QUE NO TENGA LOTES ACTIVOS
        // Buscar lotes asociados que estén en uso y con cantidad mayor a 0
        const activeBatches = await Batch.find({
            _id: { $in: inventory.batchId },
            status: 'En uso',
            quantity: { $gt: 0 }
        });

        // NO PERMITIR ELIMINACIÓN SI HAY LOTES ACTIVOS
        if (activeBatches.length > 0) {
            return res.status(400).json({
                message: 'No se puede eliminar el inventario porque tiene lotes activos'
            });
        }

        // ELIMINAR TODOS LOS LOTES ASOCIADOS PRIMERO
        await Batch.deleteMany({ _id: { $in: inventory.batchId } });

        // ELIMINAR EL INVENTARIO
        await Inventory.findByIdAndDelete(req.params.id);

        res.json({ message: 'Inventario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CONTROLADOR PARA ELIMINAR UN LOTE ESPECÍFICO
inventoryController.deleteBatch = async (req, res) => {
    try {
        const { batchId } = req.params;

        // Buscar el lote a eliminar
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        // VERIFICAR QUE EL LOTE NO ESTÉ ACTIVO
        // Solo permitir eliminar lotes agotados o sin cantidad
        if (batch.status === 'En uso' && batch.quantity > 0) {
            return res.status(400).json({
                message: 'No se puede eliminar un lote que está en uso y tiene cantidad disponible'
            });
        }

        // ENCONTRAR Y ACTUALIZAR EL INVENTARIO ASOCIADO
        const inventory = await Inventory.findOne({ batchId: batchId });
        if (inventory) {
            // Remover el lote del array de batchId
            inventory.batchId = inventory.batchId.filter(id => !id.equals(batchId));
            // Ajustar el stock actual
            inventory.currentStock -= batch.quantity;
            await inventory.save();
        }

        // ELIMINAR EL LOTE
        await Batch.findByIdAndDelete(batchId);

        res.json({ message: 'Lote eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default inventoryController;