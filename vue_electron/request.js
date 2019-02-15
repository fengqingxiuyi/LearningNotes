import axios from 'axios'
import { Message } from 'element-ui'
import Store from '../store/index'
import router from '../router/index'
import { api, proxy } from '../../config/env/index'
import ApiList from '../../config/api'
import report from './report.js'

/*
* 调用request方法
* 调用方式:
* 方式一：
* this.fetch({
*   url: 'getUserInfo',
*   data: {'test': 1}
* }).then(function (res) {
*   console.log(res)
* }, function (err) {
*   console.log(err)
* });
* 方式二：
* const res = await this.fetch({
*   url: 'getUserInfo',
*   data: {'test': 1}
* });
* console.log(res)
* */

/**
 * opt是请求入参，
 * 包含：
 *  loading：请求加载进度条
 *  url：请求地址
 *  method：请求方法类型，默认post
 *  headers：请求头
 *  data：请求数据
 *  timeout：请求超时时间，默认20秒
 * 特殊入参：
 *  tag：以report为例，表明该次请求来自report，如果该请求出现错误，则不上报，否则会出现死循环
 *  pagination：用于解决单个页面包含tab组件，每个组件均包含分页组件，然后快速切换时导致的并发问题
 */
export default async (opt) => {
  // 为opt对象添加loading字段，值为true
  opt = Object.assign({
    loading: true
  }, opt)
  // 定义错误内容数据结构
  let err = {
    reqUrl: null,
    /**
     * 错误码详解
     * < 100：与服务端约定的业务错误码
     *   -1：退出登录
     * 100 ~ 999：HTTP状态码
     * 1000 ~ 9999：自定义的非业务错误码
     * >= 10000：与服务端约定的业务错误码
     */
    err_code: null,
    msg: null
  }
  /** ****************************Start Get Request Params******************************/
  // 校验url在api.js文件中是否配置
  let reqUrl = ApiList[opt.url]
  if (!reqUrl) {
    err.reqUrl = reqUrl
    err.err_code = 1001
    err.msg = opt.url + '未在[config/api.js]文件中配置'
    showErr(opt, err)
    return Promise.reject(err)
  }
  // 拼接请求url，pos_mock_api是切环境时输入的api地址，api.root是工程配置的默认api地址
  const posMockApi = localStorage.getItem('pos_mock_api')
  const baseURL = posMockApi || api.root
  if (!/^http/.test(reqUrl)) {
    reqUrl = baseURL + reqUrl
  }
  // 设置默认请求参数
  const params = {
    url: reqUrl,
    method: opt.method || 'post', // 调整为默认post请求
    headers: opt.headers || {},
    data: opt.data || {}
  }
  // 校验本地token与vuex中的token是否一致
  let userInfo = sessionStorage.getItem('mmh_pos_token')
  if (userInfo) {
    let parse = JSON.parse(userInfo)
    if (Store.getters.token && Store.getters.uid && // vuex已经有用户信息的时候，进行与cookie进行匹配
      parse.token != Store.getters.token && parse.uid != Store.getters.uid) { // 当cookie里面的用户信息与 vuex存储的信息不一致时，执行用户退出错误；
      logout()
      err.reqUrl = reqUrl
      err.err_code = 1002
      err.msg = '本地token与vuex中的token不一致'
      showErr(opt, err)
      return Promise.reject(err)
    }
    Object.assign(params.headers, parse)
  }
  // 是否开启node api代理服务
  if (proxy && !posMockApi) {
    let nodeBody = { api: opt.url }
    if (opt.data) {
      nodeBody.data = JSON.stringify(opt.data)
    }
    params.data = nodeBody
    params.url = api.node
  }
  /** ****************************End Get Request Params******************************/
  // 创建一个axios示例
  const fetch = axios.create({
    timeout: opt.timeout || 20000
  })
  /** ****************************Start deal Response******************************/
  try {
    showLoading(opt)
    const response = await fetch(params)
    hideLoading(opt)
    let res
    if (response.status === 200) { // 接口请求成功
      res = response.data
      if (!res || !res.success) { // 业务请求错误
        err.reqUrl = reqUrl
        err.err_code = res.bizCode
        err.msg = res.msg
        // 针对不同的错误码进行处理，如提示或跳转到登录页等
        switch (res.bizCode) {
        case -1:
          logout()
          showErr(opt, err)
          break
        case 10001:
          // 业务约定10001不应该弹出错误提示
          break
        default:
          showErr(opt, err)
          break
        }
        return Promise.reject(err)
      }
    } else { // 接口请求错误
      err.reqUrl = reqUrl
      err.err_code = response.status
      err.msg = response.statusText || '服务器错误'
      showErr(opt, err)
      return Promise.reject(err)
    }
    // 解决两个包含分页组件的页面来回切换时导致的并发问题，即页面A展示了页面B的数据
    let body = res.body || {}
    if (opt.pagination && Object.prototype.toString.call(body) === '[object Object]') {
      body.paramData = JSON.stringify(opt.data)
    }
    return body
  } catch (e) {
    hideLoading(opt)
    let msg = e.message
    if (msg === 'Network Error') {
      err.err_code = 1003
      msg = '网络错误'
    } else if (msg === 'timeout of 20000ms exceeded') {
      err.err_code = 1004
      msg = '网络繁忙，请稍后再试！'
    } else {
      err.err_code = 1005
    }
    // 深化处理错误信息
    if (e.response) {
      let error = e.response.data
      if (error) {
        msg = msg + ' ' + error.path
      }
    }
    err.reqUrl = reqUrl
    err.msg = msg
    showErr(opt, err)
    return Promise.reject(err)
  }
  /** ****************************End deal Response******************************/
}

/**
 * 跳转到登录页
 */
function logout () {
  Store.dispatch('logout')
  let loginPath = '/login', currPath = router.app._route.path
  if (currPath) {
    loginPath += '?go=' + currPath
  }
  router.push({ path: loginPath })
}

/**
 * 显示错误消息
 */
function showErr (opt, err) {
  if (router.app._route.path === '/login') { // 解除登录按钮禁用状态
    Store.dispatch('dialog/setDialog', { isLogin: false })
  }
  // 上传请求日志，并排除report.js中发起的请求，防止出现循环
  if (opt.tag !== 'report') {
    report.reportLog('reqErr', {}, {}, err)
  }
  if (!err || !err.msg) {
    return
  }
  Message({
    message: err.msg,
    type: 'error',
    duration: 5 * 1000
  })
}

/*
* 显示loading
* */
function showLoading (opt) {
  if (!opt.loading) return
  opt.timer && clearTimeout(opt.timer)
  opt.timer = setTimeout(() => {
    Store.dispatch('app/setLoading', true)
  }, 180)
}

/*
* 隐藏loading
* */
function hideLoading (opt) {
  opt.timer && clearTimeout(opt.timer)
  Store.dispatch('app/setLoading', false)
}
