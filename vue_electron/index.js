/**
 * 格式化日期时间
 * @time new Date对象或时间戳或日期格式字符串
 * @cFormat 指定格式
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['日', '一', '二', '三', '四', '五', '六'][value]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

/**
 * 获取本地时间的当前日期(零点)，适用于按日或月度、年度的统计查询
 * @param date Date实例，默认为当前时间
 * @param type 类型 获取日期或月份、年度
 * @return {Date}
 */
export function getDate (type = 'date', date = new Date()) {
  if (!date || !(date instanceof Date)) {
    throw TypeError('date is not a instance of Date')
  }
  let fmt
  switch (type) {
  case 'date':
    fmt = `${date.toJSON().split('T')[0]}`
    break
  case 'month':
    fmt = `${date.getFullYear()}-${date.getMonth() + 1}-01`
    break
  default:
    fmt = `${date.getFullYear()}-01-01`
  }
  return new Date(`${fmt} 00:00:00 +08`)
}

/**
 * 格式化时间, 距离当前时间多久前
 * @time 单位s
 * @option 指定格式
 * */
export function formatTime (time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/*
* 日期范围选择器
* */
export const pickerOptions = [
  {
    text: '今天',
    onClick (picker) {
      const today = +new Date(new Date().toDateString())
      const end = addDate(today)
      picker.$emit('pick', [today, end])
    }
  }, {
    text: '最近一周',
    onClick (picker) {
      const today = +new Date(new Date().toDateString())
      const start = today - 3600 * 1000 * 24 * 7, end = addDate(today)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick (picker) {
      const today = +new Date(new Date().toDateString())
      const start = today - 3600 * 1000 * 24 * 30, end = addDate(today)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick (picker) {
      const today = +new Date(new Date().toDateString())
      const start = today - 3600 * 1000 * 24 * 90, end = addDate(today)
      picker.$emit('pick', [start, end])
    }
  }]

/*
* 增加一天，然后减1s
* */
function addDate (now, day) {
  now = new Date(now)
  return +now.setDate(now.getDate() + (day || 1)) - 1000
}

/**
 * 获取url参数
 * @url url地址，默认可不传
 * */
export function getQueryObject (url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * 获取字节长度
 * @param {string} val 输入值
 * @returns {number} 返回值
 */
export function getByteLen (val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/ig) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

/**
 * 删除数组中无用的值，如undefined、null、''等
 * @arr 要处理的数组
 * */
export function cleanArray (arr) {
  return arr.filter(v => v)
}

/*
* 数组去重
* */
export function uniqueArr (arr) {
  return Array.from(new Set(arr))
}

/**
 * 序列化json对象
 * */
export function param (json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}

/**
 * 转化json字符串为对象
 * */
export function param2Obj (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

/*
* 获取html字符串中的文本
* */
export function html2Text (val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/*
* 对象合并
* */
export function objectMerge (target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * 对象深度拷贝，避免引用关系
 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/*
* 节流函数
* */
export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * 判断宿主环境是否是客户端
 * @returns {string}
 */
export function isElectron () {
  return navigator.userAgent.indexOf('Electron') > -1
}
