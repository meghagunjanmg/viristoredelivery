import React, {useState, useEffect }from 'react';
import { StyleSheet,
  Text,
  View,
  Image,
  Keyboard,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  KeyboardAvoidingView, Alert } from "react-native";

import { useAsyncStorage } from '@react-native-async-storage/async-storage';

var apiRes = 0;


const login  = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [value, setValue] = useState('value');
  const { getItem, setItem } = useAsyncStorage('@storage_key');
  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
    console.log("get item  "+item);
  };

  const writeItemToStorage = async newValue => {
    await setItem(newValue);
    setValue(newValue);
    console.log("saved item  "+newValue);
    
  };

  const navigat = ({}) =>{
    ToastAndroid.show("login successfully",2000);
    navigation.navigate('HomeScreen',{user:String(response.data[0].dboy_id)})
  }
  useEffect(() => {
    readItemFromStorage();
  }, []);

  const fetchApiCall  = ({}) => {
    if (!email) {
      alert('Please fill Phone Number');
      return;
    }
    if (!password) {
      alert('Please fill Password');
      return;
    }

    fetch("https://myviristore.com/admin/api/driver/driver_login", {
      "method": "POST",
      headers: {
         Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: email,
        password: password,

        //phone: '7894561230',
        //password: 'Chetan_10',
        device_id: "szdhjjhkjlk"
      })
    
    })
      .then(response => response.json())
      .then(response => {
        console.log(response.message);
        apiRes = response.status;
        if(apiRes==1){
          writeItemToStorage(String(response.data[0].dboy_id)+"::"+String(response.data[0].status+"::"+String(response.data[0].boy_name)));
       
          ToastAndroid.show("login successfully",2000);
          navigation.push('HomeScreen',{user:String(response.data[0].dboy_id)})
        }
          else{
            alert(response.message+"");
          }
      })
      .catch(err => {
        console.log(err);
        alert(err);
      });
     
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./Drawble/app_icon.png')} 
         style={{height:80,width:60}}/>
      </View>
      <View style={styles.footer}>
        <Text style={styles.text_footer}>Email/Phone Number</Text>
        <View style={styles.action}>
<TextInput
                        style={styles.textInput}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#6C6969"
                        keyboardType="numeric"
                        maxLength={10}
                        onChangeText={(email) => setEmail(email)}
                    />       
                     </View>
        <Text style={styles.text_footer}>Password</Text>
        <View style={styles.action}>
        <TextInput
                        style={styles.textInput}
                        placeholderTextColor="#6C6969"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                      
                    />       
                     </View>

        <View style={styles.inner}>
          <Button
            color="#f2a900"
            title="Signin"
            onPress={fetchApiCall}
          />
        </View>

            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2a900',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default login;
