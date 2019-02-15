/*
* 日志系统
* */

// 引入请求框架
import request from './request.js'
// 引入打印框架
import { getLodop } from './LodopFuncs'
// node
const cp = require('child_process')
const util = require('util')
const exec = util.promisify(cp.exec)
// 操作系统
const os = require('os')
// Electron应用
const { app } = require('electron').remote

export default {
  /**
   * 搜集上传日志信息
   */
  async reportLog (action, userInfo, printInfo, reqInfo) {
    // 仅测试包会上传日志信息
    if (process.env.CUST_ENV !== 'test') {
      return
    }
    // 组装要上传的应用信息
    const appInfo = this.getAppInfo()
    // 组装要上传的用户信息
    if (!userInfo) userInfo = {}
    userInfo = await this.getUserInfo(userInfo)
    // 组装要上传的设备信息
    const deviceInfo = await this.getDeviceInfo()
    // 组装要上传的打印信息
    if (!printInfo) printInfo = {}
    printInfo = this.getPrintInfo(printInfo)
    // 组装要上传的请求信息
    if (!reqInfo) reqInfo = {}
    reqInfo = this.getReqInfo(reqInfo)
    // 开始上传日志信息
    request({
      url: 'report2Ding',
      tag: 'report', // 表明该次请求来自report，如果该请求出现错误，则不上报，否则会出现死循环
      data: {
        msgtype: 'markdown',
        markdown: {
          title: '日志信息',
          text:
          '#### 日志类型：' + action + '\n' +
          '#### 应用信息\n' +
          '> ' + JSON.stringify(appInfo) + '\n\n' +
          '#### 用户信息\n' +
          '> ' + JSON.stringify(userInfo) + '\n\n' +
          '#### 设备信息\n' +
          '> ' + JSON.stringify(deviceInfo) + '\n\n' +
          '#### 打印信息\n' +
          '> ' + JSON.stringify(printInfo) + '\n\n' +
          '#### 请求信息\n' +
          '> ' + JSON.stringify(reqInfo) + '\n\n'
        }
      }
    }).then(res => {
      console.log('report2Ding res: ', res)
    }, err => {
      console.log('report2Ding err: ', err)
    })
  },
  /**
   * 组装应用信息
   */
  getAppInfo () {
    const appInfo = {
      href: location.href, // 当前页面地址信息
      version: app.getVersion() // App版本号
    }
    return appInfo
  },
  /**
   * 组装用户信息
   */
  async getUserInfo (userInfo) {
    const accountInfoStr = localStorage.getItem('accountInfo')
    let accountInfo = {}
    if (accountInfoStr && accountInfoStr !== 'undefined') {
      accountInfo = JSON.parse(accountInfoStr)
    } else if (userInfo.userId) {
      const res = await request({
        url: 'getStaffInfo',
        tag: 'report',
        data: {
          staffId: userInfo.userId
        }
      })
      if (res && res.data) {
        accountInfo = res.data
        localStorage.setItem('accountInfo', JSON.stringify(accountInfo))
      }
    }
    userInfo = Object.assign(accountInfo, userInfo)
    return userInfo
  },
  /**
   * 组装设备信息
   */
  async getDeviceInfo () {
    let deviceInfo = {
      type: os.type(), // 操作系统类型
      release: os.release(), // 操作系统版本号
      platform: os.platform(), // 操作系统平台
      arch: os.arch(), // CPU架构
      totalmem: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + 'GB', // 系统总内存的字节数
      freemem: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + 'GB', // 系统空闲内存的字节数
      homedir: os.homedir(), // 当前用户的home目录
      disk: null // 磁盘空间信息
    }
    if (deviceInfo.platform === 'win32') { // windows设备
      const { stdout, stderr } = await exec('wmic logicaldisk get size,freespace,caption')
      deviceInfo.disk = stdout
    }
    return deviceInfo
  },
  /**
   * 组装打印信息
   */
  getPrintInfo (printInfo) {
    const LODOP = getLodop()
    let status = '打印服务未启动'
    if (LODOP) {
      status = '打印服务已启动'
    }
    const printSetStr = localStorage.getItem('PRINTSET')
    let printSet = {}
    if (printSetStr && printSetStr !== 'undefined') {
      printSet = JSON.parse(printSetStr)
    }
    printInfo = Object.assign({
      status: status,
      printSet: printSet
    }, printInfo)
    return printInfo
  },
  /**
   * 组装请求信息
   */
  getReqInfo (reqInfo) {
    return reqInfo
  }
}
