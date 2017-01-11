const cate = require('../../common/category')
const category = cate.category
const categorys = Object.keys(category).map(item => category[item])
Page({
  data: { categorys },
  onLoad(){
    console.log('filter onload...')
    // 在TBS2.0 和 IOS8下会有一个渲染bug，目前只解决IOS8的，因为腾讯马上就要升级
    // 到TBS3.0了，到时候，这个bug自然而然就没有了。如果现在修复的话，将来腾讯升级TBS3.0
    // 还是会有问题，所以索性就不管了，反正也能用。
    const res = wx.getSystemInfoSync()
    const isIOS8 = /IOS 8/i.test(res.system)
    this.setData({ ios8Factor: isIOS8 ? 0: 1 })
  }
  ,reset(){
    this.setData({
      categorys: categorys.map( category => {category.selectedIndex = 0; return category}),
      scrollLeft: 0
    })
  }
  //事件处理函数
  ,select(e){
    const {item, group} = e.target.dataset
    outer:
    for(let i = 0, li = categorys.length; i < li; ++i){
      let category = categorys[i]
      let {items, name} = category
      if( name === group ){
        for(let j = 0, lj = items.length; j < lj; ++j){
          let data = items[j]
          if(data === item){
            category.selectedIndex = j
            break outer;
          }
        }
      }
    }
    this.setData({categorys})
  }

  ,confirm(){
    // const queryParameter = { scene:"告白",relation:"基友",price:[0,1000], query:"第一个" }
    var queryParameter = {}
    // for (const category of categorys) { // for of 循环在安卓下有问题
    for (var i = 0,category; category = categorys[i++];) {
       var name = category.name
       var selectedIndex = category.selectedIndex
       if(selectedIndex === 0) continue;
       queryParameter[name] =  category.items[selectedIndex]
    }
    wx.navigateTo({url:`../gift-result/gift-result?queryParameter=${ JSON.stringify(queryParameter) }`})
  }
  ,onShareAppMessage: function () {
    return {
      title: '礼物挑选神器',
      desc: '量身设计的选礼解决方案'
    }
  }
})
// Object.assign(page, common) // 微信X5内核不支持这个方法
