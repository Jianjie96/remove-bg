import { useState } from "react";
import { View, Text, Button, Image, ScrollView } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { RemoveBgClient, type AccountInfo } from "@/api";
import { checkPhotoAlbumPermission } from "@/utils";
import "./index.scss";

const RemoveBgClientInstance = new RemoveBgClient();

export default function Index() {
  const [accoutInfo, setAccoutInfo] = useState<
    Partial<AccountInfo["data"]["attributes"]>
  >({});
  const [localImgList, setLocalImgList] = useState<
    Taro.chooseImage.ImageFile[]
  >([]);
  const [removeBgImgList, setRemoveBgImgList] = useState([]);

  useLoad(async () => {
    const res = await RemoveBgClientInstance.getAccount();
    setAccoutInfo(res.data.attributes);
  });

  function calcCount() {
    let count = 0;

    count =
      (accoutInfo.api?.free_calls || 0) + (accoutInfo.credits?.total || 0);
    return count;
  }

  function handleUpload() {
    Taro.chooseImage({
      success(res) {
        setLocalImgList(res.tempFiles);
      },
      fail() {},
    });
  }

  async function batchDownloadFile(imgList: string[]) {
    return Promise.allSettled(
      imgList.map((img) => {
        return new Promise((resolve, reject) => {
          Taro.downloadFile({
            url: img,
            success: resolve,
            fail: reject,
          });
        });
      })
    );
  }

  async function batchSave(imgList: string[]) {
    return Promise.allSettled(
      imgList.map((img) => {
        return new Promise((resovle, reject) => {
          Taro.saveImageToPhotosAlbum({
            filePath: img,
            success: resovle,
            fail: reject,
          });
        });
      })
    );
  }

  async function handleDownload() {
    try {
      const isChecked = await checkPhotoAlbumPermission();
      if (!isChecked) return;

      Taro.showLoading({ title: "正在保存" });

      const tempFilePathList = await batchDownloadFile(removeBgImgList);
      const res = await batchSave(
        tempFilePathList
          .map((item) => {
            if (item.status === "rejected") {
              return false;
            }
            return item.value;
          })
          .filter(Boolean) as string[]
      );
      const flag = res.some(item => item.status === 'fulfilled');
      if (flag) {
        Taro.hideLoading();
        Taro.showToast({ title: '保存成功', icon: 'success' })
      }
    } catch (e) {
      Taro.hideLoading();
    }

    Taro.saveImageToPhotosAlbum({
      filePath: "",
      success(res) {
        Taro.showToast({
          title: "保存成功",
          icon: "success",
        });
      },
    });
  }

  return (
    <View className='index'>
      <Text>当前积分剩余{calcCount()}</Text>
      <Button onClick={handleUpload}>选择图片</Button>
      <ScrollView scrollX>
        {localImgList.map((img) => (
          <View key={img.path}>
            <Image src={img.path}></Image>
          </View>
        ))}
      </ScrollView>
      <Button onClick={handleDownload}>保存到本地</Button>
    </View>
  );
}
