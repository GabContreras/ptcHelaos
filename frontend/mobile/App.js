import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FirstHomepage from './src/Screens/FirstHomepage/FirstHomepage.js';
import LoginScreen from './src/Screens/LoginScreen/LoginScreen.js';
import RegisterScreen1 from './src/Screens/RegisterScreen/RegisterScreen1.js';
import RegisterScreen2 from './src/Screens/RegisterScreen/RegisterScreen2.js';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
