import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  AsyncStorage,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import tripsImg from '../../images/tabs/trips.png';
import rightImg from '../../images/Right.png';
import geolib from 'geolib';
import styles from './style/stylesOrdersList';
import Loader from '../Loader/Loader';

class Map extends Component {
    static navigationOptions = {
        title: 'Trips',
        tabBarIcon: () => (
          <Image
            source={tripsImg}
            style={{height: 25, width: 25}}
          />
        ),
    }
      constructor(props) {
        super(props);
        this.state = { 
          seconds: 0,
          error: null,
          clientToken: null,
          driverLatitude: null,
          driverLongitude: null,
          content: [],
          getTrips: true,
          isRefreshing: false,
          loading: false
        }

        this.distanceToObject = this.distanceToObject.bind(this);

      }

      distanceToObject(arr) {
        arr.map((item, index) => {
          let distance = geolib.getDistance(
            {latitude: this.state.driverLatitude, longitude: this.state.driverLongitude},
            {latitude: item.from.latitude, longitude: item.from.longitude}
          );
          arr[index].distance = distance
        });
        arr.sort((obj1, obj2) => {
          return obj1.distance - obj2.distance;
        });
        this.setState({
          getTrips: false,
          content: arr,
        })
      }

      refreshToken(res) {
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
      }
      trips(latitude, longitude) {
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips?Longitude=${longitude}&Latitude=${latitude}`, {
          method: 'GET',
          withCredentials: true,
          credentials: 'include',
          headers: {
              'Authorization': 'Bearer ' + this.state.clientToken,
          }
        })
        .then((response) => response.json())
        .then((response) => {
          if(response.length >= 0) {
            this.distanceToObject(response);
          } 
          else {
            AsyncStorage.getItem('saveRefreshToken').then((res) => 
              this.refreshToken(res)
            )
          }
        })
      }

      tick() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              this.trips(position.coords.latitude, position.coords.longitude);
              this.setState({
                driverLatitude: position.coords.latitude,
                driverLongitude: position.coords.longitude,
                error: null,
              });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
        
        
        this.setState(prevState => ({
          seconds: prevState.seconds + 1
        }));
      }

      componentDidMount() {
        AsyncStorage.getItem('saveDataUserToken').then((value) => this.setState({clientToken: value}));
        this.interval = setInterval(() => this.tick(), 5000);
      }

      componentWillUnmount() {
        clearInterval(this.interval);
      }
      getCustomersRouts(newTrip) {
        this.setState({
          loading: true
        })
        fetch(`http://taxi-env.hsgu7qika6.us-east-2.elasticbeanstalk.com/api/Trips/taketrip?customerId=${newTrip.customerId}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.clientToken,
          },
        })
        .then((data) => {
          this.setState({
            loading: false
          });
          if(data.ok === true) {
            AsyncStorage.setItem('myTrip', JSON.stringify(newTrip));
            this.props.navigation.navigate('Map');
          }
          else {
            console.log('error');
          }
        })  
        .catch((error) => {
          return error;
        });
      }
      async newTrip(item) {
        try {
          await this.getCustomersRouts(item);
        } catch(err) {
          console.log(err)
        }
      }
      async onRefresh() {
        this.setState({
          isRefreshing: true
        });
        try {
          await this.trips();
        } catch (err) {
          console.log(err);
        }
        this.setState({
          isRefreshing: false
        })
        
      }
      render() {
        return (
          <View style={styles.container}>
            <View style={ styles.marginTop }>
              <View style={ styles.alignItems }>
                <Text style={ styles.fontSize25 }>Orders</Text>
              </View>
              <Loader loading={this.state.loading} />
              <View style={ styles.containerList }>
                <ScrollView contentContainerStyle={ styles.justifyContent } refreshControl={
                  <RefreshControl 
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.onRefresh.bind(this)}
                    tintColor="#17316E"
                    title="Loading..."
                    titleColor="#00ff00"
                    colors={['#17316E']}
                    progressBackgroundColor="#ffff00"
                  />
                }>
                    {
                      this.state.content.length === 0 ? 
                      this.state.getTrips ? <View style={styles.Loader}>
                        <ActivityIndicator animating={this.state.getTrips} size="large" color="#faa71a" />
                      </View> :
                      <View style={ styles.emptyOrders }>
                        <Text style={ styles.textListOrders }>List of orders is empty</Text>
                      </View> :
                      this.state.content.map((item, index) => 
                        <TouchableOpacity 
                          key={index} 
                          style={ styles.containerOrderList } 
                          onPress={this.newTrip.bind(this, item)}>
                          <View style={styles.OrderList}>
                            <Text style={styles.colorOrange} >First name: <Text style={ styles.colorBlack }>{item.firstName}</Text></Text>
                            <Text style={styles.colorOrange} >Last name: <Text style={ styles.colorBlack }>{item.lastName}</Text></Text>
                            <Text style={styles.colorOrange} >Distance to object: <Text style={ styles.colorBlack }>{item.distance/1000} km </Text></Text>
                          </View>
                          <Image source={rightImg} style={ styles.rightImg } />
                        </TouchableOpacity>
                      )
                    }
                    </ScrollView>
                </View>
            </View>
          </View>
        );
      }
  
  }
export default Map;