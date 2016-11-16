//index.js
//获取应用实例
import common from '../common/common'
const app = common.app
import gift_default from '../common/gift_default'
import {handleTitle} from '../../utils/utils'
console.log(gift_default);
/*
  TODO:
  1. onLoad 为什么不执行？
     答：因为common.js中已经写了onLoad函数，然后使用Object.assign合并page和common时，common的onLoad给page上的onLoad覆盖了
  2. 在app.js中ajax回调中把数据挂到app对象上，为什么在其他文件引用不到？
*/

const page = {
  onLoad(){
    const self = this
    const prefix = "http://c.diaox2.com/cms/diaodiao/"
    setTimeout(() => {
      const aids = gift_default.aids
      const mis = gift_default.meta_infos;
      const meta_infos = []
      aids.forEach(item => {
        const each = mis[item]
        const meta_info = each.data
        meta_info.title = handleTitle(meta_info.format_title)
        meta_info.read_count = each.read_count
        meta_info.author.pic = prefix + meta_info.author.pic
        meta_infos.push(meta_info)
      })

      self.setData({
        meta_infos: meta_infos
      })

      console.log(meta_infos);

    })

    // const giftDefault = API.giftDefault.url
    // wx.request({
    //   url: getfullsku,
    //   data: {id: sid},
    //   header: {'Content-Type': 'application/json'},
    //   success: function(res) {
    //   }
    // })
  }
  ,confirm(){
    wx.navigateTo({
        url:'../gift-result/gift-result?queryParameter=' + JSON.stringify(queryParameter)
    })
  }

  ,bindChange(e) {
    console.log( e.detail.value )
    const value = e.detail.value
    if(value && value.trim()){
      this.setData({
        keyword: value
      })
    }
  }
}

Object.assign(page, common)
Page(page)
