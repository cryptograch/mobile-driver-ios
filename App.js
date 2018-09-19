import Home from './components/Home/Home';
import Signin from './components/Signin/Signin';
import Registration from './components/Registration/Registration';
import Policy from './components/Policy/Policy';
import License from './components/License/License';
import Car from './components/Car/Car';
import tabNavigation from './components/Map/tabNavigation';
import Settings from './components/Settings/Settings';
import ChangePurse from './components/Map/ChangePurse';
import {
  StackNavigator,
} from 'react-navigation';

const SimpleApp = StackNavigator({
  Home: { screen: Home }, 
  Signin: { screen: Signin, navigationOptions: {
    headerTintColor: '#faa71a',
  } },
  Registration: { screen: Registration , navigationOptions: {
    headerTintColor: '#faa71a',
  } },
  License: { screen: License, navigationOptions: {
    headerTintColor: '#faa71a',
  } },
  Policy: { screen: Policy, navigationOptions: {
    headerTintColor: '#faa71a',
  } },
  Car: { screen: Car, navigationOptions: {
    headerTintColor: '#faa71a',
  } },
  Map: { screen:  tabNavigation, navigationOptions: { header: null, gesturesEnabled: false, } },
  Settings: { screen: Settings, navigationOptions: {
    headerTintColor: '#faa71a',
  } },
  ChangePurse: { screen: ChangePurse, navigationOptions: {
    headerTintColor: '#faa71a',
    } }
});

export default SimpleApp;