import common from '../../common/app'
import API from '../../common/API'
import { fetch } from '../../utils/utils'
const page = {
  onLoad(options){
    this.setData({onload: false})
    console.log('article onload...');
    wx.showToast({ title: '玩命加载中',icon: 'loading',duration: 10000 })
    const url = `${API.getArticle.url}/${options.id || 8108}.html`
    fetch(url).then(result => {
      const {errMsg, statusCode, data} = result
      if( errMsg === 'request:ok' && statusCode === 200 ){
        console.log(`${API.getArticle.url}/${options.id || 1211}.html接口返回的数据：`,result);
        const {header, contents} = data
        this.setData({header,contents})
      } else {
        console.log(`${API.getArticle.url}/${options.id || 1211}.html接口失败：`,result);
      }
    }).catch(result => {
      console.log(`${API.getArticle.url}/${options.id || 1211}.html接口错误：`,result);
      this.setData({
        header: {banners: [],title: '有调机器人',  price: {type: 'datetime',value: '-0-0'},  author: {url: 'http://c.diaox2.com/cms/diaodiao/people/robot.jpg',value: '有调机器人'}},
        contents: [{type: 'p',value: '发生了错误，我们正在紧张地排查，请您换一篇文章阅读'}]
      })
    })
  }
}
Object.assign(page, common)
Page(page)
