import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

const LoginLoadingScreen = () => {
  const { user, completeLogin } = useAuth();
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Iniciar animaciones
    startAnimations();
    
    // Completar el login después de la animación
    const timer = setTimeout(() => {
      completeLogin(); // Esto actualizará authToken y navegará automáticamente
    }, 2500); // 2.5 segundos de pantalla de carga

    return () => clearTimeout(timer);
  }, [completeLogin]);

  const startAnimations = () => {
    // Animaciones en secuencia
    Animated.sequence([
      // Fade in inicial
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Animaciones en paralelo
      Animated.parallel([
        // Escala del contenido
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        // Slide del texto
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        // Rotación del icono
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
        ),
        // Progreso de la barra
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  };

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

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8D6CFF" />
      
      <LinearGradient
        colors={['#8D6CFF', '#B9B8FF', '#E8E5FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Icono animado */}
          <View style={styles.iconContainer}>
            <Animated.View 
              style={[
                styles.iconBackground,
                {
                  transform: [{ rotate: spin }]
                }
              ]}
            >
              <Ionicons name="checkmark-circle" size={60} color="#8D6CFF" />
            </Animated.View>
            
            {/* Círculos decorativos */}
            <Animated.View 
              style={[
                styles.circle,
                styles.circle1,
                { transform: [{ scale: scaleAnim }] }
              ]} 
            />
            <Animated.View 
              style={[
                styles.circle,
                styles.circle2,
                { 
                  transform: [
                    { scale: scaleAnim },
                    { rotate: spin }
                  ] 
                }
              ]} 
            />
          </View>

          {/* Mensaje de bienvenida */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.welcomeText}>¡Bienvenido!</Text>
            <Text style={styles.userName}>{getDisplayName()}</Text>
            <Text style={styles.roleText}>
              {user?.userType === 'admin' ? 'Administrador' : 'Empleado'}
            </Text>
          </Animated.View>

          {/* Barra de progreso */}
          <Animated.View
            style={[
              styles.progressContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  {
                    width: progressWidth
                  }
                ]} 
              />
            </View>
            <Text style={styles.loadingText}>
              Configurando tu sesión...
            </Text>
          </Animated.View>

          {/* Elementos decorativos */}
          <Animated.View
            style={[
              styles.decorativeContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.companyText}>Moon's Ice Cream Rolls</Text>
            <Text style={styles.subtitleText}>Sistema de Gestión</Text>
          </Animated.View>
        </Animated.View>

        {/* Partículas flotantes */}
        <View style={styles.particlesContainer}>
          {[...Array(6)].map((_, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.particle,
                {
                  opacity: fadeAnim,
                  transform: [
                    { 
                      translateX: Math.sin(index) * 50 
                    },
                    { 
                      translateY: Math.cos(index) * 30 
                    },
                    { 
                      rotate: spin 
                    }
                  ]
                },
                {
                  top: height * (0.1 + (index * 0.15)),
                  left: width * (0.1 + (index % 2) * 0.8),
                }
              ]} 
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
    width: '80%',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  iconBackground: {
    width: 120,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  circle: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 100,
  },
  circle1: {
    width: 150,
    height: 150,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    top: -15,
    left: -15,
  },
  circle2: {
    width: 180,
    height: 180,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
    top: -30,
    left: -30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  roleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '400',
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
    textAlign: 'center',
  },
  decorativeContainer: {
    alignItems: 'center',
  },
  companyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
});

export default LoginLoadingScreen;