import React, { Component } from 'react';
import {
  PixelRatio,
  Text,
  View,
  ScrollView,
  Image,
  Button,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  AsyncStorage, 
  Alert,
  
} from 'react-native';

import Footer from '../Footer/Footer';
import ImagePicker from 'react-native-image-picker';
import styles from './style';

class Car extends Component {
    static navigationOptions = { title: 'About your car'};
    constructor(props) {
      super(props);
      this.state = {
        ImageSource: null,
        driverId: null,
        valueColor: '',
        valueMark: '',
        valueModel: '',
        errorFields: false
      }
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
    
            this.setState({
  
              ImageSource: source
  
            });
          }
        });
    }
    handleSubmit() {
      if(this.state.valueMark === '' || this.state.valueMark === ' ') {
        this.setState({
            errorFields: true,
            valueMark: false
        })
    } else if(this.state.valueModel === '' || this.state.valueModel === ' ') {
        this.setState({
            errorFields: true,
            valueModel: false
        })
    } else if(this.state.valueColor === '' || this.state.valueColor === ' ') {
        this.setState({
            errorFields: true,
            valueColor: false
        })
    } else {
      fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/vehicles/driver/${this.state.driverId}`, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    number: '1',
                    model: this.state.valueModel,
                    brand: this.state.valueMark,
                    color: this.state.valueColor
                }),
            }).then((data) => {  
                if(data.ok === true) {
                    this.props.navigation.navigate('Map');
                } else {
                    return Alert.alert("Error!!! Try again");
                }
            })  
            .catch((error) => {
                Alert.alert(error);
            });
    }
  }
    componentDidMount() {
      AsyncStorage.getItem('driverId').then((value) => {
        this.setState({driverId: value});
      });
    }
    render() {
      return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ScrollView>
                <View style={styles.padding}>
                    {
                        this.state.errorFields ? <Text style={ styles.correctData}>Please enter correct data!!!</Text> : null
                    }
                    <Text style={ styles.colorWhite }>Enter the mark of your car: </Text>
                    <TextInput 
                      style={this.state.valueMark !== false ? [styles.heightInput, styles.borderColor, styles.input] : [styles.heightInput, styles.borderColorRed, styles.input]} 
                      placeholder="Mark of your car" 
                      autoFocus 
                      placeholderTextColor='rgba(225,225,225,0.7)'
                      onChangeText={(value) => this.setState({valueMark: value, errorFields: ''})}
                    />
                    <Text style={{color: 'white'}}>Enter the model of your car: </Text>
                    <TextInput 
                      style={this.state.valueModel !== false ? [styles.heightInput, styles.borderColor, styles.input] : [styles.heightInput, styles.borderColorRed, styles.input]} 
                      placeholderTextColor='rgba(225,225,225,0.7)'
                      placeholder='Model of your car' 
                      onChangeText={(value) => this.setState({valueModel: value, errorFields: ''})}
                    />
                    <Text style={{color: 'white'}}>Enter the color of your car: </Text>
                    <TextInput 
                      style={this.state.valueColor !== false ? [styles.heightInput, styles.borderColor, styles.input] : [styles.heightInput, styles.borderColorRed, styles.input]} 
                      placeholderTextColor='rgba(225,225,225,0.7)' 
                      placeholder='Color of your car' 
                      onChangeText={(value) => this.setState({valueColor: value, errorFields: ''})}
                    />
                    <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)} style={ styles.top }>
                        <View style={styles.ImageContainer}>
                        { this.state.ImageSource === null ? <Text>Take photo your car</Text> :
                            <Image style={styles.ImageContainer} source={this.state.ImageSource} />
                        }
                        </View>
                    </TouchableOpacity>
                    {
                        !this.state.ImageSource ? null : 
                        <View style={ styles.ImageCar }>
                        <Button color="white"  title="Next" onPress={this.handleSubmit.bind(this)} /> 
                        </View>
                    }
                </View>
                <View style={{top: 250}}>
                    <Footer />
                    <Text style={styles.privicyPolicy} onPress={() => this.props.navigation.navigate('Policy')}>Taxi Coin Privicy Policy</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
      );
    }
  }
export default Car;