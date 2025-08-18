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
import ActiveOrderCard from '../../components/Cards/ActiveOrderCard';

const ActiveOrdersScreen = () => {
  // Datos quemados - REEMPLAZAR CON API CALLS
  const activeOrders = [
    {
      id: 1,
      clientName: 'NombreCliente',
      description: 'Lorem ipsum dolor sit amet, consectetur leptumnis...more',
      estimatedTime: '10-15 mins',
      image: 'https://via.placeholder.com/80x60/8D6CFF/FFFFFF?text=Map',
    },
    {
      id: 2,
      clientName: 'NombreCliente',
      description: 'Lorem ipsum dolor sit amet, consectetur leptumnis...more',
      estimatedTime: '20-35 mins',
      image: 'https://via.placeholder.com/80x60/8D6CFF/FFFFFF?text=Map',
    },
    {
      id: 3,
      clientName: 'NombreCliente',
      description: 'Lorem ipsum dolor sit amet, consectetur leptumnis...more',
      estimatedTime: '15-25 mins',
      image: 'https://via.placeholder.com/80x60/8D6CFF/FFFFFF?text=Map',
    },
    {
      id: 4,
      clientName: 'NombreCliente',
      description: 'Lorem ipsum dolor sit amet, consectetur leptumnis...more',
      estimatedTime: '30-45 mins',
      image: 'https://via.placeholder.com/80x60/8D6CFF/FFFFFF?text=Map',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8D6CFF" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Pedidos Activos</Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {activeOrders.map((order) => (
          <ActiveOrderCard key={order.id} order={order} />
        ))}
      </ScrollView>
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
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8D6CFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default ActiveOrdersScreen;