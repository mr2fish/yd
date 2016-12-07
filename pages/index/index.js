import common from '../../common/app'
import API from '../../common/API'
import { handleTitle, fetch } from '../../utils/utils'
/*
  TODO:
  1. onLoad 为什么不执行？
     答：因为common.js中已经写了onLoad函数，然后使用Object.assign合并page和common时，common的onLoad给page上的onLoad覆盖了
  2. 在app.js中ajax回调中把数据挂到app对象上，为什么在其他文件引用不到？
*/
const loadingLength = 20
const loadingStart = 0

let pageLength = loadingLength
let start = loadingStart
const page = {
  onLoad(){
    pageLength = loadingLength
    start = loadingStart
    // fetch(API.giftDefault.url).then(res => console.log(res)).catch(res => console.log(res))
    wx.showToast({  title: '玩命加载中',icon: 'loading' })
    const url = API.giftDefault.url
    fetch(url).then(result => {
      console.log(`${url}返回的数据：`,result);
      const {aids, meta_infos} = result.data
      const metas = []
      aids.forEach(id => {
        const meta_info = meta_infos[id]
        if(!meta_info) return console.error(`主动报错：${url}接口返回的数据，aids和meta_infos不是一一对应的关系。id是：${id}`);
        meta_info.title = handleTitle(meta_info.title)
        meta_info.author.pic = `http://c.diaox2.com/cms/diaodiao/${meta_info.author.pic}`
        metas.push(meta_info)
      })
      this.loadNewPage(metas)
    }).catch(result => console.log(`${url}接口失败：`,result))
  }
  ,scrolltolower(){
    this.loadNewPage()
  }
  ,loadNewPage(meta_infos = this.meta_infos){
    if(!meta_infos || meta_infos.length === 0 ) return;
    const end = start + pageLength
    // 第一次执行该方法时，this.data.meta_infos 为 undefined
    const alreadyDisplay = this.data.meta_infos || []
    const shouldLoad = meta_infos.slice(start, end)
    const metas = alreadyDisplay.concat(shouldLoad)
    console.log("metas.length:",metas.length);
    console.log("meta_infos.length:",meta_infos.length);
    if(metas.length === meta_infos.length){
      setTimeout(() => {
        this.setData({ done: true })
      }, 120)
    } else {
      this.setData({ done: false })
    }
    this.setData({ meta_infos: metas })
    this.meta_infos = meta_infos
    start += pageLength
  }
  ,confirm(){
    const query = this.data.query
    wx.navigateTo({url:`../gift-result/gift-result?queryParameter=${JSON.stringify({query})}`})
  }

  ,bindChange(e) {
    const query = (e.detail.value || '').trim()
    if(query){this.setData({query})}
  }

}

Object.assign(page, common)
Page(page)
