import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FirstHomepage from './src/Screens/MainScreens/FirstHomepage.js';
import LoginScreen from './src/Screens/Auth/LoginScreen.js';
import RegisterScreen1 from './src/Screens/Auth/RegisterScreen1.js';
import RegisterScreen2 from './src/Screens/Auth/RegisterScreen2.js';
import ForgotPasswordScreen1 from './src/Screens/Auth/PasswordRecovery/ForgotPasswordScreen1.js';
import ForgotPasswordScreen2 from './src/Screens/Auth/PasswordRecovery/ForgotPasswordScreen2.js';
import ForgotPasswordScreen3 from './src/Screens/Auth/PasswordRecovery/ForgotPasswordScreen3.js';
import MainTabNavigator from './src/navigation/MainTabNavigator'


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={FirstHomepage} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register1" component={RegisterScreen1} />
        <Stack.Screen name="Register2" component={RegisterScreen2} />
        <Stack.Screen name="ForgotPassword1" component={ForgotPasswordScreen1} />
        <Stack.Screen name="ForgotPassword2" component={ForgotPasswordScreen2} />
        <Stack.Screen name="ForgotPassword3" component={ForgotPasswordScreen3} />
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
