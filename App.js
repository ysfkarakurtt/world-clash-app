import 'react-native-gesture-handler'; 
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginPage from './src/components/screens/LoginPage';
import RegisterPage from './src/components/screens/RegisterPage';
import HomePage from './src/components/screens/HomePage';
import NewGamePage from './src/components/screens/NewGamePage';
import MatchmakingPage from './src/components/screens/MatchmakingPage';
import ActiveGamesPage from './src/components/screens/ActiveGamesPage';
import FinishedGamesPage from './src/components/screens/FinishedGamesPage';
import GamePage from './src/components/screens/GamePage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="NewGame" component={NewGamePage} />
          <Stack.Screen name="Matchmaking" component={MatchmakingPage} />
          <Stack.Screen name="ActiveGames" component={ActiveGamesPage} />
          <Stack.Screen name="FinishedGames" component={FinishedGamesPage} />
          <Stack.Screen name="Game" component={GamePage} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
