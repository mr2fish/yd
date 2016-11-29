import common from '../../common/app'
import { uniquePush, getLikesFromStorage, setLikesToStorage, removeLikesFromStorate, fetch, getShortCid, extend, throttle } from '../../utils/utils'
import API from '../../common/API'
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
const queueLength = 2
const duration = 380
// 处理后的数据池指针。每次pointer都指向当前数据。
let pointer = 1
let restLength = 50
// // 全局变量 --end
const page = {
  onLoad(){
    // 为了防止页面缓存，每次刷新页面之后都会重置currentIndex
    pointer = 1
    // this.renderByDataFromServer()
    // 拿到原始数据，然后过滤，然后生成队列，然后渲染
    this.getDataFromServer()
        .then(this.filter)
        .then(this.createQueue)
        .then(this.render).catch(e => console.log(e))
  }
  ,render(queue){
    console.log('render...');
    this.setData({ queue })
  }
  ,getReadInterval(){
    return wx.getStorageSync('read_interval') || [0, 0]
  }
  ,createQueue(gotogos){
    console.log('createQueue...');
    this.setData({ gotogos })
    const queue = gotogos.slice(0, queueLength)
    console.log(queue)
    return queue
  }
  ,filter(gotogos){
    console.log('filter...');
    const likes = getLikesFromStorage()
    // TODO
    return gotogos
  }
  ,getDataFromServer(){
    console.log('getDataFromServer...');
    wx.showToast( { title: '玩命搜索中',icon: 'loading' } )
    const [start, end] = this.getReadInterval()
    const url = `${API.giftBrowser.url}/read_interval[0]=${start}&read_interval[1]=${end}`
    return fetch(url).then(result => {
      const { errMsg, statusCode, data } = result
      // console.log(data);
      console.log(`${url}接口返回的数据：`, result);
      const gotogos = data.meta_infos.map(meta_info => {
        meta_info.cid = getShortCid(meta_info.cid)
        return meta_info
      })
      return gotogos
    }).catch(result => {
      console.log(`${url}接口错误：`, result);
    })
  }

  ,animate(ani={rotate:-30, translateX:-400}){
    // const cids = this.data.cids
    // 如果到最后，提示用户并返回
    // if(pointer === cids.length - 1){
    //   wx.showToast({title: '已经到最后啦亲~', duration: 1000})
    //   return;
    // }
    const {rotate, translateX} = ani
    this.setData({
      // currentCid,
      // 取消 scale 和 opaticy 增加动画流畅性
      animationData: wx.createAnimation({
                        timingFunction:'ease',
                        duration: duration
                    })
                      // .scale(1.5, 1.5)
                      .rotate(rotate)
                      // .translate3d(translateX,0,0)
                      .translate(translateX, 50)
                      // .opacity(0)
                      .step().export()
    })
    const {queue, gotogos} = this.data
    const ret = queue.shift()
    const gotogo = gotogos[++pointer]
    if(!gotogo){
      //  发送请求

    }else{
      queue.push(gotogo)
      setTimeout(() => {
        this.setData({ queue })
      }, duration)
      return ret
    }
  }

  /**
   * 喜欢和不喜欢需要做一下函数节流。
   * 防止用户点击过快
   */
  ,dislike(){
    // console.log(this.data.cids);
    // this.animate()
    throttle({
      method: this.animate,
      context: this,
      interval: duration
    })
    // let dontLikes = wx.getStorageSync('dontLikes')
    // if(!dontLikes){
    //   dontLikes = [ cid ]
    // }else{
    //   uniquePush(dontLikes, cid)
    // }
    // wx.setStorageSync( 'dontLikes', dontLikes )
  }

  ,like(){
    // console.log(this.data.cids);
    const {cid, title, cover_image_url, price} = this.animate({rotate:30,translateX:400})
    // 精简要存入本地的对象。只存需要的字段。
    const gotogo = {cid, title, cover_image_url, price}
    let likes = wx.getStorageSync('likes')
    if( !likes ) {
      likes = [ gotogo ]
    } else {
      uniquePush(likes, gotogo, 'cid')
    }
    wx.setStorageSync( 'likes', likes )
  }
}

// assign会进行递归拷贝
Object.assign(page, common)
Page(page)
