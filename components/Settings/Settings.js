import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    PixelRatio,
    TouchableOpacity,
    Image,
    TouchableHighlight,
    Modal,
    ScrollView,
    AsyncStorage,
    TextInput,
    Alert,

  } from 'react-native';

  import ImageExit from '../../images/Profile/Exit.jpg';
  import Loader from '../Loader/Loader';

  class Settings extends Component {
    static navigationOptions = { title: 'Settings'};
      constructor(props) {
          super(props);
          this.state = {
            driverId: null,
            loading: false,
            clientToken: null,
            valueFirstName: '',
            valueLastName: '',
            valueCity: '',
            valuePhoneNumber: '',
            valueCurrentPass: '',
            valueNewPass: '',
            errorFields: false,
          }

      }
      async testInfo() {
        if(this.state.valueFirstName === '' || this.state.valueFirstName === ' ') {
            this.setState({
                errorFields: true,
                valueFirstName: false
            })
        } else if(this.state.valueLastName === '' || this.state.valueLastName === ' ') {
            this.setState({
                errorFields: true,
                valueLastName: false
            })
        } else if(this.state.valueCity === '' || this.state.valueCity === ' ') {
            this.setState({
                errorFields: true,
                valueCity: false
            })
        } else if(this.state.valuePhoneNumber === '' || this.state.valuePhoneNumber === ' ') {
            this.setState({
                errorFields: true,
                valuePhoneNumber: false
            })
        } else if(this.state.valueCurrentPass === '' || this.state.valueCurrentPass === ' ') {
            this.setState({
                errorFields: true,
                valueCurrentPass: false
            })
        } else if(this.state.valueNewPass === '' || this.state.valueNewPass === ' ') {
            this.setState({
                errorFields: true,
                valueNewPass: false
            })
        } else {
            this.setState({
                errorFields: false
            });
            fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/accounts/drivers/${this.state.driverId}`, {
                method: 'PUT',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.clientToken,
                },
                body: JSON.stringify({
                    phoneNumber: this.state.valuePhoneNumber,
                    currentPassword: this.state.valueCurrentPass,
                    newPassword: this.state.valueNewPass,
                    city: this.state.valueCity,
                    firstName: this.state.valueFirstName,
                    lastName: this.state.valueLastName
                }),
            }).then((data) => {  
                if(data.ok === true) {
                    this.props.navigation.navigate('Profile');
                } else {
                    return Alert.alert("Error!!! Try again");
                }
            })  
            .catch((error) => {
                Alert.alert(error);
            });
        }
        
      }
      async onChangeInformation() {
        this.setState({
            loading: true
          });
      
          let data = this.testInfo();
          // console.log(data);
          setTimeout(() => {
            this.setState({
              loading: false,
              answer: data._55
            });
          }, 2500);
      }
      async clearInformation() {
        AsyncStorage.removeItem('myTrip');
        AsyncStorage.removeItem('driverId');
        AsyncStorage.removeItem('saveDataUserToken');
        this.props.navigation.navigate('Home');

      }
      componentDidMount() {
        AsyncStorage.getItem('driverId').then((value) => this.setState({driverId: value}));
        AsyncStorage.getItem('saveDataUserToken').then((value) => this.setState({clientToken: value}));
      }

      render() {
          return(
            <View style={styles.conteiner}>
                <Loader loading={this.state.loading} />
                <Text>Change information</Text>
                {
                    this.state.errorFields ? <Text style={{color: 'red', margin: 15}}>Please enter correct data!!!</Text> : null
                }
                <TextInput 
                    onChangeText={(value) => {this.setState({valueFirstName: value, errorFields: ''})}} 
                    value={this.state.valueFirstName} 
                    placeholder="First Name" 
                    style={this.state.valueFirstName !== false ? styles.successField : [styles.successField, styles.errorField]} 
                />
                <TextInput 
                    onChangeText={(value) => {this.setState({valueLastName: value, errorFields: ''})}} 
                    value={this.state.valueLastName} 
                    placeholder="Last Name" 
                    style={this.state.valueLastName !== false ? styles.successField : [styles.successField, styles.errorField]} 
                />
                <TextInput 
                    onChangeText={(value) => {this.setState({valueCity: value, errorFields: ''})}} 
                    value={this.state.valueCity} 
                    placeholder="City" 
                    style={this.state.valueCity !== false ? styles.successField : [styles.successField, styles.errorField]} 
                />
                <TextInput 
                    onChangeText={(value) => {this.setState({valuePhoneNumber: value, errorFields: ''})}} 
                    value={this.state.valuePhoneNumber} 
                    placeholder="Phone Number" 
                    style={this.state.valuePhoneNumber !== false ? styles.successField : [styles.successField, styles.errorField]}  
                />
                <TextInput 
                    onChangeText={(value) => {this.setState({valueCurrentPass: value, errorFields: ''})}} 
                    value={this.state.valueCurrentPass} 
                    placeholder="Current password" 
                    style={this.state.valueCurrentPass !== false ? styles.successField : [styles.successField, styles.errorField]}  
                />
                <TextInput 
                    onChangeText={(value) => {this.setState({valueNewPass: value, errorFields: ''})}} 
                    value={this.state.valueNewPass} 
                    placeholder="New password" 
                    style={this.state.valueNewPass !== false ? styles.successField : [styles.successField, styles.errorField]} 
                />

                <TouchableOpacity onPress={() => {this.onChangeInformation()}} style={{backgroundColor: 'white', borderRadius: 15, width: 300, justifyContent: 'center', padding: 10, marginTop: 25}}>
                    <Text style={{ paddingLeft: 35, fontSize: 20, color: '#faa71a' }}>Change own information</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.clearInformation()}} style={{backgroundColor: 'white', borderRadius: 15, width: 300, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 25}}>
                    <Image source={ImageExit} style={{width: 25, height: 25, marginRight: 35,}} />
                    <Text style={{position: 'absolute', paddingLeft: 35, fontSize: 25, color: 'red'}}>Exit</Text>
                </TouchableOpacity>
            </View>
          );
      }
  }

  const styles = StyleSheet.create({
    conteiner: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    successField: {
        width: 300, 
        paddingLeft: 15, 
        backgroundColor: 'white', 
        borderRadius: 15, 
        padding: 10,
        marginTop: 15
    },
    errorField: {
        borderColor: 'red',
        borderWidth: 2
    }
  });
  export default Settings;