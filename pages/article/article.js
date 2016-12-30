const API = require('../../common/API')
Page({
  onLoad(options){
    console.log('article load...')
    this.setData({ id: options.id })
  },
  onReady(){
    try{
      console.log('article onready...')
      this.setData({ load: false })
      wx.showToast({ title: '玩命加载中',icon: 'loading', duration: 10000 })
      console.log( this.data.id )
      // const url = `${API.getArticle.url}/${this.data.id || 8108}.html`
      const url = `${API.getArticle.url}/${this.data.id}.html`
      wx.request({
        url: url,
        success: (result) => {
          try{
            const { errMsg, statusCode, data } = result
            if( errMsg === 'request:ok' && statusCode == 200 ){
              console.log(`${url}接口返回的数据：`,result);
              const {header, contents} = data
              this.setData({header,contents})
              this.title = header.title
            } else {
              console.log(`${url}接口失败：`,result);
            }
          }catch(e){
            console.log('发生了错误')
            console.log(e)
            wx.redirectTo({url:'../error/error'})
          }
        },
        fail: (result) => {
          console.log(`${url}接口错误：`,result);
          this.setData({
            header: {banners: [],title: '有调机器人',  price: {type: 'datetime',value: '-0-0'},  author: {url: 'http://c.diaox2.com/cms/diaodiao/people/robot.jpg',value: '有调机器人'}},
            contents: [{type: 'p',value: '发生了错误，我们正在紧张地排查，请您换一篇文章阅读'}]
          })
        },
        complete: () => {
          wx.hideToast()
          this.setData({load: true})
        }
      })
    }catch(e){
      console.log('发生了错误')
      console.log(e)
      wx.redirectTo({url:'../error/error'})
    }
  }
  ,onShareAppMessage: function () {
    return {
      title: this.title,
      desc: '分享自「礼物挑选神器」，送礼不用愁'
    }
  }
  // ,onHide(){
  //   this.setData({load: false})
  // }
})
