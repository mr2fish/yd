// 1.  礼物搜索接口（giftq）
// 2.  逛一逛接口（gift_browser）
// 3.  SKU接口（getfullsku）
// 4.  获取文章图文信息接口（已支持https）
// 5. 文章阅读数接口
// 6. 礼物首页feed流几口gift_default
export default API = new function(){

  const fetchURL = "https://c.diaox2.com/"

  return {
    // 礼物搜索接口
    giftq: {
      url: ''
    }
    // 逛一逛接口
    ,giftBrowser: {
      url: ''
    }
    // SKU接口
    ,getfullsku: {
      // https://c.diaox2.com/view/app/?m=wsku&id=2345
      url: `${fetchURL}view/app/`
    }
    // 获取文章信息
    ,getArticle: {
      // https://c.diaox2.com/view/app/?m=wechat&id=2345
      url: `${fetchURL}view/app/`
    }
    // 获取文章阅读数
    ,getViewCount: {
      url: ''
    }
    // 首页攻略信息
    ,getViewCount: {
      url: ''
    }
    ,giftDefault: {
      url: ''
    }
  }
}
