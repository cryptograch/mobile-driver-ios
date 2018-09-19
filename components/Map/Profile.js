import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    AsyncStorage,
    TextInput,
    ActivityIndicator
  } from 'react-native';
  
  import ImagePicker from 'react-native-image-picker';
  import logo from '../../images/logo.png';
  import settingsImg from '../../images/Profile/Settings.png';
  import ProfileImg from '../../images/tabs/profile.png';
  import axios from 'axios';
  import styles from "./style/stylesProfile";

  class Profile extends Component {
    static navigationOptions = {
        title: 'Profile',
        tabBarIcon: () => (
          <Image
            source={ProfileImg}
            style={{height: 25, width: 25}}
          />
        ),
      }
      constructor(props) {
          super(props);
          this.state = {
              driverId: null,
              content: [],
              contentCar: [],
              ImageSource: null,
              ImageSourceCar: null,
              showInput: false,
              clientToken: null,
              valueMark: '',
              valueModel: '',
              valueColor: '',
              errorFields: '',
              ImgUrl: null,
              ImgUrlCar: null,
              myCash: 0,
              getMyInfo: true
          }
      }
      myCash() {
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/balance/tokens`, {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + this.state.clientToken,
          }
        })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            getMyInfo: false,
            myCash: response
          })
        });
      }
      getDriverImage(driverAuthToken) {
        AsyncStorage.getItem('saveDataUserPicture').then((value) => {
            var url = `http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/images/${value}`;
            var self = this;
            axios.get(url, { headers: { "Authorization": 'Bearer ' + driverAuthToken }, responseType:"blob" })
            .then((response) => {
                var reader = new window.FileReader();
                reader.readAsDataURL(response.data); 
                reader.onload = function() {
                    var imageDataUrl = reader.result;
                    self.setState({
                        ImgUrl: imageDataUrl
                    })
                }
            });
        });
      }
      getCarImage(driverAuthToken) {
        AsyncStorage.getItem('saveCarImage').then((value) => {
            var url = `http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/images/${value}`;
            var self = this;
            axios.get(url, { headers: { "Authorization": 'Bearer ' + driverAuthToken }, responseType:"blob" })
            .then((response) => {
                var reader = new window.FileReader();
                reader.readAsDataURL(response.data); 
                reader.onload = function() {
                    var imageDataUrl = reader.result;
                    self.setState({
                        ImgUrlCar: imageDataUrl
                    })
                }
            });
        })
      }
      getDriverCar(driverAuthToken) {
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/vehicles`, {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + driverAuthToken,
                }
            })
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    contentCar: response
                })
            })
      }
      getDriverInfo(driverId) {
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/accounts/drivers/${driverId}`)
            .then((response) => response.json())
            .then((response) => {
                AsyncStorage.setItem('saveDataUserPicture', response.profilePictureId);
                this.setState({
                    content: response
                })
            })
      }
      tick() {
          this.getDriverInfo(this.state.driverId);
          this.getDriverImage(this.state.clientToken);
          if(this.state.clientToken !== null) {
              this.myCash();
          }
      }
      componentDidMount() {
        AsyncStorage.getItem('saveDataUserToken').then((value) => {
            this.setState({
                clientToken: value
            })
            this.getDriverImage(value);
            this.getDriverCar(value);
            this.getCarImage(value);
        });
        AsyncStorage.getItem('driverId').then((value) => {
            this.setState({
                driverId: value
            });
            this.getDriverInfo(value);
            
        });
        this.interval = setInterval(() => this.tick(), 5000);
      }
      componentWillUnmount() {
        clearInterval(this.interval);
      }
      selectPhotoCar() {
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

              fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/vehicles/images',{
                  method: 'PUT',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'multipart/form-data',
                      'Authorization': 'Bearer ' + this.state.clientToken,
                  },
                  body: files
  
              })
              .then(resp => resp.json())
              .then(resp => {
                  AsyncStorage.setItem('saveCarImage', resp[0].imageId)
                  this.getCarImage(this.state.clientToken);
              }).catch(err => {
                  console.log(err)
              }) 
              this.setState({
                ImageSourceCar: source
              });
            }
          });
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


            fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/profilepicture',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + this.state.clientToken,
                },
                body: files

            })
            .then(resp => resp.json())
            .then(resp => {
                AsyncStorage.setItem('saveDataUserPicture', resp.imageId);
                this.getDriverImage(this.state.clientToken);
            }).catch(err => {
                console.log(err)
            }) 
            this.setState({
              ImageSource: source
            });
          }
        });
      }
      putCarInfo() {
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/vehicles`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.clientToken,
            },
            body: JSON.stringify({
                number: '1',
                model: this.state.valueModel,
                brand: this.state.valueMark,
                color: this.state.valueColor
            }),
        }).then((data) => {  
            if(data.ok === true) {
                console.log('true');
            } else {
                return Alert.alert("Error!!! Try again");
            }
        }).catch((error) => {
            Alert.alert(error);
        });
      }
      changeInfoCar() {
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
            this.putCarInfo();
            this.getDriverCar(this.state.clientToken);
            this.setState({
                showInput: false
            })
      }
      }
      handleChangeCar() {
        this.setState({
            showInput: !this.state.showInput
        })
      }
      render() {
          return(
            <View style={styles.container}>
                <View style={ styles.backgroundColor }>
                    <View style={styles.containerLogo}>
                        <Image source={logo} style={styles.width} />
                    </View>
                </View>
                <View>
                    <ScrollView style={ styles.height }>
                        <View style={ styles.marginTopBack }>
                            <View style={ styles.containerFontCar }>
                                <Text style={ styles.fontCar }>{this.state.content.firstName} {this.state.content.lastName}</Text>
                            </View>
                            <TouchableOpacity style={ styles.changePhoto } onPress={this.selectPhotoTapped.bind(this)}>
                                <Image source={ this.state.ImgUrl !== null ? {uri: this.state.ImgUrl, isStatic:true} : logo} style={styles.imgProfile} />
                            </TouchableOpacity>
                            {
                                !this.state.getMyInfo ? 
                                <View style={styles.myInfo}>
                                    <Text style={styles.fontSize}>City: <Text style={ styles.colorSilver }>{this.state.content.city}</Text></Text>
                                    <Text style={styles.fontSize}>Phone: <Text style={ styles.colorSilver }>{this.state.content.phoneNumber}</Text></Text>
                                    <Text style={styles.fontSize}>Email: <Text style={ styles.colorSilver }>{this.state.content.email}</Text></Text>
                                    <Text style={styles.fontSize}>My money: <Text style={ styles.colorSilver }>{this.state.myCash}</Text></Text>
                                </View> : <View style={[styles.myInfo, styles.marginTop, styles.marginLeft]}>
                                    <ActivityIndicator animating={this.state.getMyInfo} size="large" color="#17316E" />
                                </View>  
                            }
                            <View
                                style={ styles.horLine }
                            />
                            <View style={styles.padding}>
                                <View style={ styles.alignItems }>
                                    <Text style={ styles.fontCar }>Car</Text>
                                </View>
                                {
                                    this.state.showInput ? 
                                        <View style={ styles.alignItems }>
                                            {
                                                this.state.errorFields ? <Text style={ styles.colorRed }>Please enter correct data!!!</Text> : null
                                            }
                                            <TextInput style={this.state.valueMark !== null ? styles.changeInfo : [styles.changeInfo, styles.borderColorRed]} value={this.state.valueMark} onChangeText={(value) => this.setState({valueMark: value, errorFields: ''})} placeholder='Change mark' />
                                            <TextInput style={this.state.valueModel !== null ? styles.changeInfo : [styles.changeInfo, styles.borderColorRed]} value={this.state.valueModel} onChangeText={(value) => this.setState({valueModel: value, errorFields: ''})} placeholder="Change model" />
                                            <TextInput style={this.state.valueColor !== null ? styles.changeInfo : [styles.changeInfo, styles.borderColorRed]} value={this.state.valueColor} onChangeText={(value) => this.setState({valueColor: value, errorFields: ''})} placeholder="Change color" />
                                            <TouchableOpacity style={ styles.changeInfo } onPress={this.changeInfoCar.bind(this)}><Text style={ styles.colorWhite }>Change info</Text></TouchableOpacity>
                                            <TouchableOpacity style={ styles.cancel } onPress={this.handleChangeCar.bind(this)}><Text style={ styles.colorWhite }>Cancel</Text></TouchableOpacity>
                                        </View> : 
                                        null
                                }
                                <TouchableOpacity onPress={this.handleChangeCar.bind(this)}>
                                    <Text style={styles.fontSize}>Mark: <Text style={ styles.colorSilver }>{this.state.contentCar.brand}</Text></Text>
                                    <Text style={styles.fontSize}>Model: <Text style={styles.colorSilver}>{this.state.contentCar.model}</Text></Text>
                                    <Text style={styles.fontSize}>Color: <Text style={styles.colorSilver}>{this.state.contentCar.color}</Text></Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={ styles.changeCar } onPress={this.selectPhotoCar.bind(this)}>
                                    <Image source={ this.state.ImgUrlCar !== null ? {uri: this.state.ImgUrlCar, isStatic:true} : logo} style={styles.imgCar} />
                                </TouchableOpacity>
                                <View>
                                    <TouchableOpacity style={styles.SizeSettings} onPress={() => this.props.navigation.navigate('Settings')}>
                                        <View><Image style={ styles.sizeImg } source={settingsImg} /></View><Text style={ styles.changePurse }>Settings</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.SizeSettings} onPress={() => this.props.navigation.navigate('ChangePurse')}>
                                        <View><Image style={ styles.sizeImg } source={settingsImg} /></View><Text style={ styles.changePurse }>Change my purse</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                
                
            </View>
          );
      }
  }
  export default Profile;