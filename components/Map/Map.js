import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Alert,
  Keyboard,
  AppState
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import mapImg from '../../images/tabs/map.jpg'
import finishTrip from '../../images/Map/finishTrip.png';
import markerImg from '../../images/Map/marker.png';
import geolib from 'geolib';
import Loader from '../Loader/Loader';
import * as signalR from '@aspnet/signalr';
import styles from './style/styleMap';

class Map extends React.Component {
  static navigationOptions = {
    title: 'Map',
    tabBarIcon: () => (
      <Image
        source={mapImg}
        style={{height: 25, width: 25}}
      />
    ),
  }
    constructor(props) {
        super(props);
        this.hubConnection = null;
        this.state = { 
          seconds: 0,
          error: null,
          content: [],
          customerLatitudeFrom: 0,
          customerLongitudeFrom: 0,
          customerLatitudeTo: 0,
          customerLongitudeTo: 0,
          myRoute: false,
          clientToken: null,
          driverLatitude: 49.229058,
          driverLongitude: 28.426778,
          distanceObject: null,
          startTrip: '',
          newTrip: null,
          begin: false,
          firstMarker: true,
          loading: false,
          statusInd: false,
          mySignalR: null,
          ind: 0,
          postRout: false
        }
      }
      getDistanceToObject(data) {
        if(data.ok === true) {
          let distance = geolib.getDistance(
            {latitude: this.state.driverLatitude, longitude: this.state.driverLongitude},
            {latitude: newTrip.from.latitude, longitude: newTrip.from.longitude}
          );
          this.setState({
            distanceObject: distance/1000,
            begin: true
          })
        } else {
          if(!this.state.begin && this.state.begin !== null) {
            let distance = geolib.getDistance(
              {latitude: this.state.driverLatitude, longitude: this.state.driverLongitude},
              {latitude: newTrip.to.latitude, longitude: newTrip.to.longitude}
            );
            this.setState({
              distanceObject: distance/1000,
              myRoute: true
            })
          }
        }
      }
      putDriverLocation() {
              fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips/driverlocation`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.clientToken,
                },
                body: JSON.stringify({
                  latitude: this.state.driverLatitude, 
                  longitude: this.state.driverLongitude
                }),
              })
                .then((data) => {  
                  this.setState({
                    statusInd: true,
                    ind: this.state.ind + 1
                  })
                })  
                .catch((error) => {
                    return error;
                });
      }
      // getCustomersRouts(newTrip) {
      //   fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips/taketrip?customerId=${newTrip.customerId}`, {
      //     method: 'POST',
      //     credentials: 'include',
      //     headers: {
      //       Accept: 'application/json',
      //       'Content-Type': 'application/json',
      //       'Authorization': 'Bearer ' + this.state.clientToken,
      //     },
      //   })
      //   .then((data) => {
      //     if(data.ok === true) {
      //       this.setState({
      //         statusInd: true
      //       })
      //     }
      //   })  
      //   .catch((error) => {
      //     return error;
      //   });
      // }
      getRout() {
        AsyncStorage.getItem('myTrip').then((res) => {
          if(res === null)
            console.log('My trip false');
          else {
            let newTrip = JSON.parse(res);
            this.putDriverLocation();
            this.setState({
              newTrip: newTrip,
              customerLatitudeFrom: newTrip.from.latitude,
              customerLongitudeFrom: newTrip.from.longitude,
              customerLatitudeTo: newTrip.to.latitude,
              customerLongitudeTo: newTrip.to.longitude,
              myRoute: true,
              statusInd: true
            });
            if(this.state.startTrip === '' || this.state.startTrip === undefined) {
              this.setState({
                startTrip: true
              })
            }
            if(this.state.distanceObject === null) {
              this.setState({
                distanceObject: newTrip.distance/1000
              })
            }
            // this.getCustomersRouts(newTrip);
          }
        })
      }
      putLocationsDrivers() {
        fetch('http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/location/driver', {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.state.clientToken,
            },
            body: JSON.stringify({
              latitude: this.state.driverLatitude,
              longitude: this.state.driverLongitude
            }),
        }).then((data) => {  
            if(data.ok === true) {
            } else {
                AsyncStorage.getItem('saveRefreshToken').then((res) => 
                  fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Auth/refreshtoken?refreshToken=${res}`, {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
                  })
                  .then((dataRefreshToken) => dataRefreshToken.json())
                  .then((dataRefreshToken) => {
                    this.setState({
                      clientToken: dataRefreshToken.auth_token
                    });
                    AsyncStorage.setItem('saveDataUserToken', dataRefreshToken.auth_token);
                    AsyncStorage.setItem('saveRefreshToken', dataRefreshToken.refresh_token);
                  })
              )}
        })  
        .catch((error) => {
            this.setState({
              answer: error.ok
            })
        });
      }
      postRout() {
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips/updateroute`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.clientToken,
        },
        body: JSON.stringify({
          latitude: this.state.driverLatitude, 
          longitude: this.state.driverLongitude
        }),
        })
        .then((data) => {  
          console.log(data);
        })  
        .catch((error) => {
            return error;
        });
      }
      tripStatus() {
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips/driver/tripstatus`, {
          method: 'GET',
          withCredentials: true,
          credentials: 'include',
          headers: {
              'Authorization': 'Bearer ' + this.state.clientToken,
          }
        })
        .then((response) => {
          if(response.ok === false) {
            this.setState({
              statusInd: false,
              ind: 0
            })
            Alert.alert(
              'Trip is finish',
              "Sorry but customer don't want to continue trip!",
              [
                  {text: 'Ok', onPress: () => {
                    AsyncStorage.removeItem('myTrip');
                    this.setState({
                      begin: false,
                      startTrip: '',
                      myRoute: false,
                      distanceObject: null,
                      tripIndicator: false,
                      newTrip: null,
                      statusInd: false,
                      ind: 0,
                      postRout: false
                    })
                  }} 
              ],
              { cancelable: false });
          }
          
        });
      }
      tick() { 
        this.getRout();
        if(this.state.postRout === true ) {
          this.postRout();
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
              this.setState({
                driverLatitude: position.coords.latitude,
                driverLongitude: position.coords.longitude,
                error: null,
              });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
        this.putLocationsDrivers();
        this.getCustomers();
        if(this.state.statusInd === true && this.state.ind >= 4) {
          this.tripStatus();
        }
      }
      getCustomers() {
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips?Longitude=${this.state.driverLongitude}&Latitude=${this.state.driverLatitude}`, {
          method: 'GET',
          withCredentials: true,
          credentials: 'include',
          headers: {
              'Authorization': 'Bearer ' + this.state.clientToken,
          }
        })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            content: response
          })
        })
        this.setState(prevState => ({
          seconds: prevState.seconds + 1
        }));
      }
      async componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        Keyboard.dismiss();
        AsyncStorage.getItem('saveDataUserToken').then( async (value) => 
        {
          if(value === null || value === undefined) {
            Alert.alert(
              'Error',
              'You must confirm your email or restart your app and Signin!!!',
              [
                {text: 'Ok', onPress: () => this.props.navigation.navigate('Home')} 
              ],
              { cancelable: false }
            );
          }
          let hubUrl = 'http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/route';
              this.hubConnection = new signalR.HubConnectionBuilder()
              .withUrl(hubUrl, {
                accessTokenFactory: () => {
                  return value;
                }
              })
              .configureLogging(signalR.LogLevel.Information).build();
              try {
                await this.hubConnection.start();
              } catch (err) {
                console.log(err);
              }
              this.hubConnection.invoke('ConnectDriver');
          this.setState({clientToken: value})
        });
        
        this.interval = setInterval(() => this.tick(), 5000);
      }
      _handleAppStateChange (nextAppState) {
        
      }
      componentWillUnmount() {
        Keyboard.dismiss(); 
        clearInterval(this.interval);
        AppState.removeEventListener('change', this._handleAppStateChange);
      }
      componentWillMount() {
        Keyboard.dismiss(); 
      }
      startTrip() {
        this.setState({
          postRout: true
        })
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips/starttrip`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.clientToken,
        },
        body: JSON.stringify({
          latitude: this.state.customerLatitudeFrom, 
          longitude: this.state.customerLongitudeFrom
        }),
        })
        .then((data) => {  
          if(data.ok === true) {
            this.setState({
              startTrip: false,
            })
          } 
          else {
            Alert.alert('Try again');
          }
          
        })  
        .catch((error) => {
            return error;
        });
      }
      finishTrip() {
        this.setState({
          loading: true, 
          postRout: false
        })
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips/finishtrip`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.clientToken,
        },
        body: JSON.stringify({
          latitude: this.state.driverLatitude, 
          longitude: this.state.driverLongitude
        }),
        })
        .then((data) => data.json())
        .then((data) => {  
          AsyncStorage.removeItem('myTrip');
          this.setState({
            begin: false,
            startTrip: '',
            myRoute: false,
            distanceObject: null,
            newTrip: null,
            loading: false,
            ind: 0
          })
        })  
        .catch((error) => {
            return error;
        });
      }
      render() {
        return (
          <View style={styles.container}>
            <Loader loading={this.state.loading} />
            <View style={[styles.size]}>
              <MapView
                style={ styles.mapStyle }
                showsUserLocation={true}
                followUserLocation={true}
                showsMyLocationButton={true}
                initialRegion={{
                  latitude: this.state.driverLatitude,
                  longitude: this.state.driverLongitude,
                  latitudeDelta: 0.0043,
                  longitudeDelta: 0.0025,
                }}
              >
                {
                  this.state.content.map((item, index) => 
                      <Marker
                        key={index}
                        coordinate={{latitude: item.from.latitude,
                          longitude: item.from.longitude}}
                        title={item.firstName}
                        description={item.lastName}
                      >
                        <Image source={markerImg} style={ styles.sizeMarkers } />
                      </Marker>
                  )
                }
                { 
                  this.state.myRoute ? 
                  this.state.startTrip ? 
                    <MapViewDirections
                      origin={{latitude: this.state.driverLatitude, longitude: this.state.driverLongitude}}
                      destination={{latitude: this.state.customerLatitudeFrom, longitude: this.state.customerLongitudeFrom}}
                      strokeWidth={3}
                      strokeColor={'red'}
                      apikey={'AIzaSyDoC_s0xk5gGJEmu0BzIpRTWt4LCFcX8og'}
                    /> 
                    : 
                    <MapViewDirections
                      origin={{latitude: this.state.driverLatitude, longitude: this.state.driverLongitude}}
                      destination={{latitude: this.state.customerLatitudeTo, longitude: this.state.customerLongitudeTo}}
                      strokeWidth={3}
                      strokeColor={'red'}
                      apikey={'AIzaSyDoC_s0xk5gGJEmu0BzIpRTWt4LCFcX8og'}
                    />
                  : null
                }
                { 
                  this.state.myRoute ?
                    this.state.startTrip ?
                      <Marker
                        coordinate={{latitude: this.state.customerLatitudeFrom,
                          longitude: this.state.customerLongitudeFrom}}
                        title={"Start trip"}
                        description={"Start trip"}
                      >
                        <Image source={markerImg} style={ styles.sizeMarkers } />
                      </Marker>
                  : 
                    <Marker
                        coordinate={{latitude: this.state.customerLatitudeTo,
                          longitude: this.state.customerLongitudeTo}}
                        title={"Finish trip"}
                        description={"Finish trip"}
                      >
                        <Image source={finishTrip} style={ styles.sizeMarkers } />
                      </Marker>
                  : null
                }
                  
              </MapView>
              {
                this.state.distanceObject !== null && this.state.distanceObject <= 0.1 ? 
                this.state.startTrip ? 
                <View style={ styles.containerStartTrip }>
                <TouchableOpacity
                    onPress={this.startTrip.bind(this)}
                    style={ styles.containerStartButt }
                  >
                    <Text style={ styles.colorWhite }>Start Trip</Text>
                  </TouchableOpacity> 
                </View> 
                : 
                  <View style={ styles.containerStartTrip }>
                    <TouchableOpacity
                      onPress={this.finishTrip.bind(this)}
                      style={ styles.containerStartButt }
                    >
                      <Text style={ styles.colorWhite }>Finish Trip</Text>
                    </TouchableOpacity> 
                  </View>
                : null
              }
            </View>
          </View>
        );
      }
  
  }

export default Map;