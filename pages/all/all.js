//index.js
//获取应用实例
import common from '../../common/app'
import category from '../../common/category'
// import articles from '../../common/articles'
const app = common.app
const page = {
  onLoad(options) {
    const self = this
    wx.getStorage({
      key:"allRaiders",
      success(res){
        console.log(res);
        self.setData({
          articles:res.data
        })
      }
    })
  }
}

Page(page)
