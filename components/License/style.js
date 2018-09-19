import { StyleSheet, PixelRatio } from 'react-native';

const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: 'rgb(23,49,110)',
      padding: 15
    },
    width: {
      width: '100%'
    },
    borderColor: {
      borderWidth: 3,
      borderColor: 'red'
    },
    input:{
      height: 40,
      backgroundColor: 'rgba(225,225,225,0.2)',
      marginBottom: 10,
      padding: 10,
      color: '#fff',
      borderWidth: 1,
    },
    widthInput: {
      width: '50%',
      borderWidth: 1,
    },
    ImageContainer: {
      borderRadius: 10,
      width: '100%',
      height: 200,
      borderColor: 'white',
      borderWidth: 1 / PixelRatio.get(),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      
    },
    marginTopPhoto: {
      marginTop: 50
    },
    backgroundColorLightBlue: {
      backgroundColor: '#2980b6',  
    },
    marginTop: {
      flex: 1,
      position: 'absolute', left: 0, right: 0, bottom: 0,
      top: '75%',
      width: '100%',
      padding: 15,
      borderRadius: 15
    },
    privicyPolicy: {
      flex: 1,
      position: 'absolute', left: 25, right: 0, bottom: 15,
      color: '#33BBFF'
    },
    orderPhoto: {
      top: '5%',
      alignItems: 'center'
    },
    logo: {
      position: 'absolute',
      width: '100%',
      height: 100
    },
    colorRed: {
      color: 'red'
    },
    heightImg: {
      height: 100
    },
  });

  export default styles;