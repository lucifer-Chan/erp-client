import fetch from 'utils/fetch';

export default {
    /* 获得筛选条件对象 */
    getSelectList() {
        return fetch({
            url: '/refund/getSelectList',
            method: 'get',
            // params: data
        })
    },
    /* 撤单审核列表 */
    getAuditList(data) {
        return fetch({
            url: '/refund/getAuditList',
            method: 'post',
            params: data
        })
    },
    /* 撤单结果列表 */
    getResultList(data) {
        return fetch({
            url: '/refund/getResultList',
            method: 'post',
            params: data
        })
    },
    /* 申请撤单同意 */
    auditPass(data) {
        return fetch({
            url: '/refund/auditPass',
            method: 'post',
            params: data
        })
    },
    /* 修改撤单状态(包含拒绝) */
    changeStatus(data) {
        return fetch({
            url: '/refund/changeStatus',
            method: 'post',
            params: data
        })
    },
    /* 修改撤单退款类型 */
    changeRefundType(data) {
        return fetch({
            url: '/refund/changeRefundType',
            method: 'post',
            params: data
        })
    },
    /* 重新发起退款 */
    retryRefund(data) {
        return fetch({
            url: '/refund/retryRefund',
            method: 'post',
            params: data
        })
    },
    /* 导出 */
    refundExport(data) {
        return fetch({
            url: '/refund/refundExport',
            method: 'post',
            params: data
        })
    },
    /*  一键撤单   */
    justRefund(data) {
        return fetch({
            url: '/refund/justRefund',
            method: 'post',
            params: data
        })
    },
    /* 申请指定用户撤单 */
    revokeAppointed(data) {
        return fetch({
            url: '/refund/revokeAppointed',
            method: 'post',
            params: data
        })
    },
    /* 获得指定撤单订单 */
    getAppointedPolicyInfo(data) {
        return fetch({
            url: '/refund/getAppointedPolicyInfo',
            method: 'post',
            params: data
        })
    }
}
