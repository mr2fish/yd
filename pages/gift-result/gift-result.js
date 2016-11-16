import common from '../common/common'
import { handleTitle, extractPriceFromPriceString } from '../../utils/utils'
import API, {HEADER as header} from '../../utils/API'
import result from '../common/search_result'
import category, { defaultItem, PX } from '../common/category'
const app = common.app
const keys = Object.keys(category)
const categorys = Object.keys(category).map(item => category[item])

const page = {

  data: {
    categorys,
    // 控制顶部调出来的actionSheet显示隐藏
    actionSheetHidden: true,
    // 控制orderBy调出来的actionSheet显示隐藏
    orderByActionSheetHidden: true,
    // orderBy排序字段
    orderByActionSheetItems:[PX.zonghe, PX.latest, PX.price_up_to_down, PX.price_down_to_up],
    currentPX: 0 // 当前默认是综合排序
  }



  ,bindItemTap(e) {
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
    this.setData({categorys, category, currentIndex: -1})
    this.hideActiveSheet()
  }

  ,renderByQuery(query){

  }

  ,onLoad(options) {
    // 取出上游页面传递过来的数据
    let queryParameterString = options.queryParameter || '{"query": "雨伞"}'
    // 从首页传过来的数据
    // or 从礼物筛选页传过来的数据
    // queryParameterString = '{"relation": "妈妈", "scene": "新年", "category": "生活日用", "price": [500, 800]}'
    if(queryParameterString) {
      const queryObject = JSON.parse(queryParameterString)
      const query = queryObject.query
      console.log(queryObject);
      // 如果有query，就在搜索结果页中的搜索条中赋值
      if (query) {
        this.setData({query})
      }

      setTimeout(() => {
        // console.log(result);
        const meta_infos = result.meta_infos
        // raiders 攻略
        let raiders = []
        // goods 单品
        let goods = []
        const aids = result.aids
        for(let aid of aids){
          let meta_info = meta_infos[aid]
          const {ctype, cover_image_url} = meta_info
          if( !/http:\/\/|https:\/\//i.test(cover_image_url) ){
            meta_info.cover_image_url = `http://a.diaox2.com/cms/sites/default/files${cover_image_url}`
          }
          meta_info.aid = aid
          meta_info.title = handleTitle(meta_info.title)

          if(ctype !== 2){
            raiders.push(meta_info)
          }else if(ctype === 2){
            meta_info.price_num = extractPriceFromPriceString(meta_info.price)
            goods.push(meta_info)
          }
        }
        // 攻略最多只有2篇
        if( raiders.length > 2){
          raiders = raiders.slice(0, 2)
        }
        /**
         * 1. ctype不准  不是不准，是文章的ctype应该是2
         * 2. remove_aids数据不全
         * 3. 单品无price过滤掉
         *    price: 'N/A'
         */
        // 单品至少有2篇
        // 不足2篇，remove_aids来补
        if( goods.length < 2 ){
          const aids = result.remove_aids
          // console.log(aids);
          for(let aid of aids){
            let meta_info = meta_infos[aid]
            if(!meta_info) continue
            if(meta_info.ctype === 2){
              console.log('done');
              meta_info.price_num = extractPriceFromPriceString(meta_info.price)
              goods.push(meta_info)
            }else{
              console.log('done else');
            }
          }
        }
        this.setData({raiders, goods, goods_copy: goods})

      }, 200)

      // wx.request({
      //   url: 'http://s.diaox2.com/ddsearch_dev/q',
      //   header: {'Content-Type': 'application/json'},
      //   data: queryObject,
      //   success(res) {}
      // })

    }
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
    this.setData({orderByActionSheetHidden: false})
  }

  ,orderByHideActiveSheet(){
    this.setData({orderByActionSheetHidden: true})
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
    const query = e.detail.value
    if(value && value.trim()){
      this.setData({query})
    }
  }
  
  ,orderByBindItemTap(e){
    console.log('orderByBindItemTap')
    const value = e.target.dataset.item
    // 取出当前的排序规则
    let currentPX = this.data.currentPX
    // 根据选取的item确定下次的排序规则
    let nextPX = this.data.orderByActionSheetItems.indexOf(value)
    // 如果本次排序规则和下次排序规则一致，则关掉ActiveSheet，直接返回
    if( currentPX === nextPX) return this.orderByHideActiveSheet();
    switch(value){
      case PX.zonghe:
        this.orderByZonghe()
      break
      case PX.latest:
        this.orderByLatest()
      break
      case PX.price_up_to_down:
        this.orderByPrice()
      break;
      case PX.price_down_to_up:
        this.orderByPrice('down_to_up')
      break;
    }
    this.setData({currentPX: nextPX})
    this.orderByHideActiveSheet()
  }
  ,orderByZonghe(){
    // 把最初的综合排序记住，直接恢复即可
    this.setData({goods: this.data.goods_copy})
    console.log(this.data.goods_copy);
  }
  ,orderByLatest(){
    this.setData({goods: this.data.goods.sort((prev, next) => next.aid - prev.aid)})
  }
  ,orderByPrice(dir='up_to_down'){
    if(dir === 'down_to_up'){
      this.setData({goods: this.data.goods.sort((prev, next) => prev.price_num - next.price_num)})
    }else{
      this.setData({goods: this.data.goods.sort((prev, next) => next.price_num - prev.price_num)})
    }
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
