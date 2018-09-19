import { StyleSheet, PixelRatio  } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(23,49,110)',
    },
    ImageCar: {
      backgroundColor: '#33BBFF', 
      width: '100%', 
      top: '10%'
    },
    top: {
      top: 15
    },
    correctData: {
      color: 'red', 
      margin: 15
    },
    colorWhite: {
      color: 'white'
    },
    padding: {
        padding: 15
    },
    privicyPolicy: {
        flex: 1,
        position: 'absolute', left: 25, right: 0, bottom: 15,
        color: '#33BBFF'
    },
    backgroundColorWhite: {
        backgroundColor: 'white'
    },
    size: {
        width: '100%',
        height: 50,
        fontSize: 15
    },
    input:{
      height: 40,
      backgroundColor: 'rgba(225,225,225,0.2)',
      marginBottom: 10,
      padding: 10,
      color: '#fff',
      borderWidth: 1,
  },
    ImageContainer: {
        borderRadius: 10,
        width: '100%',
        height: 150,
        borderColor: 'white',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        
      },
    borderColor: {
        borderColor: '#B8C3C9'
    },
    borderColorRed: {
      borderColor: 'red'
    },
    heightInput: {
        height: 40,
        backgroundColor: 'white',
        paddingLeft: 15
    },
  });
export default styles;