import common from '../../common/app'
import { uniquePush, getLikesFromStorage, setLikesToStorage, removeLikesFromStorate, fetch, getShortCid } from '../../utils/utils'
import API from '../../common/API'
let currentIndex = 0
/**
 * [page description]
 * @type {Object}
 *  逛一逛整体逻辑
 *   0. 创建一个队列，放置要进行动画的数据
 *   1. 从服务端拿到的数据放置到全局
 *     1.1 从本地取出历史上的“喜欢”数据
 *     1.2 从服务端拿到的数据若已经存在于上面的“喜欢”数据中，则过滤掉
 *   2. 从已经经过过滤操作的全局数据中拿2条数据
 *   3. 点击“喜欢” or “不喜欢”（若点击“喜欢”则放置到本地中的“喜欢列表中”）
 *     3.1 第一条数据卡片飞走
 *     3.2 飞走之后，偷偷地原路飞回，并把其zindex从1置为0
 *     3.3 飞回的卡片进行数据填充
 */
// 全局变量 --start
// const getDataLength = 10
// const vendor = {
//   originDataPool: null,
//   // 把需要做动画的数据放入队列中。以右边作为队头，左边作为队尾
//   queue: null,
//   dataPool: null,
//   startID: 0,
//   endID: 0
// }
const queueLength = 2
// // 全局变量 --end
const page = {
  onLoad(){
    // 为了防止页面缓存，每次刷新页面之后都会重置currentIndex
    currentIndex = 0
    // this.renderByDataFromServer()
    // 拿到原始数据，然后过滤，然后生成队列，然后渲染
    this.getDataFromServer()
        .then(this.filter)
        .then(this.createQueue)
        .then(this.render).catch(e => console.log(e))
  }

  ,render(gotogos){
    console.log('render...');
    this.setData({ gotogos })
  }

  ,createQueue(gotogos){
    console.log('createQueue...');
    return gotogos.slice(0, 10)
  }

  ,filter(gotogos){
    console.log('filter...');
    // throw 'filter error'
    const likes = getLikesFromStorage()
    // TODO
    console.log(likes);
    return gotogos
  }

  ,getDataFromServer(){
    console.log('getDataFromServer...');
    wx.showToast( { title: '玩命搜索中',icon: 'loading' } )
    return fetch({
      url: API._giftBrowser.url,
      // 左小右大
      data:{"read_interval": [0,0]},
      method:'post'
    }).then(result => {
      const { errMsg, statusCode, data } = result
      console.log(data);
      if( errMsg === 'request:ok' && statusCode === 200 ) {
        console.log(`${API.giftBrowser.url}接口返回的数据：`, result);
        const cids = []
        const likes = getLikesFromStorage()
        const gotogos = data.meta_infos.map(meta_info => {
          const shortId = getShortCid(meta_info.cid);
          meta_info.cid = shortId
          cids.push(shortId)
          return meta_info
        })
        console.log(cids);
        this.setData({ cids })
        return gotogos
      } else {
        console.log(`${API.giftBrowser.url}接口失败：`, result);
      }
    }).catch(result => {
      console.log(`${API.giftBrowser.url}接口错误：`, result);
    })
  }

  ,animate(ani={rotate:-30, translateX:-400}){
    const cids = this.data.cids
    // 如果到最后，提示用户并返回
    if(currentIndex === cids.length - 1){
      wx.showToast({title: '已经到最后啦亲~', duration: 1000})
      return;
    }

    const {rotate, translateX} = ani
    /**
     * 创建一个动画实例animation。调用实例的方法来描述动画。最后通过动画实例的export方法
     * 导出动画数据传递给组件的animation属性
     * 注意；export方法每次调用后会清理掉之前的动画操作
     */
    let currentCid = cids[currentIndex++]
    this.setData({
      currentCid,
      // 取消 scale 和 opaticy 增加动画流畅性
      animationData: wx.createAnimation({
                        timingFunction:'ease',
                        duration: 380
                    })
                        // .scale(1.5, 1.5)
                        .rotate(rotate)
                        // .translate3d(translateX,0,0)
                        .translate(translateX, 50)
                        // .opacity(0)
                        .step().export()
      })
    
    return this.data.gotogos.filter( gotogo => gotogo.cid === currentCid )[0]
  }

  /**
   * 喜欢和不喜欢需要做一下函数节流。
   * 防止用户点击过快
   */
  ,dislike(){
    // console.log(this.data.cids);
    const cid = this.animate().cid
    let dontLikes = wx.getStorageSync('dontLikes')
    if(!dontLikes){
      dontLikes = [ cid ]
    }else{
      uniquePush(dontLikes, cid)
    }
    wx.setStorageSync( 'dontLikes', dontLikes )
  }

  ,like(){
    // console.log(this.data.cids);
    const {cid, title, cover_image_url, price} = this.animate({rotate:30,translateX:400})
    // 精简要存入本地的对象。只存需要的字段。
    const gotogo = {cid, title, cover_image_url, price}
    let likes = wx.getStorageSync('likes')
    if(!likes){
      likes = [ gotogo ]
    }else{
      uniquePush(likes, gotogo, 'cid')
    }
    wx.setStorageSync( 'likes', likes )
  }
}

// assign会进行递归拷贝
Object.assign(page, common)
Page(page)
