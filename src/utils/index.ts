import Taro from "@tarojs/taro"

// 封装权限检查方法
export function checkPhotoAlbumPermission() {
  return new Promise((resolve, reject) => {
    Taro.getSetting({
      success: (res) => {
        const authSetting = res.authSetting
        if (authSetting['scope.writePhotosAlbum'] === undefined) {
          // 首次使用，直接授权
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => resolve(true),
            fail: () => resolve(false)
          })
        } else if (authSetting['scope.writePhotosAlbum'] === false) {
          // 已拒绝，需要引导用户手动开启
          showPermissionGuide()
          resolve(false)
        } else {
          // 已授权
          resolve(true)
        }
      }
    })
  })
}

// 显示权限引导
export function showPermissionGuide() {
  Taro.showModal({
    title: '权限申请',
    content: '保存图片需要您授权访问相册权限',
    confirmText: '去设置',
    success: (res) => {
      if (res.confirm) {
        Taro.openSetting({
          success: (settingRes) => {
            if (settingRes.authSetting['scope.writePhotosAlbum']) {
              Taro.showToast({ title: '授权成功' })
            }
          }
        })
      }
    }
  })
}
