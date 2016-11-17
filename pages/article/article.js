import common from '../../common/app'
import API, {HEADER as header} from '../../utils/API'
const app = common.app

const page = {
  onLoad(options){
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading',
      duration: 2000
    })
    const self = this
    wx.request({
      url: `${API.getArticle.url}/${options.id || 1211}.html`,
      header: header,
      success: function(res) {
        console.log(res.data)
        const {header, contents} = res.data
        self.setData({header,contents})
      },
      fail: function(res){
        console.log(res)
        self.setData({
          header: {
            banners: [],
            title: '有调机器人',
            price: {
              type: 'datetime',
              value: '-0-0'
            },
            author: {
              url: 'http://c.diaox2.com/cms/diaodiao/people/robot.jpg',
              value: '有调机器人'
            }
          },
          contents: [{
            type: 'p',
            value: '有调机器人正在写文章...'
          }]
        })
      },
      complete: function(){
        // 隐藏掉加载状态
        setTimeout(() => {
          wx.hideToast()
        })
      }
    })
  }
}
Object.assign(page, common)
Page(page)
