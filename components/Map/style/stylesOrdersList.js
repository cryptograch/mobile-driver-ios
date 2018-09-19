import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#E3E9EC'
    },
    fontSize25: {
      fontSize: 25
    },
    containerList: {
      justifyContent: 'center', 
      padding: 15, 
      height: '90%'
    },
    justifyContent: {
      justifyContent: 'center'
    },
    buttonContainer:{
      backgroundColor: '#2980b6',
    },
    rightImg: {
      width: 50, 
      height: 50, 
      position: 'absolute', 
      right: 15
    },
    colorOrange: {
      color: '#faa71a'
    },
    containerOrderList: {
      marginTop: 5, 
      backgroundColor: '#2b2929', 
      borderRadius: 15, 
      justifyContent: "center", 
      padding: 15, 
      borderColor: '#faa71a', 
      borderWidth: 3
    },
    colorBlack: {
      color: '#faa71a', 
      fontWeight: 'bold'
    },
    textListOrders: {
      fontSize: 25, 
      color: 'red'
    },
    emptyOrders: {
      marginTop: '60%', 
      alignItems: 'center'
    },
    marginTop: {
      marginTop: 22, 
      justifyContent: 'center', 
    },
    alignItems: {
      alignItems: 'center' 
    },
    Loader: {
      height: 400,
      justifyContent: 'center',
    },
    buttonText:{
      color: '#fff',
      textAlign: 'center',
      fontWeight: '700'
    },
    size: {
      width: '100%',
      height: '86%'
    },
    OrderList: {
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