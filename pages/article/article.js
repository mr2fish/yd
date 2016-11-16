//index.js
//获取应用实例
'use strict'
import common from '../common/common'
import API from '../../utils/API'
const app = common.app
wx.showToast({
  title: '玩命加载中',
  icon: 'loading'
})
const page = {
  onLoad(options){
    const self = this
    const id = options.id || 1211
    const getArticle = `${API.getArticle.url}/${id}.html`
    wx.request({
      url: getArticle,
      data: {id: id},
      header: {'Content-Type': 'application/json'},
      success: function(res) {
        console.log(res.data)
        self.setData({
          header: res.data.header,
          contents: res.data.contents,
        })
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
        wx.hideToast()
      }
    })
  }
}
Object.assign(page, common)
Page(page)
