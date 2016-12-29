import API from '../../common/API'
Page({
  data:{
    scrollY: true
  },
  onLoad(options) {
    try {
      console.log('sku onload...');
      this.setData({load: false})
      wx.showToast({ title: '玩命加载中',icon: 'loading',duration: 10000 })
      const url = `${API.getFullSku.url}/${options.sid || 1668}.html`
      // const url = `${API.getFullSku.url}/${options.sid}.html`
      wx.request({
        url: url,
        success: (result) => {
          try {
            const {errMsg, statusCode, data} = result
            if(errMsg === 'request:ok' && statusCode == 200){
              console.log(`${url}接口成功：`, result);
              const sku = data.data[0]
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
                sale.url = `http://c.diaox2.com/cms/diaodiao/mart2/${png}`
                sale.ratio = ratio
                return sale
              })
              this.setData({sku})
            }else{
              console.log(`${url}接口失败：`, result);
            }
          } catch (e) {
            console.log('发生了错误')
            console.log(e)
            wx.redirectTo({url:'../error/error'})
          }
        },
        fail: (result) => {
          console.log(`${url}接口错误：`, result)
        },
        complete: () => {
          wx.hideToast()
          this.setData({load: true})
        }
      })
    } catch (e) {
      console.log('发生了错误')
      console.log(e)
      wx.redirectTo({url:'../error/error'})
    }
  }
  ,buy(event){
    const url = event.target.dataset.url
    if(url){
      this.setData({url, show: true, scrollY: false})
      // wx.showModal({
      //   title: '长按复制，在浏览器下打开',
      //   content: url,
      //   showCancel: false
      // })
    }
  }
  ,confirm(){
    this.setData({show: false,scrollY: true})
  }
})
