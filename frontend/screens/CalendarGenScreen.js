import React, {useState} from 'react';
import { View, Text, Button, Alert } from 'react-native';
import axios from 'axios';

export default function CalendarGenScreen({route}){
  const tournamentId = route.params?.tournamentId || 1;
  const generate = async () => {
    try{
      const r = await axios.post('http://10.0.2.2:8000/api/generate-calendar', { tournament_id: tournamentId, start_date: '2025-11-10', pause_dates: [] });
      Alert.alert('Generated', JSON.stringify(r.data));
    }catch(e){ Alert.alert('Error', e.message); }
  };
  return (
    <View style={{flex:1, padding:20}}>
      <Text style={{fontSize:18}}>Generatore calendario (demo)</Text>
      <Button title="Genera calendario demo" onPress={generate} />
    </View>
  );
}
