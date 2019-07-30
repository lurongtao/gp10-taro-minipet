import Taro, { Component } from '@tarojs/taro'
import { View, Input, Label, Radio, RadioGroup } from '@tarojs/components'
import { AtInput, AtToast, AtActivityIndicator } from 'taro-ui'
import '@tarojs/async-await'
import { http } from '../../utils/util'
import './publish.scss'
import Feedback from '../../components/Feedback'

class Publish extends Component {
  state = {
    isSubmit: false,
    isSucc: false,
    isOpened: false,
    toastText: '',
    address: '请选择',
    message: '',
    contact: ''
  }

  handleMessageChange (message) {
    this.setState({
      message
    })
  }

  handleContactChange (contact) {
    this.setState({
      contact
    })
  }

  handleAddressTap() {
    Taro.chooseLocation()
      .then((result) => {
        let {
          address,
          latitude,
          longitude
        } = result
        this.staticData = { ...this.staticData, address, latitude, longitude }
        
        this.setState({
          address
        })
      })
  }

  radioChange(e) {
    this.staticData.type = e.detail.value
  }

  componentDidMount() {
    this.staticData = {
      type: 'buy'
    }
  }

  async handleButtonTap() {
    // 验证
    if (!this.staticData.address) {
      this.setState({
        isOpened: true,
        toastText: '请选择地址'
      })
      return
    }

    if (!this.state.message) {
      this.setState({
        isOpened: true,
        toastText: '请输入说明'
      })
      return
    }

    if (!this.state.contact) {
      this.setState({
        isOpened: true,
        toastText: '请输入联系方式'
      })
      return
    }

    let { contact, message } = this.state
    let result = await http(
      'https://ik9hkddr.qcloud.la/index.php/trade/add_item', 
      'POST', 
      {...this.staticData, contact, message}
    )

    this.setState({
      isSubmit: true
    })

    if (result.ret) {
      this.setState({
        isSucc: true
      })
    } else {
      this.setState({
        isSucc: false,
      })
    }

  }

  handleChangeSubmitStatus () {
    this.setState({
      isSubmit: false
    })
  }

  render() {
    return (
      <View>
      {
        !this.state.isSubmit
          ? (<View className="wrap">
            <View className="item">
              <View className="label">我的地址</View>
              <View className="content" onClick={this.handleAddressTap.bind(this)}>
                {this.state.address}
              </View>
            </View>
            <View className="item">
              <View className="label">类型</View>
              <View className="content">
                <RadioGroup className="radio-group" onChange={this.radioChange.bind(this)}>
                  <Label className="radio">
                    <Radio value="buy" checked="{{true}}"/>求购
                  </Label>
                  <Label className="radio">
                    <Radio value="sell" />转让
                  </Label>
                </RadioGroup>
              </View>
            </View>
            <View className="item">
              <AtInput
                name='value1'
                title='说明'
                type='text'
                placeholder='请填写说明'
                value={this.state.message}
                onChange={this.handleMessageChange.bind(this)}
              ></AtInput>
            </View>
            <View className="item">
              <AtInput
                name='value1'
                title='联系方式'
                type='text'
                placeholder='请填写联系方式'
                value={this.state.contact}
                onChange={this.handleContactChange.bind(this)}
                ></AtInput>
            </View>

            <View className="button" onClick={this.handleButtonTap.bind(this)}>
              发布信息
            </View>
          </View>)

          : (<Feedback onChangeSubmitStatus={this.handleChangeSubmitStatus.bind(this)} isSucc={this.state.isSucc}></Feedback>)
      }
      <AtToast isOpened={this.state.isOpened} text={this.state.toastText} icon={'loading-3'} duration={1000 }></AtToast>
      </View>
    )
  }
}

export default Publish