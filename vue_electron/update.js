/*
* 应用更新
* */

// 饿了么
import { Message, MessageBox } from 'element-ui'
// 引入解压缩zip框架
const AdmZip = require('adm-zip')
// node
const fs = require('fs')
const request = require('request')
// Electron应用
const { app, BrowserWindow } = require('electron').remote

export default {
  /**
   * 执行应用更新
   * 1 全量更新
   * 2 已经是最新版本
   * 3 增量更新
   *
   * 如果版本号是4位，则执行全量更新
   * 如果版本号是3位，则执行增量更新
   */
  execUpdate () {
    // 获取当前版本号
    const currentVersion = app.getVersion()
    console.log('currentVersion', currentVersion)
    // 下载更新文件
    this.downloadFile('https://apps-download.oss-cn-hangzhou.aliyuncs.com/pos/latest.yml', './resources/latest.yml', () => {
      // 获取最新版本号
      const ymlBuffer = fs.readFileSync('./resources/latest.yml')
      const remoteVersion = JSON.stringify(ymlBuffer.toString()).split('\\n')[0].split(' ')[1]
      console.log('remoteVersion', remoteVersion)
      // 版本比较
      const remoteVersionArr = remoteVersion.split('.')
      if (remoteVersionArr.length === 4) {
        console.log('开始全量更新')
        return 1
      }
      console.log('开始增量更新')
      const currentVersionArr = currentVersion.split('.')
      let updateFlag = false
      if (Number(remoteVersionArr[0]) > Number(currentVersionArr[0])) {
        updateFlag = true
      } else {
        if (Number(remoteVersionArr[1]) > Number(currentVersionArr[1])) {
          updateFlag = true
        } else {
          if (Number(remoteVersionArr[2]) > Number(currentVersionArr[2])) {
            updateFlag = true
          }
        }
      }
      if (!updateFlag) {
        console.log('已经是最新版本')
        Message({
          message: '增量更新结束，已经是最新版本'
        })
        return 2
      }
      MessageBox({
        title: '提示',
        message: 'MPOS检测到新版本，为保证收银系统正常使用，请务必升级至最新版。',
        confirmButtonText: '去升级',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }, (e) => {
        // 下载增量包
        this.downloadFile('http://apps-download.oss-cn-hangzhou.aliyuncs.com/pos/app.asar.unpacked.zip', './resources/app.asar.unpacked.zip', () => {
          console.log('app.asar.unpacked.zip 下载完成')
          // 同步解压缩
          const unzip = new AdmZip('./resources/app.asar.unpacked.zip')
          unzip.extractAllTo('./resources/app.asar.unpacked/', true)
          console.log('app.asar.unpacked.zip 解压缩完成')
          // 更新窗口
          BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.reload()
          })
          console.log('webContents reload完成')
        })
      })
    })
    return 3
  },
  downloadFile (uri, filename, callback) {
    try {
      const stream = fs.createWriteStream(filename)
      request(uri).pipe(stream).on('close', callback)
    } catch (e) {
      console.log(e)
    }
  }
}
