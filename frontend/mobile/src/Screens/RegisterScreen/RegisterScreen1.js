import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RegisterScreen1 = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#9C27B0', '#BA68C8', '#E1BEE7']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <Text style={styles.title}>Registro 1</Text>
          
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Registro</Text>
            
            <Text style={styles.label}>Nombre:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.label}>Correo Electronico:</Text>
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

            <Text style={styles.label}>Telefono:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Numero de telefono"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => navigation.navigate('Register2')}
            >
              <Text style={styles.nextButtonText}>Siguiente</Text>
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

  export default RegisterScreen1;