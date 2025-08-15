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
import { LinearGradient } from 'expo-linear-gradient';;
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoginIceCream from "../../../assets/images/LoginIceCream.png"
import { SvgXml } from 'react-native-svg';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const miSvgXml = `
   <svg width="448" height="361" viewBox="0 0 448 361" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 33.3C6 33.3 -3 10.3 43 1.30005C89 -7.69995 143.5 32.8 181.5 37.8C219.5 42.8 238.5 26.3 293.5 33.3C348.5 40.3 381 92.3 418 96.3C455 100.3 447 96.3 447 96.3V360.8H0L6 33.3Z" fill="white"/>
</svg>
  `;

  return (
    <SafeAreaView style={styles.container}>

      <Image 
        source={LoginIceCream}
        style={styles.backgroundImage}
        resizeMode="contain"
      />

      <LinearGradient
        colors={['#ffbae783', '#8D6CFF', '#8D6CFF']}
        style={styles.gradient}
      >
        {/* TODO: Agregar imagen de fondo con cupcakes */}
        <View style={styles.content}>
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={32} color="#ffffffff" />
          </TouchableOpacity> 

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Inicio de</Text>
            <Text style={styles.formTitle2}>Sesion</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Correo Electronico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon 
                  name={showPassword ? 'visibility' : 'visibility-off'} 
                  size={24} 
                  color="#B8B8B8" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
                onPress={() => navigation.navigate('ForgotPassword1')}
                style={{ zIndex: 10 }} // esto es para que el texto este por encima del svg, sino no furula y que hueva crear un estilo solo pa esto
              >
                <Text style={styles.forgotText1}>¿Olvidaste tu contraseña?</Text>
                <Text style={styles.forgotText2}>Restablecer contraseña</Text>
              </TouchableOpacity>

            <SvgXml xml={miSvgXml} width="120%" height="120%" style={styles.SVGs} />

            <TouchableOpacity
              onPress={() => {
              // TODO: Agregar lógica de login
              console.log('Login pressed');
            }}
            >
              <LinearGradient
              colors={['#B9B8FF', '#8D6CFF']} // colores degradado
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.loginButton}
            >
                <Text style={styles.loginButtonText}>Iniciar Sesion</Text>
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

 SVGs: {
      position: 'absolute',
      bottom: -370,
      left: -50,
    },


    backgroundImage: {
    position: 'absolute', // para que quede detrás del contenido
    top: -640,
    left: -100,
    right: 0,
    bottom: 0,
    width: '190%',
    height: '190%',
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
      paddingTop: 20,
    },
    formTitle: {
      marginTop: 200,
      fontSize: 32,
      color: 'white',
      textAlign: 'center',
      fontWeight: '900',
    },
    formTitle2: {
      fontSize: 32,
      color: 'white',
      textAlign: 'center',
      marginBottom: 70,
      fontWeight: '900',
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
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 40,
      fontSize: 16,
      marginHorizontal: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    passwordInput: {
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingVertical: 15,
      paddingRight: 50,
      borderRadius: 40,
      fontSize: 16,
      marginHorizontal: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    eyeButton: {
      position: 'absolute',
      zIndex: 1,
      right: 40,
      top: 13,
    },
    forgotText1: {
      color: 'white',
      textAlign: 'center',
      fontSize: 14,
    },
    forgotText2: {
      color: '#ffffffff',
      textAlign: 'center',
      fontSize: 14,
      marginBottom: 5,
      fontWeight: 700,
    },
    loginButton: {
      backgroundColor: '#8B5FBF',
      paddingVertical: 15,
      borderRadius: 50,
      alignItems: 'center',
      marginTop: 100,
      marginHorizontal: 50,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 6,
    },
    loginButtonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: '900',
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

  export default LoginScreen;
