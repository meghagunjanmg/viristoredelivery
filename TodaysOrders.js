import React, { Component,useState,useEffect} from 'react'
import { Linking,Button,Text, View,StyleSheet,FlatList,Image,TouchableOpacity } from 'react-native'
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Card} from 'react-native-elements'

var user;
const TodaysOrders  = ({navigation,route}) => 
{

  const [showComponent, setShowComponent] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    readItemFromStorage();
  }, []);


  const [value, setValue] = useState('value');
  const { getItem, setItem } = useAsyncStorage('@storage_key');
  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
    const item12 = item.split('::');
    user = item12[0];
    
    callApiData()
  };
  const callApiData = ()=>{
     
   fetch("https://myviristore.com/admin/api/driver/ordersfortoday", {
    "method": "POST",
    headers: {
       Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      dboy_id: user
    })
  })
    .then(response => response.json())
    .then(response => {
      console.log(typeof(response));
      if(response[0].order_details=="no orders found"){
        //alert("no orders found")
        setShowComponent(true)
      }
     else{ 
        setData(response)
        setShowComponent(false)
  }
    })
    .catch(err => {
      console.log(err);
      alert(err);
    });
  
   }

   return (
     <View>
    <View display={showComponent ? 'flex' : 'none'}> 
    <Text style={styles.text}>No Orders Found</Text> 
    </View> 
    <View>
    <FlatList
          data={data}
          keyExtractor = { (item, index) => index.toString() }
          renderItem={({item}) =>{
         return(
              <Card>
                     <View
                     style={styles.topbar} >
             
             <View style={{flexDirection:"row",borderBottomColor:"grey"}}>
                       <View style={{marginTop:10,marginBottom:10,width:"95%"}}>
                       <Text style={{color:"#7f7f7f",fontWeight:"bold"}}>Order Id:- {item.cart_id}</Text>
                       <Text style={{color:"#7f7f7f",fontWeight:"bold"}}>Order Status:- {item.order_status}</Text>
                       </View>
                       <TouchableOpacity onPress={() => {
                               Linking.openURL('tel:'+item.user_phone);}
                             }>
                           <Image style={{alignItems:"center",height:30,width:30}}
                           source={require('./Drawble/p.png')}/>
                         </TouchableOpacity>
                   </View>
                       <View style={{flexDirection:"row",borderBottomColor:"grey",borderBottomWidth:2,borderTopColor:"grey",borderTopWidth:2}}>
                         <View style={{borderRightColor:"grey",width:"50%",borderRightWidth:3,padding:6}}>
                         <Text style={{color:"#7f7f7f",fontWeight:"bold"}}>Delivery Date:- {item.delivery_date}</Text>
                           <Text style={{color:"#7f7f7f",fontWeight:"bold"}}>Slot Time:- {item.time_slot}</Text>
                           <Text style={{color:"#7f7f7f",fontWeight:"bold"}}>Item Qty:- {item.order_details}</Text>
                           <Text style={{color:"#7f7f7f",fontWeight:"bold"}}>Remainng Amount:- {item.remaining_price} </Text>
                           <Text style={{color:"#7f7f7f",fontWeight:"bold"}}>Delivery Instructions:- {item.delivery_instructions} </Text>

                         </View>

                         
             
                         <View style={{padding:10,width:"50%"}}>
                         <View style={{flexDirection:"row",marginTop:10,marginBottom:10,width:"95%",marginLeft:"auto",marginRight:"auto"}}>
                         <View style={{marginTop:10,marginBottom:10,width:"50%"}}>
                           <Text style={{color:"#7f7f7f",fontWeight:"bold"}}>Customer Name</Text>
                           <Text style={{color:"#7f7f7f",fontWeight:"bold",marginTop:12}}>Delivery Address</Text>
                         </View>
                         <View style={{marginTop:10,marginBottom:10,alignItems:"flex-end",width:"50%"}}>
                           <Text style={{color:"#7f7f7f",fontWeight:"bold"}}>{item.user_name}</Text>
                           <Text style={{color:"#7f7f7f",fontWeight:"bold",marginTop:12}}>{item.user_address}</Text>
                         </View>
                        
                       </View>
                        </View>
                       </View>
                        <View style={{flexDirection:"row",marginBottom:10,marginTop:10}}>
    
                        {item.order_status == "Confirmed"?
                  <TouchableOpacity 
                    onPress={() => 
                      fetch("https://myviristore.com/admin/api/driver/out_for_delivery", {
                        "method": "POST",
                        headers: {
                           Accept: 'application/json',
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          cart_id: item.cart_id
                        })
                      
                      })
                        .then(response => response.json())
                        .then(response => {
                          console.log(response.message);
                          callApiData();
                          return response.Status;
                        })
                        .catch(err => {
                          console.log(err);
                          alert(err);
                        })
                    } 
                 
                 style={{backgroundColor:"#f2a900",width: "48%",padding:10,borderRadius:50,alignItems:"center",marginRight:10}}>
                    <Text style={{color:"white"}}>Out for delivery</Text>
                  </TouchableOpacity>:
                  <TouchableOpacity 
                    onPress={() => 
                      navigation.navigate('UploadSign',{ cart_id:item.cart_id,user_id:user})
                      
                    } 
                    style={{backgroundColor:"green",width: "48%",padding:10,borderRadius:50,alignItems:"center",marginRight:10}}>
                    <Text style={{color:"white"}}>Mark as Delivered</Text>
                  </TouchableOpacity>}
      
    
                         <TouchableOpacity 
                           onPress={() => {
                             let latitude = item.user_lat;
                             let longitude = item.user_lng;
                             const daddr = `${latitude},${longitude}`;
                             const company = Platform.OS === "ios" ? "apple" : "google";
                             Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
                             }}
                           style={{backgroundColor:"green",width: "48%",padding:10,borderRadius:50,alignItems:"center",marginRight:10}}>
                           <Text style={{color:"white"}}>Get Direction</Text>
                         
                         </TouchableOpacity>
             
                       
                       </View>
             
                     </View>
                      </Card>
             
             )
          }
        }
        />
        </View>
        </View>
  )
};
    
const styles = StyleSheet.create({
  topbar: {
    marginTop: 10,
    marginBottom:10,
    marginLeft:"auto",
    marginRight:"auto",
    width:"95%", 
    height: "auto" ,
    backgroundColor:"white",
    padding:8,
    borderRadius:20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,  
    elevation: 10,
    // flex:1,
  },
  sideBox:{
    width: "50%",
    // flex:1

  },spinnerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  orderDetailsScreen:{
    width:"95%",
    elevation:10,
    marginLeft:"auto",
    marginRight:"auto",
    marginTop:30,
    marginBottom:20,
    padding:5,
    paddingTop:20,
    paddingBottom:30, 
    backgroundColor:"white",
    borderRadius:10
  },
  text: {
    fontSize: 30,
    textAlign:'center',
    alignItems:'center'
  }
});


export default TodaysOrders;
