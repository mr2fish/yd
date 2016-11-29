import Promise from 'bluebird'
import {HEADER} from '../common/API'
/**
 * fetch wx.request的promisify封装
 * @param  {[object]} options [req配置]
 * @return {[object]}         [Promise对象]
 */
export function fetch(options) {
  return new Promise((resolve, reject) => {
    if (type(options) === 'string') {
      options = {
        url: options
      }
    }
    const {success, fail, complete, header} = options
    // 如果传入的原始配置没有header，则用默认的替代
    if (!header || !isPlainObject(header)) {
      options.header = HEADER
    }
    try {
      options = extend(options, {
        success(res) {
          const {errMsg, statusCode} = res
          if (errMsg && statusCode) {
            if (errMsg === 'request:ok' && statusCode === 200) {
              resolve(res)
            } else {
              reject(res)
            }
          } else {
            resolve(res)
          }
          if (isFunction(success)) {
            success(res)
          }
        },
        fail(res) {
          reject(res)
          if (isFunction(fail)) {
            fail(res)
          }
        },
        complete(res) {
          if (isFunction(complete)) {
            complete(res)
          }
          // 统一关闭加载提示
          wx.hideToast()
        }
      })
      console.log(options);
      wx.request(options)
    } catch (e) {
      reject(e)
    }
  })
}
export function throttle(method, context, interval) {
  // 参数的长度
  const argLen = arguments.length;
  // 第一次是否延迟（true:延迟ms毫秒再执行，false:马上执行），默认值false
  let firstDelay = false,
    // 参数数组中的第一个元素
    arg,
    // 本函数（throttle）执行的次数
    count,
    startTime,
    endTime;

  //开始组装参数
  if (argLen === 0 || argLen > 3) {
    return;
  } else if (argLen === 1) {
    arg = arguments[0];
    method = arg.method;
    context = arg.context || this;
    interval = arg.interval;
    if (typeof firstDelay === "boolean") {
      firstDelay = arg.firstDelay;
    }
  } else if (argLen === 2) {
    interval = context;
    context = this;
  }
  // 参数组装完毕

  if (firstDelay) {
    // 如果第一次需要延迟的话，就不记录次数了，每次都延迟即可
    clearTimeout(context.__throttle_timer__);
    context.__throttle_timer__ = setTimeout(function() {
      method.call(context);
    }, interval);
  } else {
    // 如果第一次不需要延迟的话
    // 取出回调执行的次数
    count = context.__throttle_count__;
    // 如果count为undefined或0，说明回调一次也没有执行过
    if (!count) {
      // 初始化 __throttle_count__ 初始值为0
      count = context.__throttle_count__ = 0;
      // 记录第一次执行回调的开始时间
      context.startTime = +new Date();
      // 马上执行回调
      method.call(context);
    }
    // 如果count的次数大于或等于1的话，说明至少是第二次执行了
    if (count >= 1) {
      // 取出上一次执行的时间点
      startTime = context.startTime;
      // 记录本次执行的时间点
      endTime = +new Date();
      // 把本次执行的时间点记录到startEnd，为下一次执行时所用
      context.startTime = endTime;
      // 间隔时间大于指定的时间，才执行回调
      if (endTime - startTime > interval) {
        method.call(context);
      }
    }
    // 执行次数加1
    context.__throttle_count__++;

  }

}
// 根据传入的价格字符串提取价格 '约￥180.23元' -> 180.23
export function extractPriceFromPriceString(priceString) {
  let ret = 0
  if (priceString) {
    const priceReg = /\d+(\.\d+)?/
    const match = priceReg.exec(priceString)
    if (match) {
      ret = match[0]
    }
  }
  return Number(ret)
}
// {name:'李彦峰',age:26} -> name=李彦峰&age=26
export function objectToQueryString(dataObject) {
  if (!dataObject || typeof dataObject !== 'object') {
    return ''
  }
  const kvArr = []
  Object.keys(dataObject).forEach(key => kvArr.push(`${key}=${dataObject[key]}`))
  return kvArr.join('&')
}
// 对象拷贝（复制）工具方法。类似于jQuery的extend方法
export function extend(...args) {
  let options,
    name,
    src,
    copy,
    copyIsArray,
    clone,
    target = args[0] || {},
    i = 1,
    length = args.length,
    deep = false;
  // console.log( args );
  // 第一个参数作为是否是深拷贝的flag
  if (typeof target === 'boolean') {
    deep = target;
    target = args[i] || {};
    // 跳过第一个参数
    i++;
  }
  // 只有对象和函数可extend
  // 保证target一定为对象
  if (typeof target !== 'object' && !Utils.isFunction(target)) {
    target = {};
  }
  if (i === length) {
    // 如果除了deep之外只有一个参数，那么就把target指向this （this是Utils对象）
    // target = {};
    i--;
  }
  // 处理deep和target之后的参数
  for (; i < length; i++) {
    if ((options = args[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        // 在copy中有引用target，导致死循环
        if (target === copy)
          continue
          // 对象和数组分开处理。加快拷贝速度
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src)
              ? src
              : [];
          } else {
            clone = src && isPlainObject(src)
              ? src
              : {};
          }
          // 递归
          target[name] = extend(deep, clone, copy);
        } else if (copy !== void 0) { // 不是深拷
          target[name] = copy;
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
export function type(arg) {
  const t = typeof arg
  return t === 'object'
    ? arg === null
      ? 'null'
      : Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()
    : t
}

export function isNullObject(obj) {
  return obj == null
    ? true
    : isPlainEmptyObject(obj)
      ? true
      : false
}

/*
  判断一个对象是否是plain empty object
*/
export function isPlainEmptyObject(obj) {
  if (!isPlainObject(obj)) {
    return false;
  }
  return isEmptyObject(obj);
}

/*
   判断一个数组和对象是否是empty
   只要传入的obj对象没有emunerable=true的属性，就返回true
*/
export function isEmptyObject(obj) {
  var name;
  for (name in obj) {
    return false;
  }
  return true;
}

/*
  判断传入参数是否是ArrayLike对象
*/
export function isArrayLike(obj) {
  var length = !!obj && "length" in obj && obj.length,
    type = type(obj);
  if (type === "function" || isWindow(obj)) {
    return false;
  }
  return type === "array" || length === 0 || typeof + length === "number" && length > 0 && (length - 1) in obj;
}

// 是否是数字或数字类型字符串。
// 123   -> true
// '123' -> true
export function isNumeric(obj) {
  var str = obj && obj.toString();
  return type(obj) !== "array" && (str - parseFloat(str) + 1) >= 0;
}

// 判断一个对象是否是函数
export function isFunction(fn) {
  return type(fn) === 'function';
};

// 判断是否为普通对象
// 即简单的字典
// { id:xx, name:xx } -> true
export function isPlainObject(obj) {
  let key;
  // 过滤非对象和global对象
  // 小程序中可以认为wx就是global
  if (type(obj) !== 'object') {
    return false;
  }
  const hasOwn = Object.prototype.hasOwnProperty;
  // 这个对象不能是自定义构造器new 出来的
  // 且对象构造器的prototype属性必须有自己的 isPrototypeOf 属性（其实判断7个内置属性都行，不一定非要判断这个）...
  if (obj.constructor && !hasOwn.call(obj, 'constructor') && !hasOwn.call(obj.constructor.prototype || {}, 'isPrototypeOf')) {
    return false;
  }
  // key in 会先遍历自有属性，如果最后一个属性都是自有属性的话，说明整个
  // 对象上所有属性都是自有属性，说明这个对象就是一个简单的字典
  for (key in obj) {}
  return key === void 0 || hasOwn.call(obj, key);
}

// 短id转长id
export function getLongCid(cid) {
  if (cid == void 0)
    return void 0;
  const C = Math.pow(2, 32);
  // 如果cid大于常数，我们认为就是长ID，直接返回即可，否则再进行处理
  return cid > C
    ? cid
    : (C + 1) * cid;
}

// 长id短id
export function getShortCid(cid) {
  if (cid == void 0)
    return void 0;
  const C = Math.pow(2, 32);
  // 如果cid大于常数，我们认为就是长ID，直接返回即可，否则再进行处理
  return cid > C
    ? cid & 0xffffff
    : cid;
}

// ArrayLike转Arr
export function toArray(arr) {
  const ret = []
  if (!arr)
    return ret
  if (!isArrayLike(arr))
    return ret
  return Array.from(arr)
}

// 简单的深拷贝方法
export function copy(obj) {
  if (type(obj) === 'object') {
    return JSON.parse(JSON.stringify(obj))
  } else if (Array.isArray(obj)) {
    return [...obj]
  }
}

/**
 *  handleTitle 处理title ['这是标题1', '这是标题2'] -> '这是标题1这是标题2'
 * @param  {Array}  [title=[]] [title数组]
 * @return {[String]}          [处理之后的title字符串]
 */
export function handleTitle(title = []) {
  if (Array.isArray(title)) {
    return title.join('')
  }
  return ''
}

/**
 * [uniquePush 数组唯一推入方法，若将要推入数据的元素已经存在于数组中，则忽略之，否则推入之]
 * @param  {[Array]}   arr
 * @param  {[All]}     ele
 * @param  {[String]}  attr [如果有值，则用它作为判断是否唯一的标志]
 * @return {[Boolean]}      [元素是否被推入数组]
 */
export function uniquePush(arr, ele, attr) {
  let ret = false
  if (arr && Array.isArray(arr) && ele !== void 0) {
    if (type(attr) === 'string' && type(ele) === 'object') {
      const hasEle = arr.some(item => item[attr] === ele[attr])
      if (!hasEle) {
        arr.push(ele)
        ret = true
      }
    } else {
      if (arr.indexOf(ele) === -1) {
        arr.push(ele)
        ret = true
      }
    }
  }
  return ret
}

// 逛一逛页面工具方法与常数 -- start
export const LIKES_KEY = 'likes'
export function getLikesFromStorage() {
  let likes = wx.getStorageSync(LIKES_KEY)
  // console.log(likes);
  if (!likes || !Array.isArray(likes)) {
    likes = []
  }
  return likes
}

export function setLikesToStorage(likes, cid) {
  let ls = getLikesFromStorage()
  uniquePush(ls, cid)
  console.log(ls);
  console.log(ls.indexOf(cid));
  wx.setStorageSync(LIKES_KEY, ls)
}

export function removeLikesFromStorate() {
  return wx.removeStorageSync(LIKES_KEY)
}
// 逛一逛页面工具方法与常数 -- start

// 逛一逛页面工具方法与常数 -- start
const GOTOGOS_KEY = 'gotogos'
export function getGotogosFromStorage() {
  return wx.getStorageSync(GOTOGOS_KEY)
}

export function setGotogosToStorage(gotogos, cid) {
  let ls = getLikesFromStorage()
  uniquePush(ls, cid)
  console.log(ls);
  console.log(ls.indexOf(cid));
  wx.setStorageSync(GOTOGOS_KEY, ls)
}

export function removeGotogosFromStorate() {
  return wx.removeStorageSync(GOTOGOS_KEY)
}
// 逛一逛页面工具方法与常数 -- start
