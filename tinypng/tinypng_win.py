#-*- coding:utf-8 -*-

# 说明
## 1. Developer API Key地址：进入https://tinypng.com/dashboard/developers网址后选择Developer API选项卡
## 2. API地址：https://tinypng.com/developers/reference/python
## 3. 免费用户每个月最多只能压500次，可通过多注册几个邮箱的方式解决次数的限制
## 4. 仅Windows电脑才能正确使用该脚本

import tinify
import os
import os.path

# tinify.key ="Your Developer API Key" # AppKey
fromPath ="C:\\Users\\Administrator\\Desktop\\temp\\src" # source dir path
toPath ="C:\\Users\\Administrator\\Desktop\\temp\\dest" # dest dir path

# 压缩图片的key
online_key_list = [
    "RdHoRF9i936xXJCP-ES2c9YCHB0MhxOh",
    "q20BBKkn5t6_AZBxYL1sJcLiW0a4Cufq",# 可以继续添加  防止一个key不够
]
online_key_list_iter = iter(online_key_list)
online_key = next(online_key_list_iter)

# 在线压缩
def compress_online(sourcefile, outputfile):
    global online_key
    compresskey = online_key

    tinify.key = compresskey
    rs = False
    try:
        source = tinify.from_file(sourcefile)
        source.to_file(outputfile)
        print '压缩图片...' + outputfile
        rs = True
      pass
    except tinify.AccountError, e:
        # Verify your API key and account limit.
      # 如果key值无效 换一个key继续压缩
      print "key值无效 换一个继续。。。"
      online_key = next(online_key_list_iter)
      compress_online(sourcefile, outputfile, name)   #递归方法 继续读取
      rs = True
    except tinify.ClientError, e:
        # Check your source image and request options.
      print "Check your source image and request options. %s" % e.message
      rs = False
      pass
    except tinify.ServerError, e:
        # Temporary issue with the Tinify API.
      print "Temporary issue with the Tinify API. %s" % e.message
      rs = False
      pass
    except tinify.ConnectionError, e:
        # A network connection error occurred.
      print "网络故障。。。休息1秒继续"
      time.sleep(1)
      compress_online(sourcefile, outputfile, name)   #递归方法 继续读取
      rs = True
      pass
    except Exception, e:
        # Something else went wrong, unrelated to the Tinify API.
      print "Something else went wrong, unrelated to the Tinify API.  %s" % e.message
      rs = False
      pass

    return rs

# root, dirs, files参数的含义：目录的路径(String)；root目录下所有子目录的名字(List)；root目录下非目录的名字
# os.walk(top,topdown=True,onerror=None)函数中各参数的含义：需要遍历的顶级目录的路径；默认值是“True”表示首先返回顶级目录下的文件，然后再遍历子目录中的文件；默认值为"None"，表示忽略文件遍历时的错误
for root, dirs, files in os.walk(fromPath):
	newToPath = toPath
	if len(root) > len(fromPath): # 比较root和fromPath的字符长度
		innerPath= root[len(fromPath):] # 字符串切割，将root字符串从第len(fromPath)个位置开始截取，不包括len(fromPath)这个位置的字符
		if innerPath[0] == '\\': # 判断innerPath的第一个字符是不是\符号
			innerPath = innerPath[1:] # 字符串切割，例如innerPath的值为\test，那么innerPath[1:]之后的值为test
		newToPath = os.path.join(toPath,innerPath) # 将toPath目录和innerPath文件或文件夹拼接之后的路径赋值给newToPath
	
	for name in files:
		newFromFilePath = os.path.join(root, name)
		newToFilePath = os.path.join(newToPath, name)
		fileName, fileSuffix = os.path.splitext(name) # 分解文件名的扩展名
		if fileSuffix == '.png' or fileSuffix == '.jpg':
# 			source = tinify.from_file(newFromFilePath)
# 			source.to_file(newToFilePath)
			# 在线压缩
			if not compress_online(newFromFilePath, newToFilePath):
			    print "压缩失败，检查报错信息"
			    sys.exit()
			    pass
		else:
			pass

	for dirName in dirs:
		if os.path.exists(os.path.join(newToPath, dirName)):
			pass
		else:
			os.mkdir(os.path.join(newToPath, dirName))

