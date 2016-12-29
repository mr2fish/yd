Page({
  onLoad(options){
    console.log('error onload...');
    const errorMsg = options.errorMsg || '发生了错误，请稍后重试~'
    this.setData({
      errorMsg: errorMsg
    })
  }
  ,toIndex(){
    setTimeout(() => {
      wx.redirectTo({url:'../index/index'})
    }, 120)
  }
})
