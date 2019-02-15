/*
* 工具类方法
* */

/*
* 增加一天，然后减1s
* */
function addDate (now, day) {
  now = new Date(now)
  return +now.setDate(now.getDate() + (day || 1)) - 1000
}

export default {
  /*
  * 计算某一列每一行要合并的单元格行数
  * 示例:
  * this.rowSpan = this.getCellMergeArray(data, 'name');
  * objectSpanMethod({row, column, rowIndex, columnIndex}) {
  *   if (columnIndex === 0) {return [this.rowSpan[rowIndex], 1]};
  * }
  * */
  getCellMergeArray (data, key) {
    let spanArr = [], pos
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        spanArr.push(1)
        pos = 0
      } else {
        // 判断当前元素与上一个元素是否相同
        if (data[i][key] === data[i - 1][key]) {
          spanArr[pos] += 1
          spanArr.push(0)
        } else {
          spanArr.push(1)
          pos = i
        }
      }
    }
    return spanArr
  },
  // 日期范围选择器扩展
  Shortcuts () {
    return [{
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
  },
  // 4舍5入
  toFixed (value = 0, precision = 2) {
    const multiple = Math.pow(10, precision)
    return (Math.round(value * multiple) / multiple)
  },
  /**
   ** 加法函数，用来得到精确的加法结果
   ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
   ** 调用：accAdd(arg1,arg2)
   ** 返回值：arg1加上arg2的精确结果
   **/
  accAdd (arg1, arg2) {
    let r1, r2, m, c
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    c = Math.abs(r1 - r2)
    m = Math.pow(10, Math.max(r1, r2))
    if (c > 0) {
      let cm = Math.pow(10, c)
      if (r1 > r2) {
        arg1 = Number(arg1.toString().replace('.', ''))
        arg2 = Number(arg2.toString().replace('.', '')) * cm
      } else {
        arg1 = Number(arg1.toString().replace('.', '')) * cm
        arg2 = Number(arg2.toString().replace('.', ''))
      }
    } else {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', ''))
    }
    return (arg1 + arg2) / m
  },
  /**
   ** 减法函数，用来得到精确的减法结果
   ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
   ** 调用：accSub(arg1,arg2)
   ** 返回值：arg1加上arg2的精确结果
   **/
  accSub (arg1, arg2) {
    let r1, r2, m, n
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2)) // last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2
    return ((arg1 * m - arg2 * m) / m).toFixed(n)
  },
  /**
   ** 乘法函数，用来得到精确的乘法结果
   ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
   ** 调用：accMul(arg1,arg2)
   ** 返回值：arg1乘以 arg2的精确结果
   **/
  accMul (arg1, arg2) {
    let m = 0, s1 = arg1.toString(), s2 = arg2.toString()
    try {
      m += s1.split('.')[1].length
    } catch (e) {
    }
    try {
      m += s2.split('.')[1].length
    } catch (e) {
    }
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
  },
  /**
   ** 除法函数，用来得到精确的除法结果
   ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
   ** 调用：accDiv(arg1,arg2)
   ** 返回值：arg1除以arg2的精确结果
   **/
  accDiv (arg1, arg2) {
    let t1 = 0, t2 = 0, r1, r2
    try {
      t1 = arg1.toString().split('.')[1].length
    } catch (e) {
    }
    try {
      t2 = arg2.toString().split('.')[1].length
    } catch (e) {
    }
    r1 = Number(arg1.toString().replace('.', ''))
    r2 = Number(arg2.toString().replace('.', ''))
    return (r1 / r2) * Math.pow(10, t2 - t1)
  }
}
