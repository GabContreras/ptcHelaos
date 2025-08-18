import React, { useState } from 'react';
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoginIceCream from "../../../assets/images/LoginIceCream.png";
import { SvgXml } from 'react-native-svg';
import { useLogin } from '../../hooks/LoginHook/useLogin';

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
    clearError
  } = useLogin();

  const miSvgXml = `
   <svg width="448" height="361" viewBox="0 0 448 361" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 33.3C6 33.3 -3 10.3 43 1.30005C89 -7.69995 143.5 32.8 181.5 37.8C219.5 42.8 238.5 26.3 293.5 33.3C348.5 40.3 381 92.3 418 96.3C455 100.3 447 96.3 447 96.3V360.8H0L6 33.3Z" fill="white"/>
</svg>
  `;

  const onLoginPress = async () => {
    clearError();
    
    const success = await handleLogin();
    
    if (success) {
      // La navegación será automática por el cambio de authToken en Navigation.js
      console.log("Login exitoso, navegación automática");
    } else if (error) {
      Alert.alert(
        "Error de inicio de sesión",
        error,
        [{ text: "OK", onPress: () => clearError() }]
      );
    }
  };

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
        <View style={styles.content}>
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Icon name="arrow-back" size={32} color="#ffffffff" />
          </TouchableOpacity> 

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Inicio de</Text>
            <Text style={styles.formTitle2}>Sesión</Text>
            
            {/* Campo de email */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, loading && styles.inputDisabled]}
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                autoCorrect={false}
              />
            </View>

            {/* Campo de contraseña */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.passwordInput, loading && styles.inputDisabled]}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Icon 
                  name={showPassword ? 'visibility' : 'visibility-off'} 
                  size={24} 
                  color={loading ? "#D3D3D3" : "#B8B8B8"} 
                />
              </TouchableOpacity>
            </View>

            {/* Link de recuperar contraseña */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword1')}
              style={{ zIndex: 10 }}
              disabled={loading}
            >
              <Text style={[styles.forgotText1, loading && styles.textDisabled]}>
                ¿Olvidaste tu contraseña?
              </Text>
              <Text style={[styles.forgotText2, loading && styles.textDisabled]}>
                Restablecer contraseña
              </Text>
            </TouchableOpacity>

            <SvgXml xml={miSvgXml} width="120%" height="120%" style={styles.SVGs} />

            {/* Botón de login */}
            <TouchableOpacity
              onPress={onLoginPress}
              disabled={loading}
              style={[styles.loginButtonContainer, loading && styles.loginButtonDisabled]}
            >
              <LinearGradient
                colors={loading ? ['#CCCCCC', '#AAAAAA'] : ['#B9B8FF', '#8D6CFF']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.loginButton}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={styles.loginButtonText}>Iniciando sesión...</Text>
                  </View>
                ) : (
                  <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                )}
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
    position: 'absolute',
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
  inputDisabled: {
    backgroundColor: '#F0F0F0',
    opacity: 0.7,
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
    fontWeight: '700',
  },
  textDisabled: {
    opacity: 0.5,
  },
  loginButtonContainer: {
    marginTop: 100,
    marginHorizontal: 50,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButton: {
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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