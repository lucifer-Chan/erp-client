import fetch from 'utils/fetch';

export default {
    /* 获取权限信息 */
    getUserRoles() {
        return fetch({
            url: '/employee/menus',
            method: 'get'
        });
    },

    /* 获取权限信息 */
    login(data) {
        return fetch({
            url: '/login',
            method: 'post',
            params: data
        });
    }
}
