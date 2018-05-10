import { asyncRouterMap, constantRouterMap } from 'src/router';

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */

function hasPermission(roles, route) {
    if (route.meta) {
        if (roles.indexOf(route.meta) < 0) {
            return false
        }
    }
    return true
}

function filterAsyncRouter(asyncRouterMap, roles) {

    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(roles, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, roles)
            }
            return true
        }
        return false
    })

    return accessedRouters
}

function deleteEmpty(list) {
    return list.filter(item => {
        if (item.children && item.children.length === 0) {
            return false;
        } else {
            return true;
        }
    })
}

const permission = {
    state: {
        routers: constantRouterMap, // 页面路由
        addRouters: [], // 根据权限过滤后的路由
        defaultOpeneds: [],   // 左侧默认展开的菜单
    },
    mutations: {
        SET_ROUTERS: (state, routers,) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        },
        SET_DEFAULT_OPENEDS: (state, defaultOpeneds) => {
            state.defaultOpeneds = defaultOpeneds;
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { roles } = data
                let accessedRouters, defaultOpeneds = [];
                accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
                accessedRouters = deleteEmpty(accessedRouters)

                for (const item of accessedRouters) {
                    if (item.defaultOpen) {
                        defaultOpeneds.push(item.name)
                    }
                }
                console.log('设置addRouters', accessedRouters);

                commit('SET_ROUTERS', accessedRouters, defaultOpeneds);
                commit('SET_DEFAULT_OPENEDS', defaultOpeneds);
                resolve();
            })
        }
    }
};

export default permission;
