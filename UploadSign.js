import React, {useRef,useEffect} from 'react';
import { StyleSheet, View, Button,BackHandler,Text} from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';

const UploadSign = ({navigation,route}) => {
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);
  const backAction = () => {
    navigation.goBack();
    return true;
  };
  const ref = useRef();
  var cart_id = route.params.cart_id;
  var user_id = route.params.user_id;
  console.log(cart_id+" "+user_id);

  const handleSignature = signature => {
    console.log(signature);
    Apicall(cart_id,user_id,signature);
  };

  const handleClear = () => {
    ref.current.clearSignature();
  }

  const handleConfirm = () => {
    console.log("end");
    ref.current.readSignature();

  }

  const Apicall = (cart,user,sign) => {
    fetch("https://myviristore.com/admin/api/driver/delivery_completed", {
      "method": "POST",
      headers: {
         Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cart_id: cart,
        user_signature: sign
      })
    
    })
      .then(response => response.json())
      .then(response => {
        alert(response.message);

        navigation.push('HomeScreen')
      })
      .catch(err => {
        alert(err);
      })
  }

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  return (
    <View style={styles.container}>
     <Text style={styles.titleText} >
     Get Customer Signature
      </Text>
      <SignatureScreen
          ref={ref}
          onOK={handleSignature} 
          webStyle={style}
      />
      <View style={styles.row}>
      <Button
       color="#f2a900"
       title="Back"
            onPress={backAction}
          />
        <Button
         color="#f2a900"
            title="Clear"
            onPress={handleClear}
        />
        <Button
         color="#f2a900"
          title="Confirm"
          onPress={handleConfirm}
        />
      </View>
    </View>
  );
}

export default UploadSign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    padding: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color:"#f2a900"
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  }
});