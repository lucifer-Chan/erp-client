// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import 'assets/custom-theme/index.css'; // 换肤版本element-ui css
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条 样式
import 'normalize.css/normalize.css';// normalize.css 样式格式化
import 'assets/iconfont/iconfont'; // iconfont 具体图标见https://github.com/PanJiaChen/vue-element-admin/wiki
import * as filters from './filters'; // 全局vue filter
import IconSvg from 'components/Icon-svg';// svg 组件
import errLog from 'store/errLog';// error log组件
// import './mock/index.js';  // 该项目所有请求使用mockjs模拟

Vue.component('icon-svg', IconSvg)
Vue.use(ElementUI);

// register global utility filters.
//枚举filter里面的方法名，添加到全局中
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

function hasPermission(roles, route) {
    if (route.meta && typeof route.meta === 'string') {
        if (roles.indexOf(route.meta) < 0) {
            return false
        }
    }
    return true
}

// register global progress.
const whiteList = ['/index',/* '/preserve/index'*/,'/login', '/authredirect', '/reset', '/sendpwd', '/404', '/401'];// 不重定向白名单
router.beforeEach((to, from, next) => {
    // console.log('beforeEach', from.path, to.path)
    NProgress.start(); // 开启Progress
    console.log(1111);
    if (!store.getters.loginStatus) { // 判断当前用户是否已拉取完user_info信息
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next();
            return;
        }
        store.dispatch('GetInfo').then(res => { // 拉取user_info
            const roles = res.data.roleList;
            store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
                router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                next({ ...to }); // hack方法 确保addRoutes已完成
            })
        }).catch(error => {
            console.log('main.js GetInfo error')
        })
    } else {
        if (hasPermission(store.getters.roles, to)) {
            next();
        } else {
            next('/401')
            NProgress.done(); // 结束Progress
        }
    }
});

router.afterEach(() => {
    NProgress.done(); // 结束Progress
});

Vue.config.productionTip = false;

// 生产环境错误日志
if (process.env === 'production') {
    Vue.config.errorHandler = function(err, vm) {
        console.log(err, window.location.href);
        errLog.pushLog({
            err,
            url: window.location.href,
            vm
        })
    };
}
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
