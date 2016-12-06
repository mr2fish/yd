import common from '../../common/app'
import { handleTitle, extractPriceFromPriceString, objectToQueryString, isNullObject, type, fetch } from '../../utils/utils'
import API from '../../common/API'
import category, { defaultItem, ORDER_BY } from '../../common/category'
const keys = Object.keys(category)
const categorys = keys.map(item => category[item])

console.log("category:", category);
console.log("keys:", keys);
console.log("categorys:", categorys);

const page = {

  data: {
    categorys,
    // 控制顶部调出来的actionSheet显示隐藏
    actionSheetHidden: true,
    // 控制orderBy调出来的actionSheet显示隐藏
    orderByActionSheetHidden: true,
    // orderBy排序字段
    orderByActionSheetItems: [
      ORDER_BY.zonghe, // 综合排序
      ORDER_BY.latest, // 最新
      ORDER_BY.price_up_to_down, // 价格从高到低
      ORDER_BY.price_down_to_up // 价格从低到高
    ],
    // 当前默认是综合排序
    currentPX: 0
  }

  ,scrolltolower(e){
    console.log('滚动到底部啦');
    const goods = this.data.goods
    console.log(goods);
  }

  ,tapContentChange(item, group){
    outer:
    for(const category of categorys){
      let {items, name} = category
      if( name === group ){
        for(let i = 0, len = items.length; i < len; ++i){
          if(items[i] === item){
            category.selectedIndex = i
            break outer;
          }
        }
      }
    }
    return categorys
  }

  ,bindItemTap(e) {
    const {item, group} = e.target.dataset
    const categorys = this.tapContentChange(item, group)
    this.setData({ categorys })
    this.hideActiveSheet()
    this.renderByDataFromServer(this.packageQueryParam())
  }

  ,search(){
    this.renderByDataFromServer(this.packageQueryParam())
  }

  ,renderByDataFromServer(queryObject){
    // fetch( {url: 'https://c.diaox2.com/view/app/giftq/query=电脑'} ).then(result => {
    //   console.log(result);
    // }).catch(result => console.log(result))
    const url = `${API.giftq.url}/${objectToQueryString(queryObject)}`
    fetch( url ).then(result => {
      console.log(`${url}返回的数据：`, result);
      // console.log(result);
      result = result.data
      const aids = result.aids
      // console.log(aids);
      // console.log(meta_infos);
      // console.log(aids);
      // raiders 攻略
      let raiders = []
      // goods 单品
      let goods = []
      // 编译之后，变为下面这行代码！如果aids是undefined将会抛错！！！！
      // var _iterator2 = aids[Symbol.iterator]()
      // TypeError: Cannot read property 'Symbol(Symbol.iterator)' of undefined
      const reg = /http:\/\/|https:\/\//i
      const prefix = 'http://a.diaox2.com/cms/sites/default/files'

      for(let each of aids){
        const [ aid, type ] = each
        const meta_info = result[`meta_infos_${type}`][aid]
        // let meta_info = meta_infos[aid]
        // if(!meta_info) continue;
        const {ctype, thumb_image_url} = meta_info

        if( thumb_image_url && !reg.test(thumb_image_url) ){
          meta_info.thumb_image_url = `${prefix}/${thumb_image_url}`
        }

        meta_info.aid = aid
        meta_info.title = handleTitle(meta_info.title || meta_info.format_title)

        if( ctype == void 0 ){
          // console.log('SKU数据：', meta_info);
          meta_info.price_num = extractPriceFromPriceString(meta_info.price)
          const [ pic ] = meta_info.pics
          meta_info.thumb_image_url = pic.url
          goods.push(meta_info)
        }else if(  ctype === 2 ){
          meta_info.price_num = extractPriceFromPriceString(meta_info.price)
          goods.push(meta_info)
        }
         else if(ctype !== 2 && ctype !== 3) // 过滤掉专刊数据（ctype === 3）
        {
          const rendered_keywords = meta_info.rendered_keywords
          if(rendered_keywords){
            meta_info.rendered_keywords  = rendered_keywords.map(keywords => keywords[0])
          }
          raiders.push(meta_info)
        }

      }

      // 在本地记录下所有攻略，以供查看“全部”
      wx.setStorage({key: "allRaiders",data: [...raiders]})
      // 攻略最多只有2篇
      if( raiders.length > 2){
        raiders = raiders.slice(0, 2)
      }
      // console.log('攻略数据：', raiders);
      /**
       * 1. ctype不准  不是不准，是文章的ctype应该是2
       * 2. remove_aids数据不全
       * 3. 单品无price过滤掉
       *    price: 'N/A'
       */
      // 单品至少有2篇
      // 不足2篇，remove_aids来补
      if( goods.length < 2 ){
        // 做一下非空判定
        // 鹏哲说如果全部命中，则remove_aids这个字段就没有值
        const aids = result.remove_aids || []
        // console.log(aids);
        for(let each of aids){
          const [ aid, type ] = each
          const meta_info = result[`meta_infos_${type}`][aid]
          // let meta_info = meta_infos[aid]
          // if(!meta_info) continue
          if(meta_info.ctype === 2){
            console.log('done');
            meta_info.price_num = extractPriceFromPriceString(meta_info.price)
            goods.push(meta_info)
          }else{
            console.log('done else');
          }
        }
      }
      // console.log('单品数据：', goods);
      this.setData({raiders, goods, goods_copy: goods})
      // console.log(goods);
    }).catch(result => console.log(`${API.giftq.url}接口错误：`,result))
  }
  /**
   * 组装查询参数，共有3个地方调用
   *   1. 从首页 or 筛选页跳转到结果页         --onLoad中调用
   *   2. 切换category item的值              --bindItemTap中调用
   *   3. 在筛选页搜索框中输入内容，并触发搜索  --search中调用
   * 该函数做3件事情
   *   1. 组装参数
   *   2. 调用“切换顶部的tab显示内容”的函数
   *   3. 根据参数发送请求，并调用 renderByDataFromServer 函数
   */
  ,packageQueryParam(queryParameter){
    // console.log(queryParameter);
    // 取出上游页面传递过来的数据
    // 从首页传过来的数据
    // or 从礼物筛选页传过来的数据
    // queryParameterString = '{"relation": "妈妈", "scene": "新年", "category": "生活日用", "price": [500, 800]}'
    wx.showToast({ title: '玩命搜索中', icon: 'loading',duration: 10000 })
    //  组装参数
    let queryObject = {}
    if(queryParameter){ // 从index和filter过来的请求走第一个
      if(type(queryParameter) === 'string'){
        queryObject = JSON.parse(queryParameter)
      }else if(type(queryParameter) === 'object'){
        queryObject = queryParameter
      }
    }
     else // bindItemTap 和 search走这个
    {
      this.data.categorys.forEach((category) => {
        const selectedItem = category.items[category.selectedIndex]
        if(selectedItem && selectedItem !== defaultItem){
          queryObject[category.name] = selectedItem
        }
      })
    }
    const query = queryObject.query || this.data.query
    if (query) {
      queryObject.query = query
      this.setData({query})
    }else{
      this.setData({query:''})
    }
    if(isNullObject(queryObject)) return;
    return queryObject
  }

  ,onLoad(options) {

    wx.showToast({ title: '玩命搜索中',icon: 'loading',duration: 10000 })
    const queryObject = this.packageQueryParam(options.queryParameter)
    // console.log(queryObject);
    this.renderByDataFromServer(queryObject)
  }
  // 查看全部 start
  ,viewAll(){
    wx.navigateTo({url:'../all/all'})
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
    const index = keys.indexOf(item)
    console.log(item, index);
    if (item) {
      const cat = category[item];
      console.log(cat);
      // debugger
      this.showActionSheet(cat)
      this.setData({currentIndex:index})
    }
  }

  ,showActionSheet(cat = {}) {
    this.setData({category: cat, actionSheetHidden: false})
    // this.setData({
    //   animationData: wx.createAnimation({
    //       timingFunction:'ease'
    //   }).height(100).step().export()
    // })
  }

  ,hideActiveSheet() {
    this.setData({actionSheetHidden: true,currentIndex: -1})
    // this.setData({
    //   animationData: wx.createAnimation({
    //       timingFunction:'ease'
    //   }).height(0).step().export()
    // })
  }

  ,actionSheetChange() {
    this.hideActiveSheet()
  }

  // 顶部tap操作 end
  ,bindChange(e) {
    const query = e.detail.value
    if(query && query.trim()){
      this.setData({query})
    }else{
      this.setData({query:''})
    }
  }

  ,orderByBindItemTap(e){
    const value = e.target.dataset.item
    // 取出当前的排序规则
    let currentPX = this.data.currentPX
    // 根据选取的item确定下次的排序规则
    let nextPX = this.data.orderByActionSheetItems.indexOf(value)
    // 如果本次排序规则和下次排序规则一致，则关掉ActiveSheet，直接返回即可
    if( currentPX === nextPX ) return this.orderByHideActiveSheet();
    switch(value){
      case ORDER_BY.zonghe:
        this.orderByZonghe()
      break
      case ORDER_BY.latest:
        this.orderByLatest()
      break
      case ORDER_BY.price_up_to_down:
        this.orderByPrice()
      break;
      case ORDER_BY.price_down_to_up:
        this.orderByPrice('down_to_up')
      break;
    }
    this.setData({currentPX: nextPX})
    this.orderByHideActiveSheet()
  }
  ,orderByZonghe(){
    // 把最初的综合排序记住，直接恢复即可
    this.setData({goods: this.data.goods_copy})
  }
  ,orderByLatest(){
    this.setData({goods: this.data.goods.sort((prev, next) => next.latest_version - prev.latest_version)})
  }
  ,orderByPrice(seq = 'up_to_down'){
    seq === 'up_to_down'?
     this.setData({goods: this.data.goods.sort((prev, next) => next.price_num - prev.price_num)}):
     this.setData({goods: this.data.goods.sort((prev, next) => prev.price_num - next.price_num)})
  }
}
Object.assign(page, common)
Page(page)
