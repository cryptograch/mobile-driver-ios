import { StyleSheet } from 'react-native';
 
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#2b2929',
    },
    SizeImg: {
      width: '100%', 
      height: '100%'
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 5,
      color: 'white'
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    HomeImg: {
      marginTop: '10%',
      width: '100%',
      height: '40%'
    },
    marginTop: {
      marginTop: '10%'
    },
    sizeButt: {
      justifyContent: 'center',
      width: '45%',
      height: '6%',
      borderColor: 'white',
      borderWidth: 1,
      backgroundColor: '#faa71a',
      borderRadius: 15,
      position: 'absolute',
    },
    Right: {
      top: '70%',
      right: '2%',
      
    },
    Left: {
      top: '70%',
      left: '2%'
    },
    linkApp: {
      top: '10%',
      // borderColor: 'white',
      // borderWidth: 1,
      // backgroundColor: '#faa71a',
      borderRadius: 15,
      padding: 15
    },
    app: {
      color: '#faa71a',
      fontSize: 20
    },
    logo: {
      width: 300,
      height: 100
    }
  });

  export default styles;