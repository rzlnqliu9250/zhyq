//注册子应用
import { registerMicroApps, start } from 'qiankun';

//适配子应用在开发和上线两套环境下的加载地址
const isDev = process.env.NODE_ENV === 'development'

registerMicroApps([
  {
    name: 'big-screen', // 子应用名字
    entry: `${isDev ? '//localhost:5173' : '//localhost:8089'}`,//子项目地址
    container: '#bigContainer',//子应用渲染的位置
    activeRule: '/big-screen',//激活路由 url访问哪个路由地址去加载子应用,activeRule路径要和大屏子应用的路由路径一致
  }
]);

start();
