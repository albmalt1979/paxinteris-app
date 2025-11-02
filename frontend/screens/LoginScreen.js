import React, {useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = async () => {
    try {
      const res = await axios.post('http://10.0.2.2:8000/auth/login', { email, password });
      // store token in memory (for demo)
      global.ACCESS_TOKEN = res.data.access_token;
      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Login failed', e.response?.data?.detail || e.message);
    }
  };

  const goRegister = () => {
    navigation.navigate('Register');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pax in Teris</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize='none' />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={doLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:20, justifyContent:'center', backgroundColor:'#ffffff'},
  title:{fontSize:20, fontWeight:'bold', marginBottom:20, textAlign:'center'},
  input:{borderWidth:1, borderColor:'#ccc', padding:10, marginBottom:10, borderRadius:6}
});
