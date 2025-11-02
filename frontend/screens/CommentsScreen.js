import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import axios from 'axios';

export default function CommentsScreen({route}){
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);
  const matchId = route.params?.matchId || 1;
  useEffect(()=>{ fetchComments(); }, []);
  const fetchComments = async () => {
    const r = await axios.get(`http://10.0.2.2:8000/api/matches/${matchId}/comments`);
    setComments(r.data);
  };
  const submit = async () => {
    try{
      const payload = { match_id: matchId, user_id: 1, text, vote: null };
      const r = await axios.post('http://10.0.2.2:8000/api/comments', payload);
      setText(''); fetchComments();
    }catch(e){ Alert.alert('Error', e.message); }
  };
  return (
    <View style={{flex:1, padding:20}}>
      <Text style={{fontSize:18}}>Commenti partita</Text>
      <TextInput value={text} onChangeText={setText} placeholder="Scrivi un commento..." style={{borderWidth:1, padding:8, marginVertical:10}} />
      <Button title="Invia" onPress={submit} />
      <FlatList data={comments} keyExtractor={i=>String(i.id)} renderItem={({item})=>(
        <View style={{padding:8, borderBottomWidth:1}}><Text>{item.text}</Text></View>
      )} />
    </View>
  );
}
