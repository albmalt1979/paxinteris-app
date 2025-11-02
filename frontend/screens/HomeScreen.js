import React, {useEffect, useState} from 'react';
import { View, Text, Button, FlatList, Image } from 'react-native';
import axios from 'axios';

export default function HomeScreen({navigation}) {
  const [tournaments, setTournaments] = useState([]);
  useEffect(() => { fetchTournaments(); }, []);
  const fetchTournaments = async () => {
    const res = await axios.get('http://10.0.2.2:8000/api/tournaments');
    setTournaments(res.data);
  };
  return (
    <View style={{flex:1, padding:20, backgroundColor:'#ffffff'}}>
      <View style={{alignItems:'center', marginBottom:10}}>
        <Image source={require('../assets/icon.png')} style={{width:120, height:120, resizeMode:'contain'}} />
        <Text style={{fontSize:22, fontWeight:'bold', color:'#0b5fa5'}}>Pax in Teris</Text>
      </View>
      <Button title="Carica certificato (demo)" onPress={() => navigation.navigate('Certificates')} />
      <Button title="Commenti partita (demo)" onPress={() => navigation.navigate('Comments', {matchId:1})} />
      <Button title="Genera calendario (demo)" onPress={() => navigation.navigate('CalendarGen', {tournamentId:1})} />
      <Text style={{fontSize:18, fontWeight:'bold', marginTop:10}}>Tornei</Text>
      <FlatList data={tournaments} keyExtractor={item => String(item.id)} renderItem={({item}) => (
        <View style={{padding:10, borderBottomWidth:1, borderColor:'#eee'}}>
          <Text style={{fontSize:16}}>{item.name}</Text>
          <Button title="Open" onPress={() => navigation.navigate('Tournament', {tournament: item})} />
        </View>
      )} />
    </View>
  );
}
