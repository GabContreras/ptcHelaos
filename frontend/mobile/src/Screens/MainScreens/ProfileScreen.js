import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleChangePassword = () => {
    // Navegar a la pantalla de cambiar contraseña
    navigation.navigate('ForgotPassword1');
  };

  const handleLogout = () => {
    // Navegar a la pantalla de bienvenida
    navigation.navigate('Welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8D6CFF" />
      
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
        
        <Text style={styles.profileName}>NombreCuenta</Text>
        
        <View style={styles.profileDetails}>
          <Text style={styles.profileDetail}>Se creó en: XX/XX/XX</Text>
          <Text style={styles.profileDetail}>Hace: XXX D/M/Y</Text>
        </View>
      </LinearGradient>

      {/* Profile Information */}
      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Correo:</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>moonsicecream@gmail.com</Text>
            <TouchableOpacity style={styles.changeButton}>
              <Text style={styles.changeButtonText}>Cambiar correo</Text>
              <Ionicons name="chevron-forward" size={16} color="#8D6CFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Número de teléfono:</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>111-1111</Text>
            <TouchableOpacity style={styles.changeButton}>
              <Text style={styles.changeButtonText}>Cambiar número</Text>
              <Ionicons name="chevron-forward" size={16} color="#8D6CFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.actionButtonText}>Cambiar Contraseña</Text>
            <Ionicons name="chevron-forward" size={20} color="#8D6CFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
              Cerrar Sesión
            </Text>
            <Ionicons name="log-out-outline" size={20} color="#FF4757" />
          </TouchableOpacity>
        </View>
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
  },
  profileDetails: {
    alignItems: 'center',
  },
  profileDetail: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginVertical: 2,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flex: 1,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeButtonText: {
    fontSize: 14,
    color: '#8D6CFF',
    fontWeight: '500',
    marginRight: 5,
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