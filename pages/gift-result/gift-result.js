//index.js
//获取应用实例
import common from '../common/common'
import category, { defaultItem } from '../common/category'
const app = common.app
const keys = Object.keys(category)
const categorys = Object.keys(category).map(item => category[item])

// console.log(keys);
// console.log(category);
// console.log(categorys);

const page = {

  data: {
    // 控制模态提示框的显示隐藏
    modalHidden: true,
    // 控制顶部调出来的actionSheet显示隐藏
    actionSheetHidden: true,
    // 控制orderBy调出来的actionSheet显示隐藏
    orderByActionSheetHidden: true,
    // orderBy排序字段
    orderByActionSheetItems:['综合排序','最新商品','价格从高到低','价格从低到高'],
    // categorys: categorys,
    keyword: ''
  }

  ,bindItemTap(e) {

    const target = e.target

    const item = target.dataset.item
    const group = target.dataset.group
    console.log('bindItemTap')
    console.log(item)

    outer:
    for(let i = 0, li = categorys.length; i < li; i++){
      let category = categorys[i]
      let items = category.items
      let name = category.name
      if( name === group ){
        for(let j = 0, lj = items.length; j < lj; j++){
          let data = items[j]
          if(data === item){
            category.selectedIndex = j
            break outer;
          }
        }
      }
    }

    this.setData({
      categorys: categorys,
      category: category,
      currentIndex: -1
    })

    this.hideActiveSheet()
  }

  ,onLoad(options) {
    // console.log(app.keyword)
    const keyword = options.keyword
    // console.log(keyword);
    if (keyword && keyword.trim()) {
      this.setData({
        keyword: keyword
        ,categorys: categorys
      })
    }
    this.setData({
      categorys: categorys
    })
  }
  // 查看全部 start
  ,viewAll(){
    wx.navigateTo({
      url:'../all/all'
    })
  }
  // 查看全部 end

  // 排序相关 start
  ,orderBy(){
    this.orderByShowActionSheet()
  }

  ,orderByShowActionSheet(){
    this.setData({
      orderByActionSheetHidden: false,
    })
  }

  ,orderByHideActiveSheet(){
    this.setData({
      orderByActionSheetHidden: true,
    })
  }

  ,orderByBindItemTap(e){
    console.log('orderByBindItemTap')
    const value = e.target.dataset.item
    console.log(value)
    this.orderByHideActiveSheet()
  }

  ,orderByActionSheetChange() {
    this.orderByHideActiveSheet()
  }
  // 排序相关 end

  // 顶部tap操作 start
  ,switchSelectCond(e) {
    const item = e.target.dataset.item
    const cat = category[item]
    const index = keys.indexOf(item)
    if (item) {
      this.showActionSheet(cat)
      this.setData({
        currentIndex:index
      })
    }
  }
  ,showActionSheet(category = {}) {
    console.log(category);
    this.setData({
      actionSheetHidden: false,
      category: category
    })
  }
  ,hideActiveSheet() {
    this.setData({
      actionSheetHidden: true,
      currentIndex: -1
    })
  }

  ,actionSheetChange() {
    this.hideActiveSheet()
  }

  // 顶部tap操作 end
  ,bindChange(e) {
    console.log( e.detail.value )
    const value = e.detail.value
    if(value && value.trim()){
      this.setData({
        keyword: value
      })
    }
  }

  ,search() {
    const keyword = this.data.keyword
    console.log(keyword);
    if (!keyword || !keyword.trim()) {
      return this.showModal('你还没有输入内容哦亲')
    }
    wx.navigateTo({
      url: '../result/result?keyword=' + keyword
    })
  }
}

// page.openModal = common.openModal
// page.closeModal = common.closeModal
// page.bindChange = common.bindChange
// page.search = common.search

Object.assign(page, common)
Page(page)
  // console.log(app.APP_NAME);
  // console.log('当前有调小程序版本是：%s',app.version);
