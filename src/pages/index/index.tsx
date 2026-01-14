import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index () {
  useLoad(() => {
    console.log('Page loaded.', TARO_APP_SECRET_KEY)
  })

  return (
    <View className='index'>
      <Text>甜甜，嘻嘻😁</Text>
    </View>
  )
}
