import Api from 'api/userInfo';
import Cookies from 'js-cookie';

const user = {
    state: {
        name: '',
        roles: [],
        permissions: [],
        loginStatus: false
    },

    mutations: {
        SET_USER_INFO: (state, data) => {
            if (data) {
                state.roles = data.roleList;
                state.name = data.name;
                // state.permissions = data.permissionList;
                state.permissions = 'SUPER_ADMIN';
                state.loginStatus = true;

            } else {
                state.roles = [];
                state.name = '';
                state.permissions = [];
                state.loginStatus = false;
            }

        },
    },

    actions: {
        Login({commit},data) {
            console.log(data);
            return new Promise((resolve, reject) => {
                // let response ={
                //     data :{
                //         name:'admin',
                //         permissionList:'SUPER_ADMIN',
                //         roleList:'waitTrial'
                //     },
                // }
                Api.login(data).then(response => {
                    // console.log(commit);
                    console.log(data);
                    console.log(1111111);
                    console.log(response);
                    if (!response.success) {
                        console.log(2222);
                        reject(response);
                    } else {
                        const data = response;
                        console.log(data)
                        resolve(response);
                    }
                }).catch(error => {
                    console.log(error)
                    
                    reject(error);
                });
            });
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                //let response ={
                //    data :{
                //        name:'admin',
                //        permissionList:'SUPER_ADMIN',
                //        roleList:'waitTrial'
                //    },
                //}
                //commit('SET_USER_INFO', response.data);
                //resolve(response);
                 Api.getUserRoles().then(response => {

                     if (!response.success) {
                         commit('SET_USER_INFO');
                         reject(response);
                     } else {
                         const data = response.ret;
                         console.log(data)
                         commit('SET_USER_INFO', data);
                         resolve(response);
                     }
                 }).catch(error => {
                     // console.log(error)
                     commit('SET_USER_INFO');
                     reject(error);
                 });
            });
        },

        // 前端 登出
        LogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_USER_INFO');
                resolve();
            });
        },
    }
};

export default user;
