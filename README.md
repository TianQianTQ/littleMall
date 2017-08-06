# littleMall
***
### 项目描述
* 一个简易的购物系统网站，包括商品列表展示、购物车列表展示、用户登录模块、地址选配与订单实现等基本功能。
* 采用前后端分离的方式开发，使用Vue2.0实现前端页面与组件的开发，后台通过Node+express实现，MongnDB做数据库存储数据。使用webpack进行项目打包，项目中使用ES6的一些比较耗用的语法。
* Vue2.0主要涉及Vue-Router（针对页面跳转）、axios(异步接口请求)、Vuex(集中管理状态，主要用于管理头部组件购物车上显示的数量)。
* express实现后端框架，以JSON形式输入与前台进行交互，mongodb也是以json格式存储，方便nodejs取值传给前端。
### 项目启动
由于数据库使用的是mongdb是3.4.5版本，且 mongodb 3.0以上支持用户自定义存储引擎,用户可配置使用mmapv1或者wiredTiger存储引擎，3.2版本以后默认的开启的是wiredTiger存储引擎,之前用的是mmapv1存储引擎。并且2个存储引擎生成的数据文件格式不兼容。也就是说mmapv1引擎生成的数据文件wiredTiger引擎读取不出来。所以,安装3.2之后版本的mongodb,用mongoVue是无法正常显示collectiosns。
1. 下载项目文件，后在文件目录下安装依赖：npm install
2. 数据库连接：
  打开cmd->进入命令行输入services.msc调出服务找到mongodb然后双击关闭，再在命令行中进入Mongodb的安装目录，即     d:mongodb\bin目录下输入：ongod  --storageEngine mmapv1 --dbpath d:\mongodb\data1（自定义存储位置）
  检测方法：重新打开控制台输入mongo回车后输入show dbs，若容量不是0.00GB则修改成功。
3. 项目启动
    在git中找到项目文件，输入node server/bin/www  打开后台
    重新打开git找到项目，输入npm run dev打开前端，然后就可以进行正常浏览购买等模式了。（会出现测试版的网站（第一次跑需要打开服务器比较慢） ）
    npm run build   生成部署的文件（dist目录）   代码分类压缩

