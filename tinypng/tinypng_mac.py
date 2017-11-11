#-*- coding:utf-8 -*-

# 说明
## 1. Developer API Key地址：进入https://tinypng.com/dashboard/developers网址后选择Developer API选项卡
## 2. API地址：https://tinypng.com/developers/reference/python
## 3. 免费用户每个月最多只能压500次，可通过多注册几个邮箱的方式解决次数的限制
## 4. 仅Mac电脑才能正确使用该脚本

import tinify
import os
import os.path

tinify.key ="Your Developer API Key" # AppKey
fromPath ="/Users/username/temp/src" # source dir path
toPath ="/Users/username/temp/est" # dest dir path

# root, dirs, files参数的含义：目录的路径(String)；root目录下所有子目录的名字(List)；root目录下非目录的名字
# os.walk(top,topdown=True,onerror=None)函数中各参数的含义：需要遍历的顶级目录的路径；默认值是“True”表示首先返回顶级目录下的文件，然后再遍历子目录中的文件；默认值为"None"，表示忽略文件遍历时的错误
for root, dirs, files in os.walk(fromPath):
	newToPath = toPath
	if len(root) > len(fromPath): # 比较root和fromPath的字符长度
		innerPath= root[len(fromPath):] # 字符串切割，将root字符串从第len(fromPath)个位置开始截取，不包括len(fromPath)这个位置的字符
		if innerPath[0] == '/': # 判断innerPath的第一个字符是不是/符号
			innerPath = innerPath[1:] # 字符串切割，例如innerPath的值为\test，那么innerPath[1:]之后的值为test
		newToPath = os.path.join(toPath,innerPath) # 将toPath目录和innerPath文件或文件夹拼接之后的路径赋值给newToPath
	
	for name in files:
		newFromFilePath = os.path.join(root, name)
		newToFilePath = os.path.join(newToPath, name)
		fileName, fileSuffix = os.path.splitext(name) # 分解文件名的扩展名
		if fileSuffix == '.png' or fileSuffix == '.jpg':
			source = tinify.from_file(newFromFilePath)
			source.to_file(newToFilePath)
		else:
			pass

	for dirName in dirs:
		if os.path.exists(os.path.join(newToPath, dirName)):
			pass
		else:
			os.mkdir(os.path.join(newToPath, dirName))

