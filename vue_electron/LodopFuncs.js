//= ===页面动态加载C-Lodop云打印必须的文件CLodopfuncs.js====

let head = document.head || document.getElementsByTagName('head')[0] || document.documentElement

// 让其它电脑的浏览器通过本机打印（仅适用C-Lodop自带的例子）：
let oscript = document.createElement('script')
// oscript.src ="/CLodopfuncs.js";
// head.insertBefore( oscript,head.firstChild );

// 让本机的浏览器打印(更优先一点)：
oscript = document.createElement('script')
oscript.src = 'http://localhost:8000/CLodopfuncs.js?priority=2'
head.insertBefore(oscript, head.firstChild)

// 加载双端口(8000和18000）避免其中某个端口被占用：
oscript = document.createElement('script')
oscript.src = 'http://localhost:18000/CLodopfuncs.js?priority=1'
head.insertBefore(oscript, head.firstChild)

//= ===获取LODOP对象的主过程：====
export function getLodop (oOBJECT, oEMBED) {
  var LODOP
  try {
    try {
      LODOP = getCLodop()
    } catch (err) {
      return false
    }
    if (!LODOP && document.readyState !== 'complete') {
      return false
    }
    // 清理原例子内的object或embed元素，避免乱提示：
    if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED)
    if (oOBJECT && oOBJECT.parentNode) oOBJECT.parentNode.removeChild(oOBJECT)
    //* ****如下空白位置适合调用统一功能:*********
    // LODOP.SET_LICENSES("公司名称","注册号XXXXXXXXXXXXXXXXX","","");
    return LODOP
  } catch (err) {
    return false
  }
}

export function needCLodop () {
  return true // 本例子强制所有浏览器都调用C-Lodop
}
