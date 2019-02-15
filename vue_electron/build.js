/**
 * 打包并上传
 */
const request = require('request')
const cp = require('child_process')
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')

const zip = new AdmZip()
zip.addLocalFolder(path.join(__dirname, './build/win-ia32-unpacked/resources/app.asar.unpacked/'))
zip.writeZip(path.join(__dirname, './build/app.asar.unpacked.zip'))

// 获取当前分支
const currentBranch = cp.execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s+/, '').replace(/[\\\/]/g, '_').replace(/[\\\/]/g, '_')

const files = fs.readdirSync(path.join(__dirname, './build')).filter(item => !item.startsWith('.'))
const ymlPath = files.filter(item => !!(getExt(item) === 'yml'))[0]
const zipPath = files.filter(item => !!(getExt(item) === 'zip'))[0]
const filePath = files.filter(item => !!(getExt(item) === 'exe' || getExt(item) === 'dmg'))[0]
let filename
if (currentBranch === 'release') {
  filename = filePath
} else {
  filename = `MPOS_${currentBranch}.${getExt(filePath)}`
}
const host = '192.168.10.31:2048'
const start = Date.now()

// 发起upload请求
const req = request.post(`http://${host}/api/upload?filename=${filename}&ymlName=${ymlPath}&zipName=${zipPath}`, (err, res, body) => {
  if (err) {
    console.log(err)
  } else {
    console.log('body', body)
    const res = JSON.parse(body)
    const now = Date.now()
    const ms = ((now - start) / 1000).toPrecision(3)
    console.log(res.error === 0 && `上传成功(${ms}) http://${host}/files/${filename}`)
  }
})

// 附加文件流到上传表单
const form = req.form()
if (currentBranch === 'release') {
  form.append('yml', fs.createReadStream(path.join(__dirname, './build', ymlPath)))
  form.append('zip', fs.createReadStream(path.join(__dirname, './build', zipPath)))
}
form.append('file', fs.createReadStream(path.join(__dirname, './build', filePath)))

// 获取文件类型
function getExt (name) {
  const filename = name && name.split('.')
  return filename && filename[filename.length - 1]
}
