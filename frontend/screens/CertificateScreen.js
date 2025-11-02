import React, {useState} from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

export default function CertificateScreen(){ 
  const [status, setStatus] = useState('idle');
  const pickAndUpload = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if (res.type === 'success') {
      setStatus('uploading');
      // Expo File URI may need further handling; send to backend as multipart/form-data
      const form = new FormData();
      const uriParts = res.uri.split('.');
      const fileType = uriParts[uriParts.length-1];
      form.append('file', { uri: res.uri, name: res.name, type: 'application/octet-stream' });
      try {
        const r = await axios.post('http://10.0.2.2:8000/api/players/1/certificate', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setStatus('uploaded');
        Alert.alert('Uploaded', JSON.stringify(r.data));
      } catch(e){
        setStatus('error');
        Alert.alert('Error', e.message);
      }
    }
  };
  return (
    <View style={{flex:1, padding:20}}>
      <Text style={{fontSize:18, marginBottom:10}}>Upload certificato medico (demo)</Text>
      <Button title="Scegli e carica documento" onPress={pickAndUpload} />
      <Text style={{marginTop:20}}>Status: {status}</Text>
    </View>
  );
}
