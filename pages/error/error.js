import common from '../../common/app'
const page = {
  onLoad(options){
    console.log('error onload...');
    const errorMsg = options.errorMsg || '发生了错误，请稍后重试~'
    this.setData({
      errorMsg: errorMsg
    })
  }
  ,toIndex(){
    wx.navigateTo({url:'../index/index'})
  }
}

Object.assign(page, common)
Page(page)
