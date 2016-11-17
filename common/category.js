/**
 *  模块单例性
 *   定义好的模块，在其他一个页面
 */
const defaultItem = '不限'
const categorys = {
  relation: {
    name: 'relation',
    icon:'icon/object.png',
    title: '关系',
    allTitle: '送礼对象',
    items: ["爸爸","妈妈","老公男友","老婆女友","基友","闺蜜","朋友","同事","老板"],
    selectedIndex: -1
  },
  scene: {
    name:'scene',
    title: '场景',
    allTitle: '送礼场景',
    icon:'icon/scene.png',
    items: ["圣诞节","新年","过年回家","情人节","生日","纪念日","告白","乔迁","新婚"],
    selectedIndex: -1
  },
  category: {
    name: 'category',
    icon:'icon/gifts.png',
    title: '品类',
    allTitle: '送礼品类',
    items: ["家具家装","生活日用","家用电器","办公用品","时尚悦己","个护化妆","科技数码","运动健康","吃喝旅行","母婴玩具","汽车户外"],
    selectedIndex: -1
  },
  price: {
    name: 'price',
    icon:'icon/price.png',
    title: '价格',
    allTitle: '礼物价格',
    items: ["0-200","200-500","500-800","800+"],
    selectedIndex: -1
  }
}

// gift-result 礼物搜索页需要用到的排序字段
const PX = {
  zonghe:'综合排序',
  latest:'最新商品',
  price_up_to_down:'价格从高到底',
  price_down_to_up:'价格从低到高'
}

export default categorys
export { defaultItem, PX }
