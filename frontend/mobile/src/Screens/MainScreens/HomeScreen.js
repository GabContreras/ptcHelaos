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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useOrders } from '../../hooks/OrdersHook/useOrder.js';
import OrderCard from '../../components/Cards/orderCard.js';

const HomeScreen = () => {
  const { user, authToken } = useAuth();
  const navigation = useNavigation();
  const {
    orders,
    loading,
    error,
    updateOrderStatus,
    clearError
  } = useOrders();

  console.log('HomeScreen - Orders count:', orders.length);
  console.log('HomeScreen - Loading:', loading);
  console.log('HomeScreen - Error:', error);

  // Verificar autenticación al cargar la pantalla
  useEffect(() => {
    if (!authToken) {
      navigation.navigate('Login');
    }
  }, [authToken, navigation]);

  // Si no hay token, no mostrar el contenido
  if (!authToken) {
    return null;
  }

  // Función para obtener el nombre a mostrar
  const getDisplayName = () => {
    if (!user) return 'Usuario';

    if (user.name && user.name !== user.email) return user.name;

    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    return 'Usuario';
  };

  // Función para manejar actualización de estado
  const handleUpdateStatus = async (orderId, newStatus) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      Alert.alert('Estado Actualizado', 'El estado de la orden se actualizó correctamente');
    }
  };

  // Función para mostrar detalles de orden
  const handleViewDetails = (order) => {
    Alert.alert(
      'Detalles de la Orden',
      `Cliente: ${order.customerName || order.customerId?.name || 'Sin nombre'}
Estado: ${order.orderStatus}
Tipo: ${order.orderType}
Total: ${order.totalAmount}
Pago: ${order.paymentStatus}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8D6CFF" />
      
      {/* Header */}
      <LinearGradient
        colors={['#8D6CFF', '#B9B8FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Pagina Principal</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{getDisplayName()}</Text>
          <Text style={styles.userRole}>
            {user?.userType === 'admin' ? 'Administrador' : 'Empleado'}
          </Text>
        </View>
        <View style={styles.profileIcon}>
          <Ionicons name="person-circle-outline" size={40} color="#FFFFFF" />
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Todas las Órdenes</Text>
        
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={clearError}>
              <Text style={styles.retryButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        ) : loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8D6CFF" />
            <Text style={styles.loadingText}>Cargando órdenes...</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.ordersList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderCard 
                  key={order._id} 
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={64} color="#CCCCCC" />
                <Text style={styles.emptyText}>No hay órdenes disponibles</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  userInfo: {
    alignItems: 'center',
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userRole: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  profileIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8D6CFF',
    marginBottom: 20,
  },
  ordersList: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#8D6CFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
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
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;