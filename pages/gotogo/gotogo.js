import common from '../../common/app'
import {
  uniquePush,
  getLikesFromStorage,
  setLikesToStorage,
  removeLikesFromStorate
} from '../../utils/utils'
import API, { HEADER as header } from '../../common/API'
const app = common.app
let currentIndex = 0
const page = {
  onLoad(){
    wx.showToast({title: '玩命搜索中',icon: 'loading'})
    // 为了防止页面缓存，每次刷新页面之后都会重置currentIndex
    currentIndex = 0;
    this.renderByDataFromServer()
  }
  ,renderByDataFromServer(){
    const self = this
    wx.request({
      url: API.giftBrowser.url,
      header: header,
      success(result) {
        console.log(result);
        const cids = []
        // 处理数据。出于性能上的考虑，我们在一次循环中处理完毕。
        // 过滤掉已经存在于“喜欢”列表中的数据
        const likes = getLikesFromStorage()
        const gotogos = result.data.meta_infos.map(meta_info => {
          const cid = Number(meta_info.data.nid )
          cids.push( cid )
          meta_info.data.cid = cid
          meta_info.data.title = meta_info.title
          return meta_info.data
        })
        self.setData({gotogos, cids})
      },
      fail(res){
        console.log(`${API.giftBrowser.url}接口失败`);
      },
      complete(){
        wx.hideToast()
      }
    })
  }
  ,animate(ani={rotate:-20, translateX:-200}){
    const cids = this.data.cids
    // 如果到最后，提示用户并返回
    if(currentIndex === cids.length - 1){
      wx.showToast({title: '已经到最后啦亲~',duration: 1000})
      return;
    }

    const {rotate, translateX} = ani
    /**
     * 创建一个动画实例animation。调用实例的方法来描述动画。最后通过动画实例的export方法
     * 导出动画数据传递给组件的animation属性
     * 注意；export方法每次调用后会清理掉之前的动画操作
     */
    var animation = wx.createAnimation({duration: 410,timingFunction: 'ease'})
    this.animation = animation
    animation.scale(1.5,1.5).rotate(rotate).translateX(translateX).opacity(0).step()
    let currentCid = cids[currentIndex++]
    this.setData({currentCid,animationData:animation.export()})
    return currentCid
  }

  ,dislike(){
    this.animate()
  }

  ,like(){
    const cid = this.animate({rotate:20,translateX:200})
    // 在客户端维护一个喜欢列表
    // -- test start
      // removeLikesFromStorate()
    // -- test end
    // let likes = getLikesFromStorage()
    // setLikesToStorage(likes, cid)
  }
}

// assign会进行递归拷贝
Object.assign(page, common)
Page(page)
