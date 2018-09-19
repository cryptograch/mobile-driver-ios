import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Button,
  AsyncStorage,
  TextInput,
  ScrollView,
  PixelRatio
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import logo from '../../images/logo.png';
import styles from './style';

class License extends Component {
  static navigationOptions = { title: 'Registration', header: null};
    constructor(props) {
      super(props);
      this.state = {
        ImageSource: null,
        clientToken: null,
        valueMonthFrom: '',
        valueYearFrom: '',
        valueDayTo: '',
        valueMonthTo: '',
        valueYearTo: '',
        valueDayFrom: '',
        showFields: true,
        emptyFields: null
      };
    }
    componentDidMount() {
      AsyncStorage.getItem('saveDataUserToken').then((value) => 
      {
        this.setState({
          clientToken: value
        })
      })
    }
    selectPhotoTapped() {
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
          skipBackup: true
        }
      };
      ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);
  
        if (response.didCancel) {
          console.log('User cancelled photo picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
          let source = { uri: response.uri };
          let files = new FormData();

          files.append("files", {uri: source.uri, name: 'image.jpg', type: 'multipart/form-data'})

          fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/documents/driverlicense/image',{
              method: 'PUT',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'multipart/form-data',
                  'Authorization': 'Bearer ' + this.state.clientToken,
              },
              body: files

          })
          .then(resp => {
              console.log("image uploaded")
          }).catch(err => {
              console.log(err)
          }) 
          this.setState({
            ImageSource: source
          });
        }
      });
    }
    putLicenseInfo() {
      fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/documents/driverlicense',{
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.clientToken,
        },
        body: JSON.stringify({
          dayFrom: this.state.valueDayFrom,
          yearFrom: this.state.valueYearFrom,
          monthFrom: this.state.valueMonthFrom,
          dayTo: this.state.valueDayTo,
          yearTo: this.state.valueYearTo,
          monthTo:this.state.valueMonthTo
        }),
      }).then(resp => {
          if(resp.ok === false)
            this.setState({
              showFields: true
            })
          else {
            this.setState({
              showFields: false
            })
          }
      }).catch(err => {
          console.log(err)
      })
    }
    handlePress() {
      if(this.state.valueDayFrom === '' || this.state.valueDayFrom === ' '){
        this.setState({
            emptyFields: true,
            valueDayFrom: null
        })
      } else if(this.state.valueMonthFrom === '' || this.state.valueMonthFrom === ' ' ){
              this.setState({
                  emptyFields: true,
                  valueMonthFrom: null
              })
      } else if(this.state.valueYearFrom === '' || this.state.valueYearFrom === ' '){
              this.setState({
                  emptyFields: true,
                  valueYearFrom: null
              })
      } else if(this.state.valueDayTo === '' || this.state.valueDayTo === ' '){
              this.setState({
                  emptyFields: true,
                  valueDayTo: null
              })
      } else if(this.state.valueMonthTo === '' || this.state.valueMonthTo === ' '){
              this.setState({
                  emptyFields: true,
                  valuePhoneNumber: null
              })
      } else if(this.state.valueYearTo === '' || this.state.valueYearTo === ' '){
              this.setState({
                  emptyFields: true,
                  valueYearTo: null
              })
      } else {
        this.putLicenseInfo();  
      }
    }
    handlePressNextPage() {
      AsyncStorage.removeItem('saveDataUserToken');
      this.props.navigation.navigate('Map');
    }
    render() {
      return (
        <ScrollView style={styles.container}>
          <View style={ styles.heightImg}>
            <Image resizeMode="contain" style={styles.logo} source={logo} />
          </View>
          {
            this.state.emptyFields ? 
              <Text style={ styles.colorRed }>Fields are empty!!!</Text>
              : null
          }
          {
            this.state.showFields === null ? 
            <Text style={ styles.colorRed }>Enter correct data!!!</Text> : null
          }
          {
            this.state.showFields ? 
            <View style={styles.orderPhoto}>
              <TextInput 
                keyboardType='numeric'
                style={
                  this.state.valueDayFrom !== null ?
                    [styles.input, styles.width] : 
                    [styles.borderColor, styles.input, styles.width]
                } 
                placeholder="Day of receipt of the driver's license" 
                onChangeText={(text) => this.setState({valueDayFrom: text, emptyFields: null})} 
                value={this.state.valueDayFrom} 
                placeholderTextColor='rgba(225,225,225,0.7)'
              />
              <TextInput 
                style={
                  this.state.valueMonthFrom !== null ? 
                    [styles.input, styles.width] : 
                    [styles.borderColor, styles.input, styles.width]
                } 
                keyboardType='numeric'
                placeholder="Month of receipt of the driver's license" 
                onChangeText={(text) => this.setState({valueMonthFrom: text, emptyFields: null})} 
                value={this.state.valueMonthFrom}  
                placeholderTextColor='rgba(225,225,225,0.7)'
              />
              <TextInput 
                style={
                  this.state.valueYearFrom !== null ? 
                    [styles.input, styles.width] : 
                    [styles.borderColor, styles.input, styles.width]
                } 
                keyboardType='numeric'
                placeholder="Year of receipt of the driver's license" 
                onChangeText={(text) => this.setState({valueYearFrom: text, emptyFields: null})} 
                value={this.state.valueYearFrom} 
                placeholderTextColor='rgba(225,225,225,0.7)'
              />
              <TextInput 
                style={
                  this.state.valueLastName !== null ?
                    [styles.input, styles.width] : 
                    [styles.borderColor, styles.input, styles.width]
                } 
                keyboardType='numeric'
                placeholder="Day of expiration" 
                onChangeText={(text) => this.setState({valueDayTo: text, emptyFields: null})} 
                value={this.state.valueDayTo} 
                placeholderTextColor='rgba(225,225,225,0.7)'
              />
              <TextInput 
                style={
                  this.state.valuePassword !== null ? 
                    [styles.input, styles.width] : 
                    [styles.borderColor, styles.input, styles.width]
                } 
                keyboardType='numeric'
                placeholder="Month of expiration" 
                onChangeText={(text) => this.setState({valueMonthTo: text, emptyFields: null})} 
                value={this.state.valueMonthTo}  
                placeholderTextColor='rgba(225,225,225,0.7)'
              />
              <TextInput 
                style={
                  this.state.valueRepeatPassword !== null ? 
                    [styles.input, styles.width] : 
                    [styles.borderColor, styles.input, styles.width]
                } 
                keyboardType='numeric'
                placeholder="Year of expiration" 
                onChangeText={(text) => this.setState({valueYearTo: text, emptyFields: null})} 
                value={this.state.valueYearTo} 
                placeholderTextColor='rgba(225,225,225,0.7)'
              />
              <View style={[styles.backgroundColorLightBlue, styles.width]}>
                <Button title="Next" color="white" onPress={this.handlePress.bind(this)} />
              </View>
            </View> : 
            <View>
            <View style={[styles.width, styles.marginTopPhoto]}>
              <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                <View style={styles.ImageContainer}>
                { this.state.ImageSource === null ? <Text>Take Photo your driver's License</Text> :
                  <Image style={styles.ImageContainer} source={this.state.ImageSource} />
                }
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.backgroundColorLightBlue, styles.width, {marginTop: 50}]}>
              <Button title="Next" color="white" onPress={this.handlePressNextPage.bind(this)} />
            </View>
          </View>
          }
        </ScrollView>
      );
    }
  
  }
export default License;