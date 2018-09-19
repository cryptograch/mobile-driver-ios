

import React, {Component} from 'react';
import { 
  Text, 
  View, 
  Image,
  Button,
  AsyncStorage,
  Linking,
  PixelRatio
} from 'react-native';

import img from '../../images/Home/Home.jpg';
import logo from '../../images/logo.png';
import styles from './style';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      app: null
    }
  }
  componentDidMount() {
    let App = null;
    AsyncStorage.getItem('saveDataUserToken').then((value) => {
      if(value === null)
        console.log('1');
      else 
      this.props.navigation.navigate('Map')
    });
  }
  static navigationOptions = { title: 'Welcome', header: null };
  otherApp() {
    Linking.canOpenURL('app-settings:').then(supported => {

      console.log(`Settings url works`)
      Linking.openURL('app-settings:')
    }).catch(error => {
      console.log(`An error has occured: ${error}`)
    })

  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.marginTop}>
          <Image resizeMode="contain" style={styles.logo} source={logo} />
          <Text style={styles.welcome}>DRIVERS</Text>
        </View>
        <View style={styles.HomeImg}>
          <Image style={ styles.SizeImg} source={img} />
        </View>
        <View style={[styles.sizeButt, styles.Left]}>
          <Button 
            title="Sign in" 
            color='white'
            onPress={() => this.props.navigation.navigate('Signin')}
          />
        </View>
        <View style={[styles.sizeButt, styles.Right]}>
          <Button 
            title="Registration" 
            color='white' 
            onPress={() => this.props.navigation.navigate('Registration')}
          />
        </View>
        <View style={styles.linkApp}>
          <Text onPress={this.otherApp.bind(this)} style={styles.app}>Do you search app for users?</Text>
        </View>
        
      </View>
    );
  }
}

export default Home;