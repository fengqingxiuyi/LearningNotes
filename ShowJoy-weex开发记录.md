# 文档

weex官方开发文档：http://weex-project.io/cn/references/

vue官方文档：https://cn.vuejs.org/v2/guide/

weex开发新手指南（达人店内部）：https://tower.im/projects/f26c09233cb5442dbae06340798ef386/docs/7d247e5c695f4fcbbfb0639ec6462d94/

# 常用命令

注意：以下命令均在shop-weex-m根目录下使用

新增weex页面：spon weex add

开启PC端调试模式：spon weex dev -n weex页面名

开启手机端调试模式：spon weex debug -n weex页面名

打包资源：spon weex build -n weex页面名

# 注意事项

1、能使用组件则使用组件，切勿重复创建

2、通过weex.requireModule方式引用的模块，其内部具体实现由三端各自实现

3、<cell>组件只能作为<list>组件的子组件

4、日常开发中除了顶部导航栏和某些特殊需求需要设置绝对高度外，其他一般都用相对高度。

5、例如“状态栏-顶部导航栏-scorller-button”这样的布局，在计算scroller的高度时，为兼容三端，需要设置高度值，可通过weex-mixins组件下的getListHeight方法获取，因为该方法内部已经减掉了顶部导航栏和状态栏的高度，所以计算的时候只需要考虑button所占空间即可，例如在宽度为750px的屏幕下button的高度为65，则scroller的高度为this.getListHeight(130, false);

6、<scroller>组件最好只有一个孩子，否则会出现问题，例如：一个水平<scroller>组件中嵌套两个<div>组件，并且想让这两个组件垂直居中，无论怎么设置，在web也是不行的，因为代码在转换为HTML之后，原有的两个<div>组件会新增一个父组件<div>，最后布局成为了<scroller>组件嵌套新的<div>组件嵌套原有的那两个<div>组件，所以无论怎么设置也不行

7、在css里面设置的width、height、margin等值，虽然单位是px，但是实际上是会根据屏幕尺寸等的变化而变化

8、日常开发过程中，字体、间距等数值大小均已宽度为750的设计稿设计，如果设计稿375的宽度，则所有需要设置的数值都乘以2

9、<image>组件必须设置宽高才能展示

10、文字极限状态设置，例如：文字最多显示两行，且超出用省略号表示，则可通过以下css代码实现：lines: 2;text-overflow: ellipsis;

11、weex开发过程中，布局方式只有一种：flex，所以如果要设置某个组件的位置，需要为该组件设置一个父组件，然后在父组件中通过设置justify-content和align-items控制子组件的位置，注意：flex-direction默认为column，即竖直方向

12、debug模式开启流程：打开“ http://10.1.2.126:8088/ ”页面后通过app扫“this qrcode could be used with playground to start Debugger.”文案之上的二维码，接着将LogLevel改为“debug”，并开启RemoteDebug，然后点击“Debugger”按钮，打开“http://10.1.2.126:8088/debugger.html?sessionId=j50ulzw215iml5lvh9l# ”页面，之后再回到“ http://10.1.2.126:8088/ ”页面，扫“ address-select-weex.weex.min ”文案之上的二维码

13、为指定的item设置属性：首先需要为含有v-for的标签设置ref属性，然后再通过this.$refs.item[index]的方式获取节点，即可为指定的item设置特有属性，例如：

定义：

```xml
<div v-for="(addr, addrIndex) in addrList" :key="addrIndex" ref="item">
  <text>{{addrIndex}}</text>
</div>
```

调用：

```javascript
const dom = weex.requireModule('dom');
const el = this.$refs.item[index];
dom.scrollToElement(el, {});
```

14、weex开发过程中，设置背景颜色时不能使用background设置，应该使用background-color设置

15、删除某一条目数据后刷新页面：使用以下方法即可：list.splice(index, 1);，参考自：https://cn.vuejs.org/v2/guide/list.html#组件-和-v-for

16、list-item类型的开发，如果需要改变点击的item的样式，不可以使用v-bind进行绑定，因为会导致所有item的样式都发生改变。如果是图片的切换的话，可以在html代码中写两个同样的<image>控件，然后通过v-if进行判断显示。如果是<text>控件，在web上也可以通过这样的方式实现，在native上仍存在一些问题

17、高度的计算，很重要，通过getListHeight方法获取，目前只有header的高度是绝对值，其他都是相对高度，当然这个视具体的开发情况而改变。。如果布局是header-tab-body，那么计算body的高度时，需要这样获得：self.getListHeight(self.getAbsHeight(88) + 80, false);注意，88是header的相对高度，80是tab的相对高度，因为我们获得的body的高度最终也是相对值，所以第二个参数值为false

18、weex两个控件上下叠加的解决办法：
        
        ①通过margin设置负值去调整位置实现，因为weex里面所有css设置的值都是相对值，所以不会存在偏差问题，但是不推荐使用
        
        ②通过设置postion的值为fixed，然后设置控件的宽高，之后再通过设置top、left、right、bottom的值实现定位

19、调试H5页面：关闭代理软件，重开网络，打开Charles之后，勾选Proxy-macOS Proxy，然后就可以了








