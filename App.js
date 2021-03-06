// Tab View inside Navigation Drawer
// https://aboutreact.com/tab-view-inside-navigation-drawer-sidebar-with-react-navigation/

import 'react-native-gesture-handler';
import React,{useState,useEffect,Component} from 'react';
import {Alert,View, TouchableOpacity, Image,ToastAndroid,Animated} from 'react-native';
import Icon from 'react-native-ionicons'
import { Switch } from 'react-native-switch';

import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';


import SplashScreen from './SplashScreen';
import HomeScreen from './TodaysOrders';
import ExploreScreen from './NextDaysOrders';
import login from './login';
import DeliveredOrder from './DeliveredOrders';
import UploadSign from './UploadSign';
import { ReduxNetworkProvider } from 'react-native-offline';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import PushNotificationIOS from "react-native-push-notification";
import PushNotification from "react-native-push-notification";
import Firebase from '@react-native-firebase/app'
import messaging from '@react-native-firebase/messaging';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

const NavigationDrawerStructure = (props) => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => toggleDrawer()}>
        {/*Donute Button Image */}
        <Image
          source={{
            uri:
              'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
          }}
          style={{width: 25, height: 25, marginLeft: 5}}
        />
      </TouchableOpacity>
    </View>
  );
};

const getHeaderTitle = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
  switch (routeName) {
    case 'SplashScreen':
      return 'SplashScreen';
    case 'HomeScreen':
      return 'Home';
    case 'ExploreScreen':
      return 'Explore';
    case 'TabStack':
      return 'Home';
      case 'Delivered Orders':
        return 'DeliveredOrder';
        case 'UploadSign':
        return 'UploadSign';
  }
};

const TabStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      tabBarOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#000000',
        style: {
          backgroundColor: '#238A02',
        },
        labelStyle: {
          textAlign: 'center',
        },
        indicatorStyle: {
          borderBottomColor: '#87B56A',
          borderBottomWidth: 2,
        },
      }}>
      <Tab.Screen
        name="Today's Orders"
        component={HomeScreen}
        options={{
          tabBarLabel: "Today's Orders",
          /*tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
             name="home"
             color={color}
             size={size}
            />
          ),*/
        }}
      />
      <Tab.Screen
        name="Next Day'd Orders"
        component={ExploreScreen}
        options={{
          tabBarLabel:"Next Day'd Orders",
          /*tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
             name="settings"
             color={color}
             size={size}
            />
          ),*/
        }}
      />
    </Tab.Navigator>
  );
};

var ck =-1,user,status,name;
const HomeScreenStack = ({navigation}) => {

  const [value, setValue] = useState('value');
  const { getItem, setItem } = useAsyncStorage('@storage_key');
  const [toggle, setToggle] = useState();

  useEffect(() => {
    readItemFromStorage();
  }, []);
  
  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
    const item12 = item.split('::');
    user = item12[0];
    status = item12[1];
    name = item12[2];

    if(status==0) 
    setToggle(false)
    else setToggle(true)
  };

  const writeItemToStorage = async newValue => {
    await setItem(newValue);
    setValue(newValue);
    console.log("saved item  "+newValue);

    readItemFromStorage()
  };


  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="Home Screen"
        component={TabStack}
        options={({route}) => ({
          headerTitle: //getHeaderTitle(route),
                      "Hello "+name+ " !!",
          headerLeft: () => (
            <NavigationDrawerStructure
              navigationProps={navigation}
            />
          ),
          headerStyle: {
            backgroundColor: '#238A02', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
          headerRight: () => (
            <TouchableOpacity>
              <Switch
  onValueChange={
    (value) => {
      if(value==true)
      {
        ck=1
      }
      else 
      {
        ck=0
      }

      fetch("https://myviristore.com/admin/api/driver/update_status", {
        "method": "POST",
        headers: {
           Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dboy_id: user,
          status: ck
              })
      
      })
        .then(response => response.json())
        .then(response => {
          console.log(response.message);
          console.log(response.status);
          
          writeItemToStorage(user+"::"+ck+"::"+name);
  
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  value={toggle}
activeText={'On'}
inActiveText={'Off'}

backgroundActive={'green'}
backgroundInactive={'gray'}
circleActiveColor={'#30a566'}
circleInActiveColor={'#000000'}/>
  
          </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};


const UploadSignStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="FourPage"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor:'#238A02', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="UploadSign"
        component={UploadSign}
        options={{
          title: 'Upload Signature', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const DeliverScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="ThirdPage"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor:'#238A02', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="DeliveredOrder"
        component={DeliveredOrder}
        options={{
          title: 'Deliverd Orders', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const SplashScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="ZeroPage"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor:'#238A02', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          title: 'SplashScreen', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const LogoutStack = ({navigation}) => {
  const clearall = async () => {
    await AsyncStorage.clear();
    console.log("Clear");
  };
  setTimeout(()=>{
    clearall()
    navigation.replace('login')
}, 2000);
  return (
  <View
  style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#ffffff'}}>
  <Image
    source={require('./Drawble/app_icon_2.png')}
    style={{height:110,width:150}}
    />
</View>
   );
};

function Draw(){
  
  return(
    <Drawer.Navigator
        drawerContentOptions={{
          activeTintColor: '#238A02',
          itemStyle: {marginVertical: 5},
        }}>
        <Drawer.Screen
          name="HomeScreenStack"
          options={{drawerLabel: 'Home Screen Option'}}
          component={HomeScreenStack}
        />
         <Drawer.Screen
          name="DeliverScreenStack"
          options={{drawerLabel: 'Delivered Orders'}}
          component={DeliverScreenStack}
        />
        <Drawer.Screen
          name="LogoutStack"
          options={{drawerLabel: 'Logout'}}
          component={LogoutStack}
          onPress={()=> async () => {
            try {
              await AsyncStorage.clear()
            } catch(e) {
              // clear error
              console.log('e.'+e)
            }
          
            console.log('Done.')
          }
         } 
        />
      </Drawer.Navigator>

  );

}

const App = () => {
 
  Firebase.initializeApp(this)

  useEffect(() => {
  
    firebasenotification()

  }, []);

 // async function registerAppWithFCM() {  messaging().setAutoInitEnabled(true) }

  const firebasenotification = async () => {
    //registerAppWithFCM()
    Firebase.initializeApp(this)

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    this.setState({
      pushNotification: notification,
      visible: true
    });
    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);

    if (notification.foreground) {
      PushNotification.localNotification({
          title:notification.title,
          message:notification.message
      });
   } 
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  
  


  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="SplashScreen" component={SplashScreen}
        options={{
          headerShown:false,
        }}
        />
        <Stack.Screen name ="login" component={login}
        options={{
          headerShown:false,
        }}/>
        
        <Stack.Screen name ="HomeScreen" component={Draw}
        options={{
          headerShown:false,
        }}
        />
            <Stack.Screen name ="UploadSign" component={UploadSign}
        options={{
          headerShown:false,
        }}
        />
      </Stack.Navigator> 
      
    </NavigationContainer>
  );
};


export default App;