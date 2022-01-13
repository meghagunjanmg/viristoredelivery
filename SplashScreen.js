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

var item = null;
const SplashScreen  = ({navigation}) => 
{
    useEffect(() => {
        readItemFromStorage();
      }, []);    

    const [value, setValue] = useState('value');
    const { getItem, setItem} = useAsyncStorage('@storage_key');
    const readItemFromStorage = async () => {
      item = await getItem();
      setValue(item);
      console.log("get item 1 "+item);
    };
    setTimeout(()=>{
          if(item==null){
            navigation.replace('login')
          }
          else navigation.replace('HomeScreen')
    }, 2000);
  return (
    <View
    style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#ffffff'}}>
    <Image
      source={require('./Drawble/app_icon_2.png')}
      style={{height:100,width:70}}
      />
  </View>
     );
};

export default SplashScreen;
