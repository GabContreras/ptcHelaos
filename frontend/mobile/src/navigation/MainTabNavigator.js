import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import HomeScreen from '../Screens/MainScreens/HomeScreen.js';
import ActiveOrdersScreen from '../Screens/MainScreens/ActiveOrdersScreen.js';
import ProfileScreen from '../Screens/MainScreens/ProfileScreen.js';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabContainer}>
      <LinearGradient
        colors={['#8D6CFF', '#B9B8FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tabBar}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const getIconName = (routeName) => {
            switch (routeName) {
              case 'Home':
                return 'home';
              case 'Orders':
                return 'checkmark-circle';
              case 'Profile':
                return 'person-circle';
              default:
                return 'home';
            }
          };

          return (
            <Animated.View
              key={index}
              style={[
                styles.tabButton,
                isFocused && styles.activeTabButton
              ]}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  isFocused && styles.activeIconContainer
                ]}
              >
                <Ionicons
                  name={getIconName(route.name)}
                  size={24}
                  color={isFocused ? '#8D6CFF' : '#FFFFFF'}
                  onPress={onPress}
                />
              </Animated.View>
            </Animated.View>
          );
        })}
      </LinearGradient>
    </View>
  );
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Orders" component={ActiveOrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    transform: [{ scale: 1.1 }],
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#8D6CFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});