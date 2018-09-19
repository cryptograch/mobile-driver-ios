import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    component: {
        flex: 1,
        position: 'absolute', 
        left: 0, 
        right: 0, 
        bottom: 0,
        height: 100
    },
    content: {
        padding: 25
    },
    privicyPolicy: {
        top: 25,
        color: '#33BBFF'
    },
    colorWhite: {
        color: 'white'
    },
    horLine: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    }
});

export default styles;