import common from '../../common/app'
import category from '../../common/category'
const page = {
  onLoad(options) {
    const self = this
    wx.getStorage({
      key:'allRaiders',
      success(result){
        console.log('获取本地存储allRaiders的数据：', result)
        console.log(result.data);
        self.setData({ articles:result.data })
      },
      fail(result){
        console.log('获取本地存储allRaiders错误：', result)
      }
    })
  }
}
Object.assign(page, common)
Page(page)
