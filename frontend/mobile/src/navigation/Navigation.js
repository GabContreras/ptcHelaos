import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

// Pantallas
import SplashScreen from '../Screens/SplashScreen/SplashScreen';
import LoginLoadingScreen from '../Screens/SplashScreen/LoginLoadingScreen';
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
  const { authToken, isLoading, isLoginLoading, user } = useAuth();

  // Log cuando cambian los estados de navegación
  useEffect(() => {
    console.log("🚀 Navigation - Estados de navegación:", {
      isLoading,
      isLoginLoading,
      hasUser: !!user,
      hasAuthToken: !!authToken,
      userName: user?.name
    });
  }, [isLoading, isLoginLoading, user, authToken]);

  // Decisión de navegación basada en estados
  const getNavigationDecision = () => {
    if (isLoading) {
      console.log("🟦 Navigation Decision: SPLASH (verificando auth inicial)");
      return 'SPLASH';
    }
    
    if (isLoginLoading && user) {
      console.log("🟣 Navigation Decision: LOGIN_LOADING (post-login)");
      return 'LOGIN_LOADING';
    }
    
    if (authToken) {
      console.log("🟢 Navigation Decision: MAIN_TABS (autenticado)");
      return 'MAIN_TABS';
    }
    
    console.log("🟠 Navigation Decision: AUTH_STACK (no autenticado)");
    return 'AUTH_STACK';
  };

  const decision = getNavigationDecision();

  // Mostrar splash mientras se verifica la autenticación inicial
  if (decision === 'SPLASH') {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Si está en proceso de login loading, mostrar esa pantalla
  if (decision === 'LOGIN_LOADING') {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginLoading" component={LoginLoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={decision === 'MAIN_TABS' ? 'MainTabs' : 'FirstHomePage'}
      >
        {decision === 'MAIN_TABS' ? (
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