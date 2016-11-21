import common from '../../common/app'
import category from '../../common/category'
const { app } = common
const page = {
  onLoad(options) {
    const self = this
    wx.getStorage({
      key:'allRaiders',
      success(result){
        console.log(result);
        self.setData({
          articles:result.data
        })
      },
      fail(result){
        console.log('获取本地存储allRaiders错误：',result)
      }
    })
  }
}

Page(page)
