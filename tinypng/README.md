# TinyPng

一个使用TinyPng提供的API，用于Windows或Mac端快速压缩图片的Python脚本，可以做到将该目录下所有的图片进行压缩，包括子目录中的图片。

# 背景

1、 TinyPng有Mac应用，下载地址：[TinyPNG4Mac](https://github.com/kyleduo/TinyPNG4Mac/releases)；

2、 TinyPng没有Windows应用，网上流传的大多都是通过Python脚本实现，但是使用起来总有各种各样的问题，总结发现主要有以下两点原因：

1. Python版本导致，本文使用的Python版本是3.5.0，但并不表示其他Python版本不可使用，由于个人原因没有测试过；
2. 业务需求导致，再加上对Python代码不熟悉，修改Python脚本的难度较大，本文对于自己写的Python脚本进行了非常详细的注释，如果你想了解更多Python相关的知识，请自行谷歌、百度。

# 注意事项

1. 本文编写的tinypng_mac.py脚本由于个人条件没有实际测试过，如有问题请自行解决；
2. 如果是由于业务需求导致无法实现你想要的功能，您可以提issue，互相交流；
3. 如果你是免费用户，那么每个developer key最多只能压`500`次，可通过多注册几个邮箱的方式解决次数的限制。

# 使用教程

1. 安装Python，Mac系统自带，Windows电脑可通过[官网](https://www.python.org/downloads/)下载；
2. 在终端或CMD窗口中输入`python -V`命令，校验Python是否正确安装；
3. 在终端或CMD窗口中输入`pip install -i https://pypi.doubanio.com/simple/ tinify`命令，使用国内镜像下载安装tinify；
4. 先进入[TinyPng官网](https://tinypng.com/)登录用户，接着进入[TinyPng Developers](https://tinypng.com/dashboard/developers)网址后选择`Developer API`选项卡，然后复制Developer API Key；
5. 在终端或CMD窗口中输入`python tinypng_mac.py`或`python tinypng_win.py`命令，进行图片批量压缩；
6. 脚本下载地址：<https://github.com/fengqingxiuyi/LearningNotes/tree/master/tinypng>。
