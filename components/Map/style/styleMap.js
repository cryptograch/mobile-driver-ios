import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#E3E9EC'
    },
    buttonContainer:{
      backgroundColor: '#2980b6',
    },
    mapStyle: { 
      flex: 1, 
      top: 0 
    },
    colorWhite: {
      color: 'white'
    },
    containerStartTrip: {
      backgroundColor: 'white', 
      position: 'absolute', 
      flex: 1, 
      top: '80%', 
      width: '100%', 
      height: '20%', 
      padding: 15, 
      alignItems: 'center', 
      justifyContent: 'center'
    },
    containerStartButt: {
      backgroundColor: 'rgb(23,49,110)', 
      height: 50, 
      width: '70%', 
      justifyContent: 'center', 
      alignItems: 'center', 
      borderRadius: 15
    },
    sizeMarkers: {
      width: 40, 
      height: 40 
    },
    buttonText:{
      color: '#fff',
      textAlign: 'center',
      fontWeight: '700'
    },
    size: {
      width: '100%',
      height: '100%'
    },
    OrderList: {
      height: 75,
      paddingLeft: 25,
      justifyContent: 'center',
    },
    hideList: {
      position: 'absolute',
      height: '60%', 
      width: '100%',
      top: 670,
    }
  });

export default styles;