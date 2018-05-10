<template>
    <el-dialog title="审批详情" :visible.sync="show">
        <div class="dialog-body">
            <p>状态：{{statusCode | checkStatus}}，{{rejectMsg}} </p>
            <p v-if="expressCompany">物流公司：{{checkLogistics}}</p>
            <p v-if="expressNumber">快递单号：{{expressNumber}}</p>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="show = false">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import Api from "@/api/preserve";
    import Vue from 'vue';

    Vue.filter('checkStatus', value => {
        const data = {
            200: '成功',
            300: '驳回',
        };
        return data[value]
    })
//    Vue.filter('checkLogistics', value => {
//        const data = {
//            1: '顺丰快递',
//            2: '中通快递',
//            3: '申通快递',
//            4: '圆通快递',
//            5: 'EMS',
//            99: '其他',
//
//        };
//        return data[value]
//    })
    export default {
        components: {
        },
        data() {
            const replyCheck = function(rules, value, callback) {
                if (!value) {
                    callback(new Error('请填写处理结果'))
                } else {
                    callback()
                }
            }
            return {
                name: '',
                show: false,
                expressCompany:'',
                expressNumber:'',
                policyStatusCode:'',
                rejectMsg:'',
                statusCode:null
            }
        },
        computed : {
            checkLogistics (){
                const data = {
                    1: '顺丰快递',
                    2: '中通快递',
                    3: '申通快递',
                    4: '圆通快递',
                    5: 'EMS',
                    99: '其他',

                };
                return data[this.expressCompany]
            }
        },
        mounted () {
//            Api.getInvoiceInfo().then(rep => {
//                console.log(rep)
//            }).catch(error => {
////                    console.log(error)
//                this.loading = false;
//            });
        },
        methods: {
            showDialog(data) {
                console.log(data)
                this.expressCompany = data.expressCompany;
                this.expressNumber = data.expressNumber;
                this.policyStatusCode = data.policyStatusCode;
                this.rejectMsg = data.rejectMsg;
                this.statusCode = data.statusCode;
                this.show = true;
            },
            appeal() {
                this.$refs.submitForm.validate(valid => {
                    if (valid) {
                        Api.processComplaint(this.formData).then(() => {
                            this.show = false;
                            this.$emit('refresh');
                            this.$message({
                                message: '操作成功!',
                                type: 'success'
                            });
                        })
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .appeal-form{
        width: 80%;
        margin: auto;
    }
</style>