import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importar pantallas
import SplashScreen from '../Screens/SplashScreen/SplashScreen';
import FirstHomepage from '../Screens/MainScreens/FirstHomepage';
import LoginScreen from '../Screens/Auth/LoginScreen';
import RegisterScreen from '../Screens/Auth/RegisterScreen1';
import RegisterScreen2 from '../Screens/Auth/RegisterScreen2';
import HomeScreen from '../Screens/MainScreens/HomeScreen';
import ProfileScreen from '../Screens/MainScreens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegador de tabs para las pantallas principales (después del login)
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8D6CFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Inicio'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Perfil'
        }}
      />
    </Tab.Navigator>
  );
};

// Navegador principal con Stack
const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false
      }}
    >
      {/* Splash Screen - Primera pantalla */}
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen} 
      />
      
      {/* Primera página de bienvenida */}
      <Stack.Screen 
        name="FirstHomePage" 
        component={FirstHomepage} 
      />
      
      {/* Pantallas de autenticación */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
      />
      <Stack.Screen 
        name="RegisterScreen2" 
        component={RegisterScreen2} 
      />
      
      {/* Pantallas principales (con tabs) */}
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;