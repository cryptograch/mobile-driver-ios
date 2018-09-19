

import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  Image,
  Button,
  Dimensions
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import img1 from '../../images/Registration/wage.jpg';
import img2 from '../../images/Registration/work.jpg';
import img3 from '../../images/Registration/secure.jpg';


const imgs = [
  img1,
  img2,
  img3
]
const contentTitles = [
  'Higt wages',
  'Free work schedule',
  'Safety behind the wheel'
]

let FirstItem = 1;

const SliderWidth = Dimensions.get('screen').width;
const ItemWidth = 300.0;
const ItemHeight = 200.0;

const NumItems = 100;
const Items = [];
for(var i = 0; i < imgs.length; i++) {
  Items.push(i)
}
class CarouselNew extends Component {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this)
      }
    _renderItem({ item }) {
        return (
          <View style={{
            width: ItemWidth,
            height: ItemHeight,
            alignItems: 'center',
            backgroundColor: 'white'
          }}>
            <Image style={ styles.sizeImgCarousel } source={imgs[item]} />
            <Text style={styles.contentTitles}>{contentTitles[item]}</Text>
          </View>
        );
    }
      
    render() {
        return (
          <View style={styles.container}>
            <Carousel
              data={Items}
              firstItem={FirstItem}
              itemWidth={ItemWidth}
              sliderWidth={SliderWidth}
              activeSlideAlignment='center'
              renderItem={this._renderItem} />
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15,
      },
      sizeImgCarousel: {height: 100, width: '100%'},
      contentTitles: {
        color: 'white', 
        fontSize: 15, 
        color: 'black', 
        marginTop: 15
      }
});


export default CarouselNew;
