import { useState } from 'react';
import { View, Text, Button, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { RemoveBgClient, type AccountInfo } from '@/api';
import './index.scss'

const RemoveBgClientInstance = new RemoveBgClient();

export default function Index () {
  const [accoutInfo, setAccoutInfo] = useState<Partial<AccountInfo['data']['attributes']>>({});
  const [localImgList, setLocalImgList] = useState<Taro.chooseImage.ImageFile[]>([]);

  useLoad(async () => {
    const res = await RemoveBgClientInstance.getAccount();
    setAccoutInfo(res.data.attributes)
  })

  function calcCount() {
    let count = 0;

    count = (accoutInfo.api?.free_calls || 0) + (accoutInfo.credits?.total || 0)
    return count
  }

  function handleUpload() {
    Taro.chooseImage({
      success(res) {
        setLocalImgList(res.tempFiles)
      }
    })
  }

  return (
    <View className='index'>
      <Text>当前积分剩余{ calcCount() }</Text>
      <Button onClick={handleUpload}>选择图片</Button>
      { localImgList.map(img => <Image src={img.path} key={img.path}></Image>) }
    </View>
  )
}
