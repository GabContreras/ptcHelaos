import React, { useState } from 'react';
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Texture from "../../../assets/images/Texture.png"
import { SvgXml } from 'react-native-svg';


const RegisterScreen2 = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
const miSvgXml = `
    <svg width="402" height="150" viewBox="0 0 402 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-0.249378 -25H401.751V150C401.751 150 387.251 122 337.751 114.5C288.251 107 278.251 134 216.251 134C154.251 134 166.751 89 99.7506 82.5C32.7506 76 29.7506 107.5 -11.2494 86.5C-52.2494 65.5 -0.249378 -25 -0.249378 -25Z" fill="url(#paint0_linear_468_379)"/>
    <defs>
    <linearGradient id="paint0_linear_468_379" x1="204" y1="36" x2="195" y2="165.5" gradientUnits="userSpaceOnUse">
    <stop stop-color="white"/>
    <stop offset="1" stop-color="#F8F8F8"/>
    </linearGradient>
    </defs>
    </svg>
  `;
  
  
  return (
    <SafeAreaView style={styles.container}>

    <Image 
            source={Texture}
            style={styles.backgroundImage}
            resizeMode="repeat"
          />

      <LinearGradient
        colors={['#2d16ffb4', '#ffa3dfcb']}
        style={styles.gradient}
      >

        <SvgXml xml={miSvgXml} width="100%" height="100%" style={styles.SVGs} />

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={32} color="#8D6CFF" />
          </TouchableOpacity>          
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>Contraseña:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña (6-12 caracteres mínimo)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Text style={styles.label}>Confirmar Contraseña:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <Text style={styles.label}>Direccion:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Direccion"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <Text style={styles.label}>Fecha de nacimiento:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="XX/XX/XX"
                value={birthDate}
                onChangeText={setBirthDate}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => {
                // TODO: Agregar lógica de registro
                console.log('Register completed');
                // Navegar de vuelta al login o pantalla principal
                navigation.navigate('Login');
              }}
            >
              <Text style={styles.registerButtonText}>Registrarse</Text>
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

    backgroundImage: {
    position: 'absolute', // para que quede detrás del contenido
    width: '100%',
    height: '100%',
  },
    SVGs: {
      position: 'absolute',
      top: -350,
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
      marginVertical: 60,
    },
    logoPlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
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
      borderRadius: 25,
      alignItems: 'center',
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    primaryButtonText: {
      color: '#8B5FBF',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: 'white',
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 25,
      alignItems: 'center',
      marginBottom: 15,
    },
    secondaryButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    accountText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 14,
    },
    formContainer: {
      flex: 1,
      paddingTop: 200,
    },
    formTitle: {
      fontSize: 24,
      color: 'white',
      textAlign: 'center',
      marginBottom: 30,
      fontWeight: '600',
    },
    label: {
      fontWeight: "600",
      color: 'white',
      fontSize: 16,
      marginBottom: 8,
      marginLeft: 15,
    },
    inputContainer: {
      marginBottom: 20,
    },
    input: {
      marginHorizontal: 15,
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 40,
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
      borderRadius: 40,
      alignItems: 'center',
      marginHorizontal: 80,
      marginTop: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    registerButtonText: {
      color: '#8D6CFF',
      fontSize: 20,
      fontWeight: '600',
    },
    backButton: {
      position: 'absolute',
      top: 43,
      left: 29,
      zIndex: 1,
      padding: 5,

      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  });

  export default RegisterScreen2;
