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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();
  const { authToken, isLoading } = useAuth();
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Iniciar animaciones
    startAnimations();
    
    // Crear timer pero no navegar automáticamente
    const timer = setTimeout(() => {
      // Solo navegar si no está autenticado y no está cargando
      if (!isLoading && !authToken) {
        navigation.replace('FirstHomePage');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, authToken, isLoading]);

  // Efecto separado para manejar la navegación cuando cambia el estado de auth
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (authToken) {
          // Usuario autenticado, ir a MainTabs
          navigation.replace('MainTabs');
        } else {
          // Usuario no autenticado, ir a FirstHomePage
          navigation.replace('FirstHomePage');
        }
      }, 2000); // Tiempo mínimo para mostrar splash

      return () => clearTimeout(timer);
    }
  }, [authToken, isLoading, navigation]);

  const startAnimations = () => {
    // Animación en paralelo
    Animated.parallel([
      // Fade in del contenido
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Escala del logo
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Slide up del texto
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
          {/* Logo/Icono */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Ionicons name="restaurant" size={60} color="#8D6CFF" />
            </View>
            
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
                { transform: [{ scale: scaleAnim }] }
              ]} 
            />
          </View>

          {/* Texto principal */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.appName}>Moon's ice cream rolls</Text>
            <Text style={styles.slogan}>Gestión de órdenes para empleados</Text>
          </Animated.View>

          {/* Indicador de carga */}
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.loadingBar}>
              <Animated.View 
                style={[
                  styles.loadingProgress,
                  {
                    transform: [{ scaleX: scaleAnim }]
                  }
                ]} 
              />
            </View>
            <Text style={styles.loadingText}>
              {isLoading ? 'Verificando sesión...' : 'Cargando...'}
            </Text>
          </Animated.View>
        </Animated.View>

        {/* Elementos decorativos de fondo */}
        <View style={styles.decorativeElements}>
          <Animated.View 
            style={[
              styles.floatingElement,
              styles.element1,
              {
                opacity: fadeAnim,
                transform: [
                  { rotate: '45deg' },
                  { scale: scaleAnim }
                ]
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.floatingElement,
              styles.element2,
              {
                opacity: fadeAnim,
                transform: [
                  { rotate: '-30deg' },
                  { scale: scaleAnim }
                ]
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.floatingElement,
              styles.element3,
              {
                opacity: fadeAnim,
                transform: [
                  { rotate: '60deg' },
                  { scale: scaleAnim }
                ]
              }
            ]} 
          />
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
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  circle: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 100,
  },
  circle1: {
    width: 150,
    height: 150,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    top: -15,
    left: -15,
  },
  circle2: {
    width: 180,
    height: 180,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    top: -30,
    left: -30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  slogan: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '300',
  },
  loadingContainer: {
    alignItems: 'center',
    width: 200,
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingProgress: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    transformOrigin: 'left',
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '300',
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingElement: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  element1: {
    width: 60,
    height: 60,
    top: height * 0.2,
    left: width * 0.1,
  },
  element2: {
    width: 40,
    height: 40,
    top: height * 0.15,
    right: width * 0.15,
  },
  element3: {
    width: 50,
    height: 50,
    bottom: height * 0.2,
    left: width * 0.2,
  },
});

export default SplashScreen;