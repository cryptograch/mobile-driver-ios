

import React, {Component} from 'react';
import {
  Text, 
  View,
  PixelRatio 
} from 'react-native';
import styles from './style';

class Footer extends Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = { title: 'Footer'};
  render() {
    return (
      <View style={styles.component}>
        <View
            style={ styles.horLine }
        />
        <View style={styles.content}>
            <Text style={ styles.colorWhite }>&copy; Taxi Coin Software 2018</Text>
        </View>
        
      </View>
    );
  }
}
export default Footer;
