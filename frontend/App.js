import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import TournamentScreen from './screens/TournamentScreen';
import MatchsheetScreen from './screens/MatchsheetScreen';
import CertificateScreen from './screens/CertificateScreen';
import CommentsScreen from './screens/CommentsScreen';
import CalendarGenScreen from './screens/CalendarGenScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{title:'Pax in Teris'}}/>
        <Stack.Screen name="Tournament" component={TournamentScreen} />
        <Stack.Screen name="Matchsheet" component={MatchsheetScreen} />
        <Stack.Screen name="Certificates" component={CertificateScreen} />
        <Stack.Screen name="Comments" component={CommentsScreen} />
        <Stack.Screen name="CalendarGen" component={CalendarGenScreen} options={{title:'Genera Calendario'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
