import fetch from 'utils/fetch';

export default {
    /* 获取纸质发票审批列表 */
    getInvoiceList(data) {
        return fetch({
            url: '/insure/product/preservation/getInvoiceList',
            method: 'get',
            params: data
        })
    },
    /* 修改发票信息 */
    updateInvoiceInfo(data) {
        return fetch({
            url: '/insure/product/preservation/updateInvoiceInfo',
            method: 'post',
            data
        })
    },
    /* 获取审批详情 */
    getInvoiceInfo(data) {
        return fetch({
            url: '/insure/product/preservation/getInvoiceInfo',
            method: 'get',
            params: data
        })
    },
    /* 获取审批详情分公司列表 */
    getBranchCompany(data) {
        return fetch({
            url: '/insure/product/preservation/getBranchCompany',
            method: 'get',
            params: data
        })
    },
    /* 获取权限信息 */
    getInfo() {
        return fetch({
            url: '/login/getUserInfo',
            method: 'get',
        });
    },

    /* 上传Excel */
    batchUpload() {
        return fetch({
            url: '/insure/product/preservation/batchUpload',
            method: 'post',
        });
    }
}
