import React, { Component } from 'react';
import {
  View,
  Modal,
  ActivityIndicator,
  Text,
  PixelRatio
} from 'react-native';
import styles from './style';

const Loader = props => {
  const { loading, ...attributes } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading === true ? true : false}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={loading} size="large" color="#faa71a" />
          <Text>Wait please</Text> 
        </View>
      </View>
    </Modal>
  )
}

export default Loader;