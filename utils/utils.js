
// 对象拷贝（复制）工具方法。类似于jQuery的extend方法
  export function extend( ...args ){
        let options , name, src, copy , copyIsArray , clone,
            target = args[ 0 ] || {},
            i = 1,
            length = args.length,
            deep = false;
        // console.log( args );
        // 第一个参数作为是否是深拷贝的flag
        if( typeof target === 'boolean'){
              deep = target;
              target = args[ i ] || {};
              // 跳过第一个参数
              i++;
        }
       // 只有对象和函数可extend
       // 保证target一定为对象
       if( typeof target !== 'object' && !Utils.isFunction( target ) ){
             target = {};
       }
       if( i === length ){
             // 如果除了deep之外只有一个参数，那么就把target指向this （this是Utils对象）
             // target = {};
             i--;
       }
       // 处理deep和target之后的参数
       for( ; i < length; i++){
           if( ( options = args[ i ] ) != null ){
                 for( name in options ){
                       src = target[ name ];
                       copy = options[ name ];
                       // 在copy中有引用target，导致死循环
                       if( target === copy )continue
                       // 对象和数组分开处理。加快拷贝速度
                       if( deep && copy && ( Utils.isPlainObject( copy  ) || ( copyIsArray = Array.isArray( copy ) ) ) ){
                           if( copyIsArray ){
                                 copyIsArray = false;
                                 clone = src && Array.isArray( src ) ? src : [];
                           }else{
                                 clone = src && Utils.isPlainObject( src ) ? src : {};
                           }
                           // 递归
                           target[ name ] = Utils.extend( deep, clone, copy );
                       } else if( copy !== void 0) { // 不是深拷
                           target[ name ] = copy;
                       }
                 }
           }
       }
       // return出去改变过后的对象
       return target;
 }


/*
  判断传入的参数的类型
*/
export function type(arg){
    const t = typeof arg
    return t === 'object'?
                 arg === null ?
                  'null' :
                  Object.prototype.toString.call(arg).slice(8,-1).toLowerCase():t
}

// 判断一个对象是否是函数
export function isFunction( fn ){
      return type( fn ) === 'function';
};

// 判断是否为普通对象
// 即简单的字典
// { id:xx, name:xx } return true
export function isPlainObject( obj ){
      let key;
      // 过滤非对象和global对象
      // 小程序中可以认为wx就是global
      if( type( obj ) !== 'object'){
            return false;
      }
      const hasOwn = Object.prototype.hasOwnProperty;
      // 这个对象不能是自定义构造器new 出来的
      // 且对象构造器的prototype属性必须有自己的 isPrototypeOf 属性（其实判断7个内置属性都行，不一定非要判断这个）...
      if( obj.constructor &&
             !hasOwn.call( obj , 'constructor' ) &&
             !hasOwn.call( obj.constructor.prototype || {} , 'isPrototypeOf')  ) {
            return false;
      }
      // key in 会先遍历自有属性，如果最后一个属性都是自有属性的话，说明整个
      // 对象上所有属性都是自有属性，说明这个对象就是一个简单的字典
      for( key in obj ) {}
      return key === void 0 || hasOwn.call( obj , key );
};

// 短id转长id
export function getLongCid( cid ){
  if( cid == void 0 ) return void 0;
  const C = Math.pow(2,32);
     // 如果cid大于常数，我们认为就是长ID，直接返回即可，否则再进行处理
  return cid > C ? cid : ( C + 1 ) * cid;
}

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
  return obj == null?
              true :
              isPlainEmptyObject(obj)?
              true: false
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
