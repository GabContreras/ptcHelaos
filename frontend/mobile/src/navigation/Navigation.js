import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas
import SplashScreen from '../Screens/SplashScreen/SplashScreen';
import HomeScreen from '../Screens/MainScreens/HomeScreen.js';
import ActiveOrders from '../Screens/MainScreens/ActiveOrdersScreen.js';
import ProfileScreen from '../Screens/MainScreens/ProfileScreen.js';
import TabNavigator from './MainTabNavigator.js';
import LoginScreen from '../Screens/Auth/LoginScreen.js';
import FirstHomePage from '../Screens/MainScreens/FirstHomepage.js';
import RegisterScreen1 from '../Screens/Auth/RegisterScreen1.js';
import RegisterScreen2 from '../Screens/Auth/RegisterScreen2.js';
import ForgotPasswordScreen1 from '../Screens/PasswordRecovery/ForgotPasswordScreen1.js';
import ForgotPasswordScreen2 from '../Screens/PasswordRecovery/ForgotPasswordScreen2.js';
import ForgotPasswordScreen3 from '../Screens/PasswordRecovery/ForgotPasswordScreen3.js';

// Contexto de autenticación
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { authToken, isLoading } = useAuth();

  // Mostrar splash mientras se verifica la autenticación
  if (isLoading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={authToken ? 'MainTabs' : 'FirstHomePage'}
      >
        {authToken ? (
          // Usuario autenticado - Mostrar TabNavigator
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PedidosActivos" component={ActiveOrders} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          </>
        ) : (
          // Usuario no autenticado - Mostrar pantallas de auth
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="FirstHomePage" component={FirstHomePage} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register1" component={RegisterScreen1} /> 
            <Stack.Screen name="Register2" component={RegisterScreen2} /> 
            <Stack.Screen name="ForgotPassword1" component={ForgotPasswordScreen1} /> 
            <Stack.Screen name="ForgotPassword2" component={ForgotPasswordScreen2} /> 
            <Stack.Screen name="ForgotPassword3" component={ForgotPasswordScreen3} /> 
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}