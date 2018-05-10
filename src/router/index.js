import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');
// const authRedirect = _import('login/authredirect');

/* Index 首页 */
const Index = _import('index/index');

/* error page */
const Err404 = _import('error/404');
const Err401 = _import('error/401');

/* 直营店 */
// const DirectSale = _import('directSale/index');

/* 理赔 */
const Preserve = _import('preserve/index');

/* 账号管理 */
const AccountManagement = _import('account/accountManagement');
const GroupManagement = _import('account/groupManagement');

/* 撤单管理 */
const WithdrawApply = _import('withdraw/apply');
const WithdrawResult = _import('withdraw/result');
const RefundExport = _import('withdraw/export');
const RevokeAppointed = _import('withdraw/revokeAppointed');

Vue.use(Router);

/**
 * icon : the icon show in the sidebar
 * hidden : if hidden:true will not show in the sidebar
 * redirect : if redirect:noredirect will not redirct in the levelbar
 * noDropdown : if noDropdown:true will not has submenu
 * meta : 权限标识（meta为空则表明该路由不需要权限也可以访问）
 * defaultOpen: true/false 是否默认展开该菜单
 **/

export const constantRouterMap = [
    {path: '/login', component: Login, hidden: true},
    // {path: '/authredirect', component: authRedirect, hidden: true},
    {path: '/404', component: Err404, hidden: true},
    {path: '/401', component: Err401, hidden: true},
    // {path: '/index', component: Index, hidden: true},
    {
        path: '/',
        redirect: '/preserve/index',
        name: '首页',
        hidden: true
    },
    // {
    //     path: '/preserve',
    //     component: Layout,
    //     redirect: '/preserve/index',
    //     name: '审核及资料输入',
    //     icon: 'quanxian',
    //     defaultOpen: true,
    //     children: [
    //         {path: 'index', component: Index, name: '保全首页', hidden: true},
    //         {path: '1', component: Preserve, name: '纸质发票管理', meta: 'waitTrial'},
    //     ]
    // },
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
});

export const asyncRouterMap = [
    // {
    //     path: '/directSale',
    //     component: Layout,
    //     redirect: '/directSale/index',
    //     name: '直营店',
    //     icon: 'quanxian',
    //     children: [{path: 'index', component: DirectSale, name: '直营店首页'}]
    // },
    {
        path: '/preserve',
        component: Layout,
        redirect: '/preserve/index',
        name: '审核及资料输入',
        icon: 'quanxian',
        defaultOpen: true,
        children: [
            {path: 'index', component: Index, name: '保全首页', hidden: true},
            {path: '1', component: Preserve, name: '纸质发票管理', meta: 'waitTrial'},
            {path: '2', component: Preserve, name: '理赔初审不通过列表', meta: 'trialFail'},
            {path: '3', component: Preserve, name: '理赔材料待寄送列表', meta: 'waitSend'},
            {path: '4', component: Preserve, name: '理赔待终审列表', meta: 'waitFinalJudge'},
            {path: '5', component: Preserve, name: '理赔终审结果列表', meta: 'finalJudgeResult'},
            {path: '6', component: Preserve, name: '撤销理赔列表', meta: 'cancelClaim'},
            {path: '7', component: Preserve, name: '理赔意见反馈列表', meta: 'feedback'},
            {path: '8', component: Preserve, name: '申诉列表', meta: 'appeal'},
        ]
    },
    {
        path: '/account',
        component: Layout,
        redirect: '/account/index',
        name: '账号管理',
        icon: 'quanxian',
        children: [
            {path: 'index', component: AccountManagement, name: '账号管理', meta: 'account'},
            {path: 'group', component: GroupManagement, name: '分组管理', meta: 'group'}
        ]
    },
    {
        path: '/withdraw',
        component: Layout,
        redirect: '/withdraw/apply',
        name: '撤单管理',
        icon: 'quanxian',
        children: [
            {path: 'apply', component: WithdrawApply, name: '撤单申请', meta: 'withdrawApply'},
            {path: 'result', component: WithdrawResult, name: '撤单结果', meta: 'withdrawResult'},
            {path: 'export', component: RefundExport, name: '导出数据', meta: 'refundExport'},
            {path: 'revokeAppointed', component: RevokeAppointed, name: '运营撤单', meta: 'revokeAppointed'}
        ]
    },
    {path: '*', redirect: '/404', hidden: true}
];
