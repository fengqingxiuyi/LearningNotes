/*
* 打印功能
* */
import { getLodop } from './LodopFuncs'
import { MessageBox } from 'element-ui'
import report from './report.js'

export default {
  /**
   * 获取初始化的Print
   */
  getInitedPrint (type) {
    // 上传打印日志
    report.reportLog('print', {}, {
      type: type
    })
    const LODOP = getLodop()
    // 判断LODOP是否安装或异常
    if (!LODOP) {
      MessageBox({
        title: '提示',
        message: 'LODOP初始化异常，请前往打印机设置页面排查！',
        confirmButtonText: '去设置'
      }, (e) => {
        if (window.location.hash.indexOf('#/branch') !== -1) {
          window.location.href = window.location.href.split('#/branch')[0] + '#/branch/settings/printerConfig'
        } else if (window.location.hash.indexOf('#/master') !== -1) {
          window.location.href = window.location.href.split('#/master')[0] + '#/master/settings/printerConfig'
        } else if (window.location.hash.indexOf('#/wms') !== -1) {
          window.location.href = window.location.href.split('#/wms')[0] + '#/wms/settings/printerConfig'
        }
      })
      return false
    }
    // 尝试指定打印设备
    const dataStr = localStorage.getItem('PRINTSET')
    if (dataStr && dataStr !== 'undefined') {
      const data = JSON.parse(dataStr)// 解析数据
      // 如果SET_PRINTER_INDEX返回false，则忽略，使用默认打印设备
      if (type == 1) {
        LODOP.SET_PRINTER_INDEX(data.aSet)
      } else if (type == 2) {
        LODOP.SET_PRINTER_INDEX(data.labelSet)
      } else if (type == 3) {
        LODOP.SET_PRINTER_INDEX(data.ticketSet)
      }
    }
    return LODOP
  },
  /**
   * 打印A4纸
   */
  printA4 (id) {
    const LODOP = this.getInitedPrint(1)
    if (LODOP) {
      const strFormHtml = '<head>' + document.head.innerHTML + '</head><body>' + document.getElementById(id).innerHTML + '</body>'
      LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', strFormHtml)
      LODOP.PREVIEW()
    }
  },
  /**
   * 打印A4纸 横向
   */
  printTransverseA4 (id) {
    const LODOP = this.getInitedPrint(1)
    if (LODOP) {
      const strFormHtml = '<head>' + document.head.innerHTML + '</head><body>' + document.getElementById(id).innerHTML + '</body>'
      LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', strFormHtml)
      LODOP.SET_PRINT_PAGESIZE(2, 0, 0, 'A4')
      LODOP.PREVIEW()
    }
  },
  /**
   * 预览打印A4纸
   */
  previewA4 (id) {
    const LODOP = this.getInitedPrint(1)
    if (LODOP) {
      const strFormHtml = '<head>' + document.head.innerHTML + '</head><body>' + document.getElementById(id).innerHTML + '</body>'
      LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', strFormHtml)
      LODOP.PREVIEW()
    }
  },
  /**
   * 打印商品标签
   */
  printLabel (id) {
    const LODOP = this.getInitedPrint(2)
    if (LODOP) {
      const strFormHtml = '<head>' + document.head.innerHTML + '</head><body>' + document.getElementById(id).innerHTML + '</body>'
      LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', strFormHtml)
      LODOP.SET_PRINT_PAGESIZE(1, 800, 400, 'A4')
      LODOP.PRINT()
    }
  },
  /**
   * 预览打印商品标签
   */
  previewLabel (id, barcodeList) {
    const LODOP = this.getInitedPrint(2)
    if (LODOP) {
      const strFormHtml = '<head>' + document.head.innerHTML + '</head><body>' + document.getElementById(id).innerHTML + '</body>'
      LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', strFormHtml)
      LODOP.SET_PRINT_PAGESIZE(1, 800, 400, '')
      LODOP.SET_PRINT_STYLE('FontName', '微软雅黑')
      LODOP.SET_PRINT_STYLE('FontSize', 4)
      LODOP.SET_PRINT_STYLE('Alignment', 2)
      barcodeList.forEach((item, index) => {
        LODOP.ADD_PRINT_BARCODE(106 + index * 151, 14, 71, 32, '128Auto', item.barcode) // 条形码
        LODOP.ADD_PRINT_BARCODE(10 + index * 151, 215, 80, 80, 'QRCode', 'https://x.mamahao.com/goods/' + item.styleNumId + '/index.html') // 二维码
        LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion', 5)
      })
      LODOP.PREVIEW()
    }
  },
  /**
   * 打印小票
   */
  printTicket (id) {
    const LODOP = this.getInitedPrint(3)
    if (LODOP) {
      const strFormHtml = '<head>' + document.head.innerHTML + '</head><body>' + document.getElementById(id).innerHTML + '</body>'
      LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', strFormHtml)
      LODOP.SET_PRINT_PAGESIZE(3, 750, 10, '')
      LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Height:85%')
      LODOP.PRINT()
    }
  },
  /**
   * 预览打印小票
   */
  previewTicket (id) {
    const LODOP = this.getInitedPrint(3)
    if (LODOP) {
      const strFormHtml = '<head>' + document.head.innerHTML + '</head><body>' + document.getElementById(id).innerHTML + '</body>'
      LODOP.ADD_PRINT_HTM(0, 0, '100%', '110%', strFormHtml)
      LODOP.SET_PRINT_PAGESIZE(3, 750, 20, '')
      LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Height:85%')
      LODOP.PREVIEW()
    }
  }
}
