import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ActiveOrderCard = ({ order, onUpdateStatus, onUpdatePayment, onViewDetails }) => {
  if (!order) {
    return null;
  }

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    const colors = {
      'pendiente': '#FFA500',
      'en preparación': '#007AFF',
      'en camino': '#34C759',
      'entregado': '#28A745',
      'cancelado': '#FF3B30'
    };
    return colors[status] || '#666666';
  };

  // Función para obtener el ícono del estado
  const getStatusIcon = (status) => {
    const icons = {
      'pendiente': 'time-outline',
      'en preparación': 'restaurant-outline',
      'en camino': 'car-outline',
      'entregado': 'checkmark-circle-outline',
      'cancelado': 'close-circle-outline'
    };
    return icons[status] || 'help-outline';
  };

  // Obtener nombre del cliente
  const getClientName = () => {
    if (order.customerId && order.customerId.name) {
      return order.customerId.name;
    }
    return order.customerName || 'Cliente sin nombre';
  };

  // Calcular total de productos
  const getTotalProducts = () => {
    if (!order.products || !Array.isArray(order.products)) return 0;
    return order.products.reduce((total, product) => total + (product.quantity || 0), 0);
  };

  // Obtener descripción de productos
  const getProductsDescription = () => {
    if (!order.products || !Array.isArray(order.products)) {
      return 'Sin productos especificados';
    }
    
    const firstProduct = order.products[0];
    const productName = firstProduct?.productId?.name || 'Producto';
    const totalProducts = getTotalProducts();
    
    if (order.products.length === 1) {
      return `${productName} (x${firstProduct.quantity})`;
    } else {
      return `${productName} y ${order.products.length - 1} más (${totalProducts} total)`;
    }
  };

  // Función para manejar acciones rápidas
  const handleQuickAction = () => {
    const currentStatus = order.orderStatus;
    
    if (currentStatus === 'pendiente') {
      Alert.alert(
        "Iniciar Preparación",
        "¿Cambiar estado a 'En Preparación'?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Confirmar",
            onPress: () => onUpdateStatus && onUpdateStatus(order._id, 'en preparación')
          }
        ]
      );
    } else if (currentStatus === 'en preparación') {
      const nextStatus = order.orderType === 'delivery' ? 'en camino' : 'entregado';
      const nextStatusText = order.orderType === 'delivery' ? 'En Camino' : 'Entregado';
      
      Alert.alert(
        `Marcar como ${nextStatusText}`,
        `¿Cambiar estado a '${nextStatusText}'?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Confirmar",
            onPress: () => onUpdateStatus && onUpdateStatus(order._id, nextStatus)
          }
        ]
      );
    } else if (currentStatus === 'en camino') {
      Alert.alert(
        "Marcar como Entregado",
        "¿Confirmar que la orden fue entregada?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Confirmar",
            onPress: () => onUpdateStatus && onUpdateStatus(order._id, 'entregado')
          }
        ]
      );
    }
  };

  // Función para manejar pago
  const handlePaymentAction = () => {
    if (order.paymentStatus === 'pendiente') {
      Alert.alert(
        "Actualizar Pago",
        "¿Marcar como pagado?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Confirmar",
            onPress: () => onUpdatePayment && onUpdatePayment(order._id, 'pagado')
          }
        ]
      );
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.7}
      onPress={() => onViewDetails && onViewDetails(order)}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <View style={styles.headerRow}>
            <Text style={styles.clientName}>{getClientName()}</Text>
            <View style={[styles.typeTag, { 
              backgroundColor: order.orderType === 'delivery' ? '#007AFF' : '#34C759' 
            }]}>
              <Text style={styles.typeText}>
                {order.orderType === 'delivery' ? 'Delivery' : 'Local'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.description} numberOfLines={2}>
            {getProductsDescription()}
          </Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.estimatedTime}>
              Tiempo estimado: {order.estimatedTime || '15-20 mins'}
            </Text>
            <Text style={styles.totalAmount}>
              ${order.totalAmount?.toFixed(2) || '0.00'}
            </Text>
          </View>
          
          <View style={styles.statusRow}>
            <View style={styles.statusContainer}>
              <Ionicons 
                name={getStatusIcon(order.orderStatus)} 
                size={16} 
                color={getStatusColor(order.orderStatus)} 
              />
              <Text style={[styles.statusText, { color: getStatusColor(order.orderStatus) }]}>
                {order.orderStatus || 'Sin estado'}
              </Text>
            </View>
            
            {order.paymentStatus === 'pendiente' && (
              <TouchableOpacity 
                style={styles.paymentButton} 
                onPress={handlePaymentAction}
              >
                <Text style={styles.paymentButtonText}>Marcar Pagado</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.rightContent}>
          {['pendiente', 'en preparación', 'en camino'].includes(order.orderStatus) && (
            <TouchableOpacity style={styles.actionButton} onPress={handleQuickAction}>
              <Ionicons 
                name={order.orderStatus === 'pendiente' ? 'play' : 'checkmark'} 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.detailsButton} onPress={() => onViewDetails && onViewDetails(order)}>
            <Ionicons name="information-circle-outline" size={20} color="#8D6CFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'flex-start',
  },
  leftContent: {
    flex: 1,
    marginRight: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  estimatedTime: {
    fontSize: 12,
    color: '#8D6CFF',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  paymentButton: {
    backgroundColor: '#28A745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paymentButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rightContent: {
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8D6CFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ActiveOrderCard;