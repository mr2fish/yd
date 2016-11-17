import common from '../../common/app'
import category, { defaultItem } from '../../common/category'
const app = common.app
const categorys = Object.keys(category).map(item => category[item])

/*
  TODO:
  1. onLoad 为什么不执行？
     答：因为common.js中已经写了onLoad函数，然后使用Object.assign合并page和common时，common的onLoad给page上的onLoad覆盖了
  2. 在app.js中ajax回调中把数据挂到app对象上，为什么在其他文件引用不到？
*/
const page = {
  data: { categorys }
  ,onLoad(){
    // 由于gifts是异步挂载到app上的，所以需要间隔查询数据是否ready
    setInterval(function(){
      // console.log(app.gifts)
    },1000)
  }
  ,reset(){this.setData({categorys: categorys.map( category => {category.selectedIndex = 0; return category})})}
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
    const queryParameter = {}
    for (const category of categorys) {
       const {name, selectedIndex} = category
       if(selectedIndex === 0) continue;
       if(name == 'price'){
         queryParameter[name] = category
                                .items[selectedIndex]
                                .split(/-|\+/)
                                .filter(price => price !== '')
       }else{
         queryParameter[name] = category.items[selectedIndex]
       }
    }
    wx.navigateTo({url:`../gift-result/gift-result?queryParameter=${JSON.stringify(queryParameter)}`})
  }
}

Object.assign(page, common)
Page(page)
