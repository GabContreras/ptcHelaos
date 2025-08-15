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
<path d="M1.32598 -25H427V150C427 150 411.646 122 359.231 114.5C306.816 107 296.227 134 230.576 134C164.925 134 178.161 89 107.215 82.5C36.2694 76 33.0927 107.5 -10.3218 86.5C-53.7363 65.5 1.32598 -25 1.32598 -25Z" fill="url(#paint0_linear_468_371)"/>
<defs>
<linearGradient id="paint0_linear_468_371" x1="229" y1="-42.5" x2="209.722" y2="165.653" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFBAE7"/>
<stop offset="1" stop-color="#7B5AEF"/>
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
        colors={['#fffffff6', '#f5eee267']}
        style={styles.gradient}
      >

        <SvgXml xml={miSvgXml} width="100%" height="100%" style={styles.SVGs} />

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={32} color="#ffffffff" />
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
              onPress={() => {
                // TODO: Agregar lógica de registro
                console.log('Register completed');
                // Navegar de vuelta al login o pantalla principal
                navigation.navigate('Login');
              }}
            >
             <LinearGradient
                                       colors={['#B9B8FF', '#8D6CFF']} // colores degradado
                                       start={{ x: 0, y: 0.5 }}
                                       end={{ x: 1, y: 0.5 }}
                                       style={styles.nextButton}
                                     ><Text style={styles.nextButtonText}>Registrarse</Text>
                           </LinearGradient>
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
      color: '#8D6CFF',
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
      backgroundColor: '#8B5FBF',
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
    nextButtonText: {
      color: '#ffffffff',
      fontSize: 20,
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
