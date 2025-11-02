import React, {useState} from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

export default function MatchsheetScreen({route}) {
  const { matchId } = route.params || {matchId: 1};
  const [home, setHome] = useState('0');
  const [away, setAway] = useState('0');

  const submit = async () => {
    try {
      const payload = {
        match_id: matchId,
        compiled_by: 1,
        payload: JSON.stringify({ home_score: Number(home), away_score: Number(away) })
      };
      const res = await axios.post('http://10.0.2.2:8000/api/matchsheet', payload);
      Alert.alert('Saved', 'Matchsheet saved. ID: ' + res.data.id);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={{flex:1, padding:20}}>
      <Text style={{fontSize:18}}>Matchsheet (demo)</Text>
      <Text>Home score</Text>
      <TextInput value={home} onChangeText={setHome} keyboardType="numeric" style={{borderWidth:1,padding:8,marginBottom:10}} />
      <Text>Away score</Text>
      <TextInput value={away} onChangeText={setAway} keyboardType="numeric" style={{borderWidth:1,padding:8,marginBottom:10}} />
      <Button title="Submit tabellino" onPress={submit} />
    </View>
  );
}
