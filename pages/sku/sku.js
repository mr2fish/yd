import common from '../common/common'
import res from '../common/sku'
import API from '../../utils/API'
const app = common.app

wx.showToast({
  title: '加载中',
  icon: 'loading'
})

const page = {
  onLoad(options) {
    const sid = options.sid || 1124
    const getfullsku = `${API.getFullSku.url}/${sid}.html`
    // SKU售卖链接各个常见电商的log
    const URL_PREFIX = 'http://c.diaox2.com/cms/diaodiao/mart2/'
    const self = this
    wx.request({
      url: getfullsku,
      data: {id: sid},
      header: {'Content-Type': 'application/json'},
      success: function(res) {
        const data = res.data.data
        const sku = data[0]
        const sales = sku.sales
        let png = 'default.png'
        let ratio = 2.416
        sku.sales = sku.sales.map(sale => {
          const link = sale.link_m_cps || sale.link_pc_cps || sale.link_m_raw || sale.link_pc_raw
          if(/tmall|天猫/.test(sale.mart) || link.indexOf('tmall.com') !== -1 ){
            png = 'tmall.png'
            ratio = 7.138
          }else if (link.indexOf('taobao.com') !== -1 ) {
            png = 'tb.png'
          }else if (link.indexOf('jd.com') !== -1 ) {
            png = 'jd.png'
            ratio = 2.722
          }else if(link.indexOf('amazon.cn') !== -1 ){
            png = 'amazoncn.png'
            ratio = 2.25
          }else if (link.indexOf('amazon.jp') !== -1 ) {
            png = 'amazonjp.png'
            ratio = 4
          }else if (link.indexOf('shopbop.com') !== -1 ) {
            png = 'shopbop.png'
            ratio = 6.25
          }else if (link.indexOf('rakuten.com') !== -1 ) {
            png = 'rakuten.png'
            ratio = 2
          }else if (link.indexOf('amazon.') !== -1 ) {
            png = 'amazon.png'
            ratio = 3.194
          }
          sale.url = URL_PREFIX + png
          sale.ratio = ratio
          return sale
        })
        self.setData({
          sku: sku
        })
        wx.hideToast()
      }
    })
  }
  ,buy(event){
    const url = event.target.dataset.url
    wx.showModal({
      title: '长按复制下列链接，在浏览器下打开',
      content: url,
      showCancel: false
    })
  }
}
Object.assign(page, common)
Page(page)
