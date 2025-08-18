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
import Texture from "../../../assets/images/Texture.png";
import { SvgXml } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';;
import Icon from 'react-native-vector-icons/MaterialIcons';

  const miSvgXml = `
  <svg width="402" height="464" viewBox="0 0 402 464" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="-24" width="453" height="491" fill="white"/>
</svg>
  `;

const ForgotPasswordScreen2 = ({ navigation, route }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const { email } = route.params || { email: 'CuentaRandom@gmail.com' };

  const handleCodeChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  return (
    <SafeAreaView style={styles.container}>

    <Image 
            source={Texture}
            style={styles.backgroundImage}
            resizeMode="repeat"
          />

      <LinearGradient
              colors={['#ff64c994', '#4d1bffa9', '#32255fff']}
              style={styles.gradient}
            >

        <SvgXml xml={miSvgXml} width="100%" height="100%" style={styles.SVGs} />


        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.userIconContainer}>
            <View style={styles.userIconCircle}>
              <Icon name="person" size={40} color="#8D6CFF" />
            </View>
          </View>

          <Text style={styles.recoveryTitle}>Recuperacion de</Text>
          <Text style={styles.recoveryTitle2}>Contraseña</Text>

          <View style={styles.recoveryFormContainer}>
            <Text style={styles.recoveryDescription}>
              Verifica el correo asociado a esta cuenta, posteriormente ingresa el codigo para recuperar tu contraseña
            </Text>

            <View style={styles.emailDisplayContainer}>
              <Icon name="person" size={20} color="#a1a1a1ff" />
              <Text style={styles.emailDisplayText}>{email}</Text>
            </View>

            <Text style={styles.codeInstruction}>Se envio un codigo a tu cuenta de gmail</Text>

            <Text style={styles.codeLabel}>Ingresa el codigo:</Text>

            <View style={styles.codeInputContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.codeInput}
                  value={digit}
                  onChangeText={(value) => handleCodeChange(value, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                />
              ))}
            </View>

            <View style={styles.buttonRow}>
  <TouchableOpacity
    onPress={() => {
      // TODO: Lógica para reenviar código
      console.log('Resend code');
    }}
  >
                <LinearGradient
                  colors={['#B9B8FF', '#8D6CFF']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.resendButton}
                >
                  <Text style={styles.resendButtonText}>Reenviar</Text>
                </LinearGradient>
              </TouchableOpacity>           

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword3', { email })}
              >
                <LinearGradient
                  colors={['#FFBAE7', '#8D6CFF']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.continueButton}
                >
                  <Text style={styles.continueButtonText}>Continuar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
      top: 200,
    },

  backgroundImage: {
    position: 'absolute', // para que quede detrás del contenido
    width: '100%',
    height: '100%',
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
      backgroundColor: '#8B5FBF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,

    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 40,
    flex: 0.45,
    alignItems: 'center',

    },
    nextButtonText: {
      color: '#ffffffff',
      fontSize: 20,
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

//estilos especificos para recuperacion  de contraseñas

userIconContainer: {
    alignItems: 'center',
    marginTop: 120,
    marginBottom: 20,
  },
  userIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recoveryTitle: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
  },
  recoveryTitle2: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: 20,
  },

recoveryFormContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
    padding: 30,
    marginHorizontal: 10,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 7,
  },
  recoveryDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 20,
    fontWeight: "500"
  },
  sendCodeButton: {
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
  sendCodeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emailDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 15,
  },
  emailDisplayText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  codeInstruction: {
    fontSize: 14,
    color: '#aaaaaaff',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: "600",
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
    resendButton: {
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 25,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },

  resendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  continueButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
},
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos para Modal de Éxito
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#8B5FBF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'white',
  },
  successTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  backToLoginButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  backToLoginButtonText: {
    color: '#8B5FBF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen2;