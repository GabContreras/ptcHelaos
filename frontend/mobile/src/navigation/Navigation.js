import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Mantener las pantallas existentes de Moon Ice Cream
import Home from '../Screens/MainScreens/HomeScreen.js';
import ActiveOrders from '../Screens/MainScreens/ActiveOrdersScreen.js';
import ProfileScreen from '../Screens/MainScreens/ProfileScreen.js';
import TabNavigator from './MainTabNavigator.js';
import LoginScreen from '../Screens/Auth/LoginScreen.js';

// Contexto de autenticación (usar el de Moon Ice Cream)
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();


export default function Navigation() {
  const { authToken, isLoading } = useAuth();
  const Stack = createNativeStackNavigator();

  // Verificar si hay token al cargar
  if (isLoading) {
    return null; // O un componente de loading si prefieres
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={authToken ? 'TabNavigator' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        {authToken ? (
          // Usuario autenticado - usar TabNavigator existente
          <>
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="PedidosActivos" component={ActiveOrders} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          </>
        ) : (
          // Usuario no autenticado
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}