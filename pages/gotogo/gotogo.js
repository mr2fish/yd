import common from '../../common/app'
import {
  uniquePush,
  getLikesFromStorage,
  setLikesToStorage,
  removeLikesFromStorate
} from '../../utils/utils'
import API, { HEADER as header } from '../../utils/API'
// import gotogos from '../../common/gotogo'
const app = common.app
// -- 公共代码start
// let currentIndex = 0
// 取出喜欢列表
// const likes = getLikesFromStorage()
// console.log(likes);
// 取出数据
// 筛选符合条件的数据
// const data = gotogos.filter(gotogo => likes.indexOf(gotogo.cid) === -1)
// const cids = data.map( gotogo => Number(gotogo.cid) )
// 反转数组。由于zindex最后的在最上面，所以反转数组使第一个元素变成
// 最后一个，这样在界面上就显示为正常的顺序了
// gotogos.reverse()
// -- 公共代码start
const page = {
  data: {
     animationData: {}
  }
  ,onLoad(){
    // this.setData({
    //   gotogos: data
    // })
    // console.log( cids[0] );
    // // 为了防止页面缓存，每次刷新页面之后都会重置currentIndex
    // currentIndex = 0;
    this.renderByDataFromServer()
  }
  ,renderByDataFromServer(){
    const self = this
    wx.request({
      url: API.giftBrowser.url,
      header: header,
      success(result) {
        console.log(result);
      },
      fail(res){
        console.log(`${API.giftBrowser.url}接口失败`);
      },
      complete(){
        wx.hideToast()
      }
    })
  }
  ,animate(ani={rotate:-20, translateX:-100}){
    // 如果到最后，提示用户并返回
    if(currentIndex === cids.length - 1){
      wx.showToast({
        title: '已经到最后啦亲~',
        duration: 1000
      })
      return;
    }

    const {rotate, translateX} = ani
    /**
     * 创建一个动画实例animation。调用实例的方法来描述动画。最后通过动画实例的export方法
     * 导出动画数据传递给组件的animation属性
     * 注意；export方法每次调用后会清理掉之前的动画操作
     */
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })

    this.animation = animation
    animation.scale(1.5,1.5).rotate(rotate).translateX(translateX).opacity(0).step()
    let currentCid = cids[currentIndex++]
    this.setData({
      animationData:animation.export(),
      currentCid: currentCid
    })
    // 上面的动画结束后，再次调用动画，把动画元素移出屏幕，防止用户
    // 误点击一个看不见的卡片，然后跳转
    setTimeout(function() {
      animation.translateX(1000).step()
      this.setData({
        animationData:animation.export()
      })
    }.bind(this),400)
    return currentCid
  }

  ,dislike(){
    this.animate()
  }

  ,like(){
    const cid = this.animate({rotate:20,translateX:100})
    // 在客户端维护一个喜欢列表
    // -- test start
      // removeLikesFromStorate()
    // -- test end
    let likes = getLikesFromStorage()
    setLikesToStorage(likes, cid)
  }
}

Object.assign(page, common)
Page(page)
