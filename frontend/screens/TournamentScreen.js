import React from 'react';
import { View, Text, Button } from 'react-native';

export default function TournamentScreen({route, navigation}) {
  const { tournament } = route.params;
  return (
    <View style={{flex:1, padding:20}}>
      <Text style={{fontSize:20, fontWeight:'bold'}}>{tournament.name}</Text>
      <Text>Tipo: {tournament.kind}</Text>
      <Button title="Open Matchsheet (demo)" onPress={() => navigation.navigate('Matchsheet', {matchId: 1})} />
      <Button title="Commenti" onPress={() => navigation.navigate('Comments', {matchId:1})} />
      <Button title="Genera calendario" onPress={() => navigation.navigate('CalendarGen', {tournamentId: tournament.id})} />
    </View>
  );
}
