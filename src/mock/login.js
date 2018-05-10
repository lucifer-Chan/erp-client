import {param2Obj} from 'utils';

const userMap = {
    admin: {
        role: ['admin'],
        token: 'admin',
        introduction: '我是超级管理员',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
    },
    editor: {
        role: ['editor'],
        token: 'editor',
        introduction: '我是编辑',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    },
    developer: {
        role: ['develop'],
        token: 'develop',
        introduction: '我是开发',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: '工程师小王'
    }
}

const user = {
    data: {
        roleList: [
            'waitTrial', // 理赔待初审列表
            'trialFail', // 理赔初审不通过列表
            'waitSend', // 理赔材料待寄送列表
            'waitFinalJudge', // 理赔待终审列表
            'finalJudgeResult', // 理赔终审结果列表
            'cancelClaim', // 撤销理赔列表
            'feedback', // 理赔意见反馈列表
            'appeal', // 申诉列表
        ],
        token: '324jdnsjfjn34tjehewur3',
        introduction: '我是编辑',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'lxx'
    },
    success: true,
    info: 'success'
}

export default {
    login() {
        return user
    },
    logout() {
        return {
            success: true,
            info: 'success'
        }
    },
    getUserInfo() {
        return user
    }

};
