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
   if(!allArticles || allArticles.length === 0 ) return;
   const end = start + pageLength
   const alreadyDisplayArticles = this.data.articles || []
   const shouldLoadArticles = allArticles.slice(start, end)
   const articles = alreadyDisplayArticles.concat(shouldLoadArticles)
   if(articles.length === allArticles.length){
     setTimeout(() => {
       this.setData({ done: true })
     }, 120)
   }
   this.setData({ articles })
   this.allArticles = allArticles
   start += pageLength
 }
 // 滚动到底部事件监听 -end
}
Object.assign(page, common)
Page(page)
