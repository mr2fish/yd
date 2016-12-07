import common from '../../common/app'
import category from '../../common/category'
let pageLength = 20
let start = 0
const page = {
  onLoad(options) {
    // 那次重启页面都重置初始条件，否则在手机上会缓存这两个变量的值
    // 下次进来时，会以上次设置的值作为初始值
    pageLength = 20
    start = 0
    wx.getStorage({
      key:'allRaiders',
      success: (result) => {
        console.log('获取本地存储allRaiders的数据：', result)
        this.loadNewPage(result.data)
      },
      fail(result){
        console.log('获取本地存储allRaiders错误：', result)
      }
    })
  }
  ,scrolltolower(){
    this.loadNewPage()
  }
  // 滚动到底部事件监听 -start
 ,loadNewPage(allArticles = this.allArticles){
   console.log("25,", allArticles);
   if(!allArticles || allArticles.length === 0 ) return;
   const end = start + pageLength
   console.log('28', end);
   const alreadyDisplayArticles = this.data.articles || []
   console.log('30', alreadyDisplayArticles);
   const shouldLoadArticles = allArticles.slice(start, end)
   console.log('32', shouldLoadArticles);
   if(!shouldLoadArticles || shouldLoadArticles.length === 0) this.setData({ done: true });
   const articles = alreadyDisplayArticles.concat(shouldLoadArticles)
   console.log('35', shouldLoadArticles);
   this.setData({ articles })
   this.allArticles = allArticles
   start += pageLength
   console.log('39', start);
 }
 // 滚动到底部事件监听 -end
}
Object.assign(page, common)
Page(page)
