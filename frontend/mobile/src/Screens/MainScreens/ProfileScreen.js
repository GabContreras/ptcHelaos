import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout, isLoading } = useAuth();

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

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              // La navegación será automática por el cambio de authToken
            } catch (error) {
              console.error('Error durante el logout:', error);
              Alert.alert('Error', 'Hubo un problema al cerrar sesión');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#8D6CFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8D6CFF" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8D6CFF" />
      
      <ScrollView style={styles.scrollView}>
        {/* Header with Profile */}
        <LinearGradient
          colors={['#8D6CFF', '#B9B8FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.profileIconLarge}>
            <Ionicons name="person-circle-outline" size={80} color="#FFFFFF" />
          </View>
          
          <Text style={styles.profileName}>{getDisplayName()}</Text>
          
          <View style={styles.profileDetails}>
            <Text style={styles.profileDetail}>
              Rol: {user?.userType === 'admin' ? 'Administrador' : 'Empleado'}
            </Text>
            <Text style={styles.profileDetail}>
              Email: {user?.email || 'No disponible'}
            </Text>
          </View>
        </LinearGradient>

        {/* Profile Information */}
        <View style={styles.content}>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Información del Usuario:</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>
                Tipo: {user?.userType === 'admin' ? 'Administrador' : 'Empleado'}
              </Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Correo:</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>
                {user?.email || 'No disponible'}
              </Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>ID de Usuario:</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>
                {user?.id || 'No disponible'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FF4757" />
              ) : (
                <>
                  <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
                    Cerrar Sesión
                  </Text>
                  <Ionicons name="log-out-outline" size={20} color="#FF4757" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileIconLarge: {
    marginBottom: 15,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  profileDetails: {
    alignItems: 'center',
  },
  profileDetail: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginVertical: 2,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoSection: {
    marginBottom: 25,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  infoRow: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#666666',
  },
  actionsContainer: {
    marginTop: 30,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  logoutButton: {
    borderColor: '#FF4757',
    borderWidth: 1,
  },
  logoutButtonText: {
    color: '#FF4757',
  },
});

export default ProfileScreen;