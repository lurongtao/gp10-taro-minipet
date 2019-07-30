import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { View, Text, Icon } from '@tarojs/components'

class Feedback extends Component {
  handleSuccBackTap () {
    Taro.navigateBack({})
  }

  handleFailBackTap () {
    this.props.onChangeSubmitStatus()
  }
  
  render() {
    return (
      <View className="feedback">
        <View>
          <Icon type={this.props.isSucc ? 'success' : 'warn'} size="50"/>
          {
            this.props.isSucc
              ? <Text>恭喜你~信息提交成功！</Text>
              : <Text>抱歉~信息提交失败！</Text>
          }
        </View>

        {
          this.props.isSucc
            ? (
              <View className="button button-success" onClick={this.handleSuccBackTap.bind(this)}>
                返回首页
              </View>
            )
            : (
              <View className="button button-warning" onClick={this.handleFailBackTap.bind(this)}>
                重新发布
              </View>
            )
        }
      </View>
    )
  }
}