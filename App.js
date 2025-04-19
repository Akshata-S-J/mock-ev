import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStartPage from './src/screens/GetStartPage';
import LoginOptions from './src/screens/LoginOptions';
import UserLogin from './src/screens/UserLogin';
import SignUp from './src/screens/SignUp';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import Account from './src/screens/MyAccount';
import ResetPassword from './src/screens/ResetPassword';
import BookSlot from './src/screens/BookSlot';

const Stack = createNativeStackNavigator();

export default function App() {

  return (

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="getstartpage" component={GetStartPage} options={{ headerShown: false}}/>
          <Stack.Screen name="loginoptions" component={LoginOptions} options={{ headerShown: false}} />
          <Stack.Screen name="userlogin" component={UserLogin} options={{ headerShown: false}}/>
          <Stack.Screen name="signup" component={SignUp} options={{ headerShown: false}}/>
          <Stack.Screen name="home" component={Home} options={{ headerShown: false}}/>
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false}}/>
          <Stack.Screen name="Account" component={Account} options={{ headerShown: false}}/>
          <Stack.Screen name="BookSlot" component={BookSlot} options={{ headerShown: false}}/>
          <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false}}/>
          
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
