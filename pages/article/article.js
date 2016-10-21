//index.js
//获取应用实例
'use strict'
import common from '../common/common'
import res from '../common/content'
const app = common.app

const data = res.data
const header = data.header
const contents = data.contents

// console.log(res)
// console.log(data)
// console.log(header)
// console.log(contents)

const page = {
  onLoad(options){
    // console.log('article onload')
    const self = this
    const id = options.id
    wx.request({
      url: 'http://z.diaox2.com/view/app/',
      data: {m: 'wechat',id: id},
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
          contents: {
            type: 'p',
            value: '很抱歉，页面发生了错误，请重试'
          }
        })
      },
      complete: function(){
        // 隐藏掉加载状态
        self.setData({
          loadingHidden: true
        })
      }
    })


  }
}

Object.assign(page, common)

Page(page)
