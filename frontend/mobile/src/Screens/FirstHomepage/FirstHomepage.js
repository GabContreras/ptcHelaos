import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
;

const FirstHomepage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFEDF9', '#8D6CFF', '#4429A2']}
        style={styles.gradient}
      >
        {/* TODO: Agregar imagen de fondo de nubes/textura */}
        <View style={styles.content}>
          
          {/* Logo Container */}
          <View style={styles.logoContainer}>
            {/* TODO: Reemplazar con tu logo de Moon's */}
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>MOON'S</Text>
              <Text style={styles.logoSubtext}>Cupcakes</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.primaryButtonText}>Iniciar Sesion</Text>
            </TouchableOpacity>

            <Text style={styles.accountText}>¿No tienes una cuenta? Registrate</Text>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Register1')}
            >
              <Text style={styles.secondaryButtonText}>Registrarse</Text>
            </TouchableOpacity>

          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 120,
  },
  logoPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  logoSubtext: {
    fontSize: 12,
    color: '#4A90E2',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  primaryButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#8D6CFF',
    fontSize: 20,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 150,

    //sombra de debajo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryButtonText: {
    color: '#8D6CFF',
    fontSize: 20,
    fontWeight: '600',
  },
  accountText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    margin: 5,
  },
  formContainer: {
    flex: 1,
    paddingTop: 20,
  },
  formTitle: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordInput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    paddingRight: 50,
    borderRadius: 25,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  forgotText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: '#8B5FBF',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    color: '#9C27B0',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  registerButtonText: {
    color: '#9C27B0',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    padding: 5,
  },
});

export default FirstHomepage;
