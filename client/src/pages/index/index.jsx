import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { View, Map, CoverView, CoverImage, Navigator } from '@tarojs/components'
import { http } from '../../utils/util'

import './index.scss'

import coverImage from '../../resources/center.png'
import buyImage from '../../resources/buy.png'
import sellImage from '../../resources/sell.png'

class Index extends Component {
  state = {
    latitude: 0,
    longitude: 0,
    markers: []
  }

  componentDidMount() {
    Taro.getLocation({
      type: 'wgs84'
    })
    .then((res) => {
      const {latitude, longitude } = res
      this.setState({
        latitude,
        longitude
      })
    })

    this.getData()
  }

  async getData() {
    let result = await http(
      'https://ik9hkddr.qcloud.la/index.php/trade/get_list',
      'GET',
      {}
    )

    this.setState({
      markers: [...this.state.markers, ...result.data.map(value => {
        return {
          iconPath: `${value.type === 'buy' ? buyImage : sellImage}`,
          id: value.id,
          latitude: value.latitude,
          longitude: value.longitude,
          width: 40,
          height: 40,
          label: {
            content: value.type,
            borderWidth: 2,
            borderColor: '#fff',
            bgColor: '#f9efd4'
          }
        }
      })]
    })
  }

  render() {
    return (
      <View className="container">
        <View className="map">
          <Map 
            id="map" 
            longitude="{{longitude}}" 
            latitude="{{latitude}}" 
            scale="16" 
            show-location
            markers="{{markers}}"
            bindmarkertap="handleMarkerTap"
          >
            <CoverView className="center" bindtap="moveToCenter">
              <CoverImage className="img" src={coverImage} />
            </CoverView>
          </Map>
        </View>
        <View className="tabbar">
          <Navigator open-type="navigateTo" url="/pages/publish/publish">
            <View className="publish">发布</View>
          </Navigator>
          <Navigator open-type="navigateTo" url="/pages/search/search">
            <View className="search">搜索</View>
          </Navigator>
        </View>
      </View>
    )
  }

}

export default Index