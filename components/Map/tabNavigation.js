import { createBottomTabNavigator } from 'react-navigation';

import ordersList from './ordersList';
import Map from './Map';
import Profile from './Profile';
import ChangePurse from './ChangePurse';

export default createBottomTabNavigator({
    Map: { screen: Map },
    Profile: { screen: Profile },
    ordersList: { screen: ordersList },
  });