export function copy(obj){
  if(typeof obj === 'object'){
    return JSON.parse(JSON.stringify(obj))
  }
}

export function handleTitle(title = []){
  if(Array.isArray(title)){
    return title.join('')
  }
  return ''
}

const LIKES_KEY = 'likes'

export function uniquePush(arr, ele){
  let ret = false;
  if(arr && Array.isArray(arr) && arr.indexOf(ele) === -1){
       arr.push(ele)
       ret = true
  }
  return ret
}

export function getLikesFromStorage(){
  let likes = wx.getStorageSync(LIKES_KEY)
  // console.log(likes);
  if(!likes || !Array.isArray(likes)){
      likes = []
  }
  return likes
}

export function setLikesToStorage(likes, cid){
  let ls = getLikesFromStorage()
  uniquePush(ls, cid)
  console.log(ls);
  console.log( ls.indexOf(cid) );
  wx.setStorageSync(LIKES_KEY, ls)
}

export function removeLikesFromStorate(){
  return wx.removeStorageSync(LIKES_KEY)
}

export function extractPriceFromPriceString(priceString){
  let ret = 0
  if(priceString){
    const priceReg = /\d+(\.\d+)?/
    const match = priceReg.exec(priceString)
    if(match){
      ret = match[0]
    }
  }
  return Number(ret)
}

export function objectToQueryString(dataObject){
  if(!dataObject || typeof dataObject !== 'object'){
    return ''
  }
  const kvArr = []
  Object.keys(dataObject).forEach(key => kvArr.push(`${key}=${dataObject[key]}`))
  return kvArr.join('&')
}

export function isNullObject(obj){
  if(obj == null){
    return true
  }
  if(typeof obj !== 'object'){
    return false
  }
  return Object.keys(obj).length === 0
}

/*
  判断一个对象是否是plain empty object
*/
export function isPlainEmptyObject(obj){
	if(!isPlainObject(obj)){
		return false;
	}
	return this.isEmptyObject(obj);
}

/*
   判断一个数组和对象是否是empty
   只要传入的obj对象没有emunerable=true的属性，就返回true
*/
export function isEmptyObject(obj){
	var name;
	for(name in obj){
		return false;
	}
	return true;
}

/*
   判断传入参数是否是plain object
*/
export function isPlainObject(obj){
	if(type(obj) !== "object" || obj.nodeType || isWindow(obj)){
		return false;
	}
	if(obj.constructor && Object.prototype.hasOwnProperty.call( obj.constructor.prototype,"isPrototypeOf")){
		return false;
	}
	return true;
}

/*
  判断传入参数是否是ArrayLike对象
*/
export function isArrayLike(obj){
	var length = !!obj && "length" in obj && obj.length,
	    type = type(obj);
	if(type === "function" || isWindow(obj)){
		return false;
	}
	return type === "array" || length === 0 || typeof +length === "number" && length > 0 && (length - 1) in obj;
}

export function isNumeric(obj){
  var str = obj && obj.toString();
  return type(obj)!=="array" && ( str - parseFloat( str ) + 1 ) >= 0;
}

/*
  判断传入的参数的类型
*/
export function type(arg){
    const t = typeof arg
    if(t === 'object'){
        if(arg === null){
            return 'null'
        }else{
            return Object.prototype.toString.call(arg).slice(8,-1).toLowerCase()
        }
    }else{
        return t
    }
}

// export {copy,handleTitle,uniquePush,getLikesFromStorage,setLikesToStorage,removeLikesFromStorate}

// function a(){
//   console.log('I am function a')
// }
// function b(){
//   console.log('I am function b')
// }
// function c(){
//   console.log('I am function c and i am a default export 2')
// }
// export const PI = Math.PI;
// export var num = 1
// export let numberObject = new Number(num)
// export var str = 'liyanfeng'
// export let stringObject = new String(str)
// export let bool = true;
// export const booleanObject = new Boolean(bool);
// export var Null = null
// export let Undefined = void 0
// export let symbol = Symbol('liyanfeng')
// export const object = {name: '李彦峰',age: 26}
// var obj = {0:0,1:1,length:2}
// export var sayName = function(){
//   console.log('我是李彦峰')
// }
// export const arr = [1,2,3,obj]
// export { a, b }
// export default c
