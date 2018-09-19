import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  View, 
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  AsyncStorage,
  Linking
} from 'react-native';
import logo from '../../images/logo.png';
import Loader from '../Loader/Loader';

export default class Signin extends Component {
  static navigationOptions = { title: 'Login' };
  constructor(props) {
    super(props);
    this.state = {
      answer: '',
      data: null,
      loading: false,
      valuePassword: '',
      valueLogin: '',
      modalVisible: false
    }
    this.signin = this.signin.bind(this);
  }
  async signin(event) {
    fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Auth/driver', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: this.state.valueLogin,
        password: this.state.valuePassword
      }),
    })
    .then((data) => data.json())
    .then((data) => {  
      if(data.auth_token !== undefined) { 
        AsyncStorage.setItem('driverId', data.id);
        AsyncStorage.setItem('saveDataUserToken', data.auth_token);
        AsyncStorage.setItem('saveRefreshToken', data.refresh_token);
        return( this.props.navigation.navigate('Map'));
      } else { return
        this.setState({
          answer: false
        }) 
      }
    }).catch((error) => {
      this.setState({
        answer: error.ok
      })
    });
    this.setState({
      valueLogin: '',
      valuePassword: ''
    });
  }

  async getRequest() {
    this.setState({
      loading: true
    });
    let data = this.signin();
    setTimeout(() => {
      this.setState({
        loading: false,
        answer: data._55
      });
    }, 2500);
  }
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <Loader loading={this.state.loading} />
          <View style={styles.loginContainer}>
              <Image resizeMode="contain" style={styles.logo} source={logo} />
          </View>
         {
           this.state.answer === '' ? null : 
           this.state.answer ? 
           null :
            <Text style={styles.colorRed}>Email, password are wrong or Email not confirmed!!!</Text>
         }
        <TextInput 
              autoCapitalize = 'none' 
              style={[styles.input, this.state.answer === '' ? null : this.state.answer ? null : styles.borderRed]} 
              autoCorrect={false}  
              // autoFocus 
              onChangeText={(text) => this.setState({valueLogin: text, answer: ''})} 
              value={this.state.valueLogin}  
              placeholder='Email' 
              placeholderTextColor='rgba(253,253,253,0.7)'/>
        <TextInput 
              autoCapitalize = 'none' 
              style={[styles.input, this.state.answer === '' ? null : this.state.answer ? null : styles.borderRed]} 
              onChangeText={(text) => this.setState({valuePassword: text, answer: ''})} 
              autoCorrect={false} 
              value={this.state.valuePassword} 
              secureTextEntry 
              placeholder='Password' 
              placeholderTextColor='rgba(253,253,253,0.7)'/>
        <TouchableOpacity style={styles.buttonContainer} 
          onPress={() => this.getRequest()}>
             <Text  style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity> 
        <Text style={[styles.marginTop, styles.colorWhite]} onPress={ () => {Linking.openURL('https://devtaxiapp.herokuapp.com/forgot-password')}}>Forgot password?</Text>
        <View style={{height: 25}}></View>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  marginTop: {
    marginTop: 15
  },
  colorTextSilver: {
    color: '#A8AEB1'
  },
  backgroundColorLightBlue: {
    backgroundColor: '#33BBFF'
  }, 
  colorWhite: {
    color: '#faa71a'
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },
  input:{
    height: 40,
    backgroundColor: 'rgba(225,225,225,0.2)',
    marginBottom: 10,
    padding: 10,
    color: '#fff'
  },
  buttonContainer:{
    backgroundColor: '#faa71a',
    paddingVertical: 15,
    borderColor: 'white',
    borderWidth: 1,
  },
  buttonText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700'
  },
  container: {
    flex: 1,
    backgroundColor: '#2b2929',
    padding: 15,
  },
  loginContainer:{
      alignItems: 'center',
      flexGrow: 1,
      justifyContent: 'center'
  },
  logo: {
    position: 'absolute',
    width: 300,
    height: 100
  },
  buttonContainer1:{
    backgroundColor: '#2980b6',
  },
  buttonText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700'
  },
  hideList: {
    position: 'absolute',
    height: '7%', 
    width: '100%',
    top: '93%',
  },
  borderRed: {
    borderColor: 'red',
    borderWidth: 3
  },
  colorRed: {
    color: 'red'
  },
});
