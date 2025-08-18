import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useOrders } from '../../hooks/OrdersHook/useOrder';
import ActiveOrderCard from '../../components/Cards/ActiveOrderCard';

const ActiveOrdersScreen = () => {
  const { authToken } = useAuth();
  const navigation = useNavigation();
  const {
    activeOrders,
    loading,
    error,
    updateOrderStatus,
    updatePaymentStatus,
    clearError
  } = useOrders();

  // Verificar autenticación
  useEffect(() => {
    if (!authToken) {
      navigation.navigate('Login');
    }
  }, [authToken, navigation]);

  if (!authToken) {
    return null;
  }

  // Función para manejar actualización de estado
  const handleUpdateStatus = async (orderId, newStatus) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      Alert.alert('Estado Actualizado', 'El estado de la orden se actualizó correctamente');
    }
  };

  // Función para manejar actualización de pago
  const handleUpdatePayment = async (orderId, newPaymentStatus) => {
    const success = await updatePaymentStatus(orderId, newPaymentStatus);
    if (success) {
      Alert.alert('Pago Actualizado', 'El estado de pago se actualizó correctamente');
    }
  };

  // Función para mostrar detalles de orden
  const handleViewDetails = (order) => {
    const productsList = order.products?.map(p => 
      `• ${p.productId?.name || 'Producto'} (x${p.quantity})`
    ).join('\n') || 'Sin productos';

    Alert.alert(
      'Detalles de la Orden',
      `Cliente: ${order.customerName || order.customerId?.name || 'Sin nombre'}
Teléfono: ${order.customerPhone || order.customerId?.phone || 'No disponible'}
Estado: ${order.orderStatus}
Tipo: ${order.orderType === 'delivery' ? 'Delivery' : 'Local'}
${order.orderType === 'delivery' && order.deliveryAddress ? `Dirección: ${order.deliveryAddress}` : ''}
Total: $${order.totalAmount}
Pago: ${order.paymentStatus}
Método: ${order.paymentMethod}

Productos:
${productsList}`,
      [{ text: 'OK' }]
    );
  };

  // Calcular tiempo estimado basado en estado y tipo
  const getEstimatedTime = (order) => {
    if (order.orderStatus === 'entregado' || order.orderStatus === 'cancelado') {
      return 'Finalizado';
    }
    
    const baseTime = order.orderType === 'delivery' ? 30 : 15;
    const statusMultiplier = {
      'pendiente': 1,
      'en preparación': 0.7,
      'en camino': 0.3
    };
    
    const multiplier = statusMultiplier[order.orderStatus] || 1;
    const estimatedMinutes = Math.ceil(baseTime * multiplier);
    
    return `${estimatedMinutes}-${estimatedMinutes + 10} mins`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Pedidos Activos</Text>
        <Text style={styles.headerSubtitle}>
          {activeOrders.length} órdenes en proceso
        </Text>
      </View>

      {/* Content */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={clearError}>
            <Text style={styles.retryButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8D6CFF" />
          <Text style={styles.loadingText}>Cargando órdenes activas...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {activeOrders.length > 0 ? (
            activeOrders.map((order) => (
              <ActiveOrderCard 
                key={order._id} 
                order={{
                  ...order,
                  estimatedTime: getEstimatedTime(order)
                }}
                onUpdateStatus={handleUpdateStatus}
                onUpdatePayment={handleUpdatePayment}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle-outline" size={64} color="#28A745" />
              <Text style={styles.emptyText}>¡No hay órdenes activas!</Text>
              <Text style={styles.emptySubtext}>
                Todas las órdenes han sido completadas
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8D6CFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#8D6CFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8D6CFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#28A745',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ActiveOrdersScreen;