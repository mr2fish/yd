// import common from '../../common/app'
import API from '../../common/API'
import { handleTitle, fetch } from '../../utils/utils'
const loadingLength = 20
const loadingStart = 0
const page = {
  onLoad(){
    console.log('index onload...');
    this.setData({
      pageLength: loadingLength,
      start: loadingStart
    })
    // fetch(API.giftDefault.url).then(res => console.log(res)).catch(res => console.log(res))
    wx.showToast({title: '玩命加载中',icon: 'loading', duration: 10000})
    const url = API.giftDefault.url
    fetch(url).then(result => {
      console.log(`${url}返回的数据：`,result);
      const {aids, meta_infos} = result.data
      const metas = []
      aids.forEach(id => {
        // 克勒kk：我给父亲送过的礼物 这篇文章就没有id
        if(!id) return console.error('存在非法的id：', id)
        const meta_info = meta_infos[id]
        if(!meta_info) return console.error('存在空的meta_info');
        console.log(meta_info);
        // 因为小程序没有对应的专刊的展示页，所以过滤掉专刊数据
        if(meta_info.ctype == 3) return console.log(`主动报错：${url}接口返回的数据包含专刊数据。id是：${id}`)
        if(!meta_info) return console.error(`主动报错：${url}接口返回的数据，aids和meta_infos不是一一对应的关系。id是：${id}`);
        meta_info.title = handleTitle(meta_info.title)
        meta_info.author.pic = `http://c.diaox2.com/cms/diaodiao/${meta_info.author.pic}`
        metas.push(meta_info)
      })
      this.loadNewPage(metas)
      wx.hideToast()
    }).catch(result => {
      console.log(`${url}接口失败：`,result)
      wx.hideToast()
    })

  }
  ,scrolltolower(){
    this.loadNewPage()
  }
  ,loadNewPage(meta_infos = this.data.all_meta_infos){
    if(!meta_infos || meta_infos.length === 0 ) return;
    let {start, pageLength} = this.data
    console.log(start);
    console.log(pageLength);
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
    this.setData({ meta_infos: metas, start: start + pageLength, all_meta_infos: meta_infos })
    // this.meta_infos = meta_infos
    // start += pageLength
  }
  ,confirm(){
    const query = this.data.query
    wx.navigateTo({url:`../gift-result/gift-result?queryParameter=${JSON.stringify({query})}`})
  }

  // ,bindChange(e) {
  //   const query = (e.detail.value || '').trim()
  //   if(query){this.setData({query})}
  // }

}

// Object.assign(page, common)
Page(page)
