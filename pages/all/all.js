//index.js
//获取应用实例
import common from '../../common/app'
import category from '../../common/category'
import articles from '../../common/articles'
const app = common.app

const page = {
  onLoad() {
    this.setData({
      articles:articles
    })
  }
}

Page(page)
