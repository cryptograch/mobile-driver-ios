

import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  Image,
  Button
} from 'react-native';

import img from '../../images/Home/Home.jpg';

class Home extends Component {
  static navigationOptions = { title: 'Privicy Policy'};
  otherApp() {
    console.log('Other App');
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentHeader}>
            <Text>Taxi Coin Privicy Policy</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        padding: 25
    },
    contentHeader: {
        justifyContent: 'center',
        alignItems: 'center',
    }
  
});


export default Home;
