import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { RemoveBgClient } from '@/api';
import './index.scss'

const RemoveBgClientInstance = new RemoveBgClient();

export default function Index () {
  useLoad(() => {
    RemoveBgClientInstance.getAccount();
  })

  return (
    <View className='index'>
      <Text>甜甜，嘻嘻😁</Text>
    </View>
  )
}
