import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  return (
    <LinearGradient 
      colors={['#8D6CFF', '#FFBAE7']} 
      style={styles.container}
    >
      {/* AGREGAR IMAGEN DE FONDO: Textura de helados rosados/morados */}
      <ImageBackground 
        source={require('../assets/splash-background.png')} // REEMPLAZAR con tu imagen
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          {/* Logo Container */}
          <View style={styles.logoContainer}>
            {/* AGREGAR LOGO: Logo circular de Moon's */}
            <Image 
              source={require('../assets/logo.png')} // REEMPLAZAR con tu logo
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.primaryButtonText}>Iniciar Sesion</Text>
            </TouchableOpacity>

            <Text style={styles.questionText}>¿No tienes una cuenta? Regístrate</Text>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Register1')}
            >
              <Text style={styles.secondaryButtonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </LinearGradient>
  );
}