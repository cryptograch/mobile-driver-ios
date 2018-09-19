

import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  Image,
  Button,
  TextInput,
  ScrollView,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert,
  Linking,
  WebView
} from 'react-native';
import {QRscanner} from 'react-native-qr-scanner';

import CarouselNew from './Carousel';
import Footer from '../Footer/Footer';
import Loader from '../Loader/Loader';
import logo from '../../images/logo.png';
import Secure from '../../images/secure.jpg';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueEmail: '',
            valueFirstName: '',
            valueLastName: '',
            valuePassword: '',
            valuePhoneNumber: '',
            valueRepeatPassword: '',
            valueTown: '',
            valuePrivateKey: '',
            showFields: false,
            showModal: false,
            emptyFields: false,
            shortPass: false,
            loading: null,
            correctEmail: true,
            usedEmail: null,
            getQrCode: false,
            repeatScan: false,
            zoom: 0,
            flashMode: false,

        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextPage = this.handleNextPage.bind(this);
    }
  static navigationOptions = { title: 'Registration'};
  handleNextPage() {
    this.setState({
        loading: null
    });
    this.props.navigation.navigate('License');
  }
  handlePress() {
    let reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(reg.test(this.state.valueEmail))
        return(
            this.setState({
                showFields: true,
              })
        )
    else {
        this.setState({
            correctEmail: false,
          })
    }
  }
  registrationDriver() {
    fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/accounts/drivers', {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName: this.state.valueFirstName,
            lastName: this.state.valueLastName,
            password: this.state.valuePassword,
            email: this.state.valueEmail,
            phoneNumber: this.state.valuePhoneNumber,
            city: this.state.valueTown,
            privateKey: this.state.valuePrivateKey
        }),
    })
    .then((data) => data.json())
    .then((data) => {  
        
        if(data.CustomerRegistrationDto !== undefined) {
            this.setState({
                loading: null,
                usedEmail: true
            })
        }
        else if(data !== null) {
            this.getClientToken();
            AsyncStorage.setItem('driverId', data.id);
        }
        return data;  
    })  
    .catch((error) => {
        return error;
    });
  }
  handleSubmit(event) {
    if(this.state.valueEmail === '' || this.state.valueEmail === ' '){
        this.setState({
            emptyFields: true,
            valueEmail: null
        })
    } else if(this.state.valuePassword === '' || this.state.valuePassword === ' ' ){
            this.setState({
                emptyFields: true,
                valuePassword: null
            })
    } else if(this.state.valuePassword.length < 6) {
            this.setState({
                emptyFields: true,
                valuePassword: null,
                shortPass: true
            })
    } else if(this.state.valueFirstName === '' || this.state.valueFirstName === ' '){
            this.setState({
                emptyFields: true,
                valueFirstName: null
            })
    } else if(this.state.valueLastName === '' || this.state.valueLastName === ' '){
            this.setState({
                emptyFields: true,
                valueLastName: null
            })
    } else if(this.state.valueRepeatPassword !== this.state.valuePassword){
            this.setState({
                emptyFields: true,
                valueRepeatPassword: null
            })
    } else if(this.state.valuePhoneNumber === '' || this.state.valuePhoneNumber === ' '){
            this.setState({
                emptyFields: true,
                valuePhoneNumber: null
            })
    } else if(this.state.valueTown === '' || this.state.valueTown === ' '){
            this.setState({
                emptyFields: true,
                valueTown: null
            })
    }else if(this.state.valuePrivateKey === '' || this.state.valuePrivateKey === ' ' || this.state.valuePrivateKey.length !== 64){
        this.setState({
            emptyFields: true,
            valuePrivateKey: '1123'
        })
    } else {
        this.setState({ 
            showModal: true,
            emptyFields: false
        });
        this.registrationDriver();
        
    }
  }
  getClientToken() {
    fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Auth/driver/signuptoken', {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userName: this.state.valueEmail,
            password: this.state.valuePassword,
            
        }),
    })
    .then((data) => data.json())
    .then((data) => {  
        AsyncStorage.setItem('saveDataUserToken', data.auth_token);  
    })  
    .catch((error) => {
        return error;
    });
  }
  async getRequest() {
    this.setState({
      loading: true,
      usedEmail: false
    });

    let data = await this.handleSubmit();

    setTimeout(() => {
      this.setState({
        loading: false,
        answer: data,
      });
    }, 1500);
  }
  onRead(res) {
    this.setState({
        repeatScan: false
    })
    if(res.data.length === 64) {
        this.setState({
            valuePrivateKey: res.data,
            repeatScan: false,
        })
    } else {
        Alert.alert(
            'Error',
            'Key must have length 64!!!',
            [
                {text: 'Ok', onPress: () => this.setState({repeatScan: true})} 
            ],
            { cancelable: false })
        this.setState({
            repeatScan: false,
        })
    }
  }
  openApp() {
    Linking.canOpenURL('app-settings:').then(supported => {

      console.log(`Settings url works`)
      Linking.openURL('app-settings:')
    }).catch(error => {
      console.log(`An error has occured: ${error}`)
    })
  }
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ScrollView>
                <View style={{height: 100}}>
                    <Image resizeMode="contain" style={styles.logo} source={logo} />
                </View>
                <View style={styles.heightCarousel}>
                    <CarouselNew />
                </View>
                <View style={{height: 70, paddingLeft: 25, marginTop: -25}}>
                    {
                        this.state.emptyFields ? 
                        this.state.shortPass ? <Text style={ styles.colorRed }>Password is very short!!!</Text> :
                        this.state.valueRepeatPassword === null ? 
                        <Text style={styles.colorRed}>Passwords are different!!!</Text> : 
                        <Text style={styles.colorRed}>Fields are empty!!!</Text> : 
                        null
                    }
                    {
                        this.state.correctEmail ? null : <Text style={styles.colorRed}>Email not correct</Text>
                    }
                    {
                        this.state.usedEmail ? <Text style={styles.colorRed}>Email already use!!!</Text> : null
                    }
                    {
                        this.state.valuePrivateKey === '1123' ? <Text style={styles.colorRed}>Key must has length 64!!!</Text> : null
                    }
                </View>
                <View style={[styles.paddingText, styles.marginTop]}>
                    <TextInput 
                        style={
                            this.state.valueEmail !== null && this.state.correctEmail ?
                            [styles.input] : 
                            [styles.input, styles.borderColor]
                        } 
                        placeholder="Enter your email" 
                        autoCapitalize = 'none'
                        onChangeText={(text) => this.setState({valueEmail: text, correctEmail: true, emptyFields: false})} 
                        value={this.state.valueEmail} 
                        placeholderTextColor='rgba(253,253,253,0.7)'/>
                </View>
                <Loader loading={this.state.loading} />
                <View style={[styles.marginTop, {paddingLeft: 15, paddingRight: 15}]}>
                    {
                        !this.state.showFields ?  
                        <View style={{backgroundColor: '#faa71a', borderRadius: 15, borderColor: 'white', borderWidth: 1, padding: 4}}>
                            <Button title="Next" color="white" onPress={this.handlePress.bind(this)} />
                        </View> : 
                        <View>
                            
                            {
                                !this.state.loading && this.state.loading !== null && !this.state.usedEmail ?
                                <Modal 
                                    transparent={true}
                                    visible={this.state.showModal}
                                >
                                    <TouchableOpacity 
                                        style={styles.containerTouchableOpacity}
                                        activeOpacity={1} 
                                    >
                                        <ScrollView 
                                            directionalLockEnabled={true} 
                                            contentContainerStyle={styles.containerTouchableOpacity}
                                        >
                                            <TouchableWithoutFeedback>
                                                <View style={styles.containerModalWindow}>
                                                    <Text>Hello {this.state.valueFirstName} {this.state.valueLastName}!!!</Text>
                                                    <Text>Please confirm your account by this ref <Text style={{color: 'blue'}} onPress={this.openApp.bind()}>link</Text> or log in to your email and confirm your account</Text>
                                                    <View>
                                                        <Image source={Secure} style={{width: 200, height: 150}} />
                                                    </View>
                                                    <TouchableOpacity onPress={this.handleNextPage} style={[styles.backgroundColorLightBlue, {width: '100%', padding: 15, alignItems: 'center', top: '5%'}]}>
                                                        <Text style={{color: 'white'}}>Confirm account later</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </ScrollView>
                                    </TouchableOpacity>   
                                </Modal> : null
                            }
                            <View style={[styles.marginTopForm]}>
                                <TextInput 
                                    style={ 
                                        this.state.valueFirstName !== null ? 
                                        [styles.input, styles.widthInput] : 
                                        [styles.borderColor, styles.input, styles.widthInput]
                                    } 
                                    placeholder="First name" 
                                    onChangeText={(text) => this.setState({valueFirstName: text, emptyFields: ''})} 
                                    value={this.state.valueFirstName} 
                                    placeholderTextColor='rgba(253,253,253,0.7)'
                                />
                                <TextInput 
                                    style={
                                        this.state.valueLastName !== null ?
                                        [styles.input, styles.widthInput, styles.locatRight] : 
                                        [styles.borderColor, styles.input, styles.widthInput, styles.locatRight]
                                    } 
                                    placeholder="Last name" 
                                    onChangeText={(text) => this.setState({valueLastName: text, emptyFields: ''})} 
                                    value={this.state.valueLastName} 
                                    placeholderTextColor='rgba(253,253,253,0.7)'
                                />
                                <TextInput 
                                    style={
                                        this.state.valuePassword !== null ? 
                                        [styles.input, styles.marginTop] : 
                                        [styles.borderColor, styles.input, styles.marginTop]
                                    } 
                                    placeholder="Password" 
                                    onChangeText={(text) => this.setState({valuePassword: text, shortPass: false, emptyFields: ''})} 
                                    value={this.state.valuePassword} 
                                    secureTextEntry={true} 
                                    placeholderTextColor='rgba(253,253,253,0.7)'
                                />
                                <TextInput 
                                    style={
                                        this.state.valueRepeatPassword !== null ? 
                                        [styles.input, styles.margin] : 
                                        [styles.borderColor, styles.input, styles.margin]
                                    } 
                                    placeholder="Repeare password" 
                                    onChangeText={(text) => this.setState({valueRepeatPassword: text, emptyFields: ''})} 
                                    value={this.state.valueRepeatPassword} 
                                    secureTextEntry={true} 
                                    placeholderTextColor='rgba(253,253,253,0.7)'
                                />
                                <TextInput 
                                    style={
                                        this.state.valuePhoneNumber !== null ? 
                                        [styles.input, styles.marginTopPhone] : 
                                        [styles.borderColor, styles.input, styles.marginTopPhone]
                                    } 
                                    placeholder="Phone number"
                                    keyboardType='numeric' 
                                    onChangeText={(text) => this.setState({valuePhoneNumber: text})} 
                                    value={this.state.valuePhoneNumber}
                                    placeholderTextColor='rgba(253,253,253,0.7)'
                                />
                                <TextInput 
                                    style={
                                        this.state.valueTown !== null ? 
                                        [styles.input, styles.marginTown] : 
                                        [styles.borderColor, styles.input, styles.marginTown]
                                    } 
                                    placeholder="Town" 
                                    onChangeText={(text) => this.setState({valueTown: text})} 
                                    value={this.state.valueTown} 
                                    placeholderTextColor='rgba(253,253,253,0.7)'
                                />
                                
                                {
                                    this.state.getQrCode ?  this.state.valuePrivateKey.length !== 64 ? 
                                        <View style={[styles.marginTop, styles.widthQrScanner]}>
                                            <QRscanner onRead={(data) => this.onRead(data)} isRepeatScan={this.state.repeatScan} flashMode={this.state.flashMode} zoom={this.state.zoom} finderY={50}/>
                                            <TouchableOpacity onPress={() => this.setState({valuePrivateKey: '', repeatScan: true})} style={[{backgroundColor: '#faa71a', borderRadius: 15, borderColor: 'white', borderWidth: 1, padding: 4}, {justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 5}]}>
                                                <Text style={{color: 'white', fontSize: 15}}> Try again</Text>
                                            </TouchableOpacity>
                                        </View> : 
                                        <TextInput 
                                            style={[styles.input, styles.marginTown]} 
                                            placeholder="Town" 
                                            value={this.state.valuePrivateKey} 
                                            editable={false} 
                                            placeholderTextColor='rgba(253,253,253,0.7)'
                                        />
                                        : <TouchableOpacity onPress={() => this.setState({getQrCode: true})} style={[{backgroundColor: '#faa71a', borderRadius: 15, borderColor: 'white', borderWidth: 1, padding: 4}, {justifyContent: 'center', alignItems: 'center', padding: 10}]}>
                                            <Text style={{color: 'white', fontSize: 15}}>Scan QR Code</Text>
                                        </TouchableOpacity>
                                }
                                <View style={[{backgroundColor: '#faa71a', borderRadius: 15, borderColor: 'white', borderWidth: 1, padding: 4}, {marginTop: 5}]}>
                                    <Button title="Next" color="white" onPress={() => this.getRequest()} />
                                </View>
                                
                            </View>
                        </View>
                    }
                    <Text style={{marginTop: 15, color: 'white'}}>Do you have account? <Text style={{color: '#faa71a',}} onPress={() => this.props.navigation.navigate('Signin')}>Sign in</Text></Text>
                </View>
                <View style={!this.state.showFields ? {bottom: 0, width: '100%', top: '5%', height: 100} : {marginVertical: '10%', marginTop: -30} }>
                    <Footer />
                    <Text style={!this.state.showFields ? [styles.privicyPolicy] : {bottom: 0, width: '100%', height: 100, top: 60, marginLeft: 25, color: '#faa71a' }} onPress={ () => {Linking.openURL('https://devtaxiapp.herokuapp.com/policy')}}>Taxi Coin Privicy Policy</Text>
                </View>
                <View style={{top: 50, height: 50}}></View>
            </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2b2929',
    },
    colorRed: {color: 'red'},
    widthQrScanner: {
        width: '100%',
        marginTop: 50,
        height: 250
    },
    containerTouchableOpacity: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerModalWindow: {
        width: 300,
        backgroundColor: 'white',
        height: 300,
        padding: 15,
        alignItems: 'center',
        borderRadius: 15
    },
    marginTopForm: {
        top: -10
    },
    margin: {
        marginTop: -40
    },
    marginTown: {
        marginTop: 5
    },
    welcome: {
        color: 'white',
        fontSize: 30
    },
    locatRight: {
        alignSelf: 'flex-end', 
        top: -50
    },
    widthInput: {
        width: '50%',
        borderWidth: 1,
    },
    borderColor: {
        borderWidth: 3,
        borderColor: 'red'
    },
    paddingText: {
        padding: 15
    },
    paddingTextContent: {
        padding: 30
    },
    fontSize: {
        fontSize: 35
    },
    textCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    marginTop: {
        top: -45,
    },
    marginTopPhone: {
        top: 2
    },
    heightCarousel: {
        height: 250
    },
    heightInput: {
        height: 40,
        backgroundColor: 'white',
        paddingLeft: 15
    },
    backgroundColorLightBlue: {
        backgroundColor: '#2980b6',
        
    },
    privicyPolicy: {
        left: 25,
        top: 50,
        color: '#faa71a',
    },
    input:{
        height: 40,
        backgroundColor: 'rgba(225,225,225,0.2)',
        marginBottom: 10,
        padding: 10,
        color: '#fff',
        borderWidth: 1,
    },
    logo: {
        position: 'absolute',
        width: '100%',
        height: 100
    },
});


export default Registration;
