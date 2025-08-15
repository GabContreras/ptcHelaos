import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import OrderCard from '../../components/orderCard.js';

const HomeScreen = () => {
  // Datos quemados - REEMPLAZAR CON API CALLS
  const orders = [
    {
      id: 1,
      clientName: 'NombreCliente',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      image: 'https://via.placeholder.com/80x60/8D6CFF/FFFFFF?text=Map',
    },
    {
      id: 2,
      clientName: 'NombreCliente',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      image: 'https://via.placeholder.com/80x60/8D6CFF/FFFFFF?text=Map',
    },
    {
      id: 3,
      clientName: 'NombreCliente',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      image: 'https://via.placeholder.com/80x60/8D6CFF/FFFFFF?text=Map',
    },
    {
      id: 4,
      clientName: 'NombreCliente',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      image: 'https://via.placeholder.com/80x60/8D6CFF/FFFFFF?text=Map',
    },
  ];

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
          <Text style={styles.userName}>Nombre usuario</Text>
          <Text style={styles.userRole}>Delivery</Text>
        </View>
        <View style={styles.profileIcon}>
          <Ionicons name="person-circle-outline" size={40} color="#FFFFFF" />
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Todos los Pedidos</Text>
        
        <ScrollView 
          style={styles.ordersList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ScrollView>
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
});

export default HomeScreen;