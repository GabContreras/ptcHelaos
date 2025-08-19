import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OrderCard = ({ order, onUpdateStatus, onViewDetails }) => {
  if (!order) {
    return null;
  }

  // Función para obtener el color y texto del estado
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
        return { color: '#FFA500', text: 'Pendiente' };
      case 'en_preparacion':
        return { color: '#2196F3', text: 'En Preparación' };
      case 'listo':
        return { color: '#4CAF50', text: 'Listo' };
      case 'en_camino':
        return { color: '#FF9800', text: 'En Camino' };
      case 'entregado':
        return { color: '#8BC34A', text: 'Entregado' };
      case 'cancelado':
        return { color: '#F44336', text: 'Cancelado' };
      default:
        return { color: '#757575', text: status || 'Sin estado' };
    }
  };

  // Función para obtener el color del estado de pago
  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pagado':
        return '#4CAF50';
      case 'pendiente':
        return '#FFA500';
      case 'cancelado':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const statusInfo = getStatusInfo(order.orderStatus);
  const paymentColor = getPaymentStatusColor(order.paymentStatus);

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onViewDetails && onViewDetails(order)}
    >
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          {/* Nombre del cliente */}
          <Text style={styles.customerName}>
            {order.customerName || 'Cliente sin nombre'}
          </Text>
          
          {/* Instrucciones especiales */}
          <Text style={styles.specialInstructions} numberOfLines={2}>
            {order.specialInstructions || 'Sin instrucciones especiales'}
          </Text>
          
          {/* Información adicional */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teléfono: </Text>
            <Text style={styles.infoText}>
              {order.customerPhone || 'No disponible'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo: </Text>
            <Text style={styles.infoText}>
              {order.orderType === 'local' ? 'Local' : 
               order.orderType === 'delivery' ? 'Entrega' : order.orderType}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total: </Text>
            <Text style={styles.totalAmount}>
              ${order.totalAmount || '0.00'}
            </Text>
          </View>
          
          {/* Estado de la orden */}
          <View style={styles.statusRow}>
            <View style={styles.orderStatus}>
              <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.text}
              </Text>
            </View>
            
            {/* Estado de pago */}
            <View style={styles.paymentStatus}>
              <Ionicons 
                name="card-outline" 
                size={12} 
                color={paymentColor} 
              />
              <Text style={[styles.paymentText, { color: paymentColor }]}>
                {order.paymentStatus || 'Sin estado'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.rightContent}>
          {/* Icono según el tipo de orden */}
          <View style={styles.imageContainer}>
            <Ionicons 
              name={order.orderType === 'delivery' ? 'bicycle-outline' : 'storefront-outline'} 
              size={24} 
              color="#8D6CFF" 
            />
          </View>
          
          {/* Botón de acción */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onViewDetails && onViewDetails(order)}
          >
            <Ionicons name="chevron-forward" size={20} color="#8D6CFF" />
          </TouchableOpacity>
          
          {/* Botón para cambiar estado (solo si no está entregado o cancelado) */}
          {!['entregado', 'cancelado'].includes(order.orderStatus?.toLowerCase()) && (
            <TouchableOpacity 
              style={styles.updateButton}
              onPress={() => {
                // Lógica simple para avanzar al siguiente estado
                let nextStatus = 'pendiente';
                switch (order.orderStatus?.toLowerCase()) {
                  case 'pendiente':
                    nextStatus = 'en_preparacion';
                    break;
                  case 'en_preparacion':
                    nextStatus = 'listo';
                    break;
                  case 'listo':
                    nextStatus = order.orderType === 'delivery' ? 'en_camino' : 'entregado';
                    break;
                  case 'en_camino':
                    nextStatus = 'entregado';
                    break;
                }
                onUpdateStatus && onUpdateStatus(order._id, nextStatus);
              }}
            >
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftContent: {
    flex: 1,
    marginRight: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  specialInstructions: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  infoText: {
    fontSize: 12,
    color: '#666666',
  },
  totalAmount: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paymentText: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightContent: {
    alignItems: 'center',
    gap: 8,
  },
  imageContainer: {
    width: 60,
    height: 45,
    backgroundColor: '#F0F0FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OrderCard;