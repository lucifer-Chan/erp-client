<template>
    <el-dialog
        title="确认收到快递并确认终审状态"
        :visible.sync="show"
    >
        <div>
            <el-form
                ref="submitForm"
                class="final-judgment-form"
                label-position="top"
                :rules="rules"
                :model="formData"
            >
                <el-form-item class="dialog-form-item" label="若代理人寄送的材料不完整，请勿操作，电话沟通代理人补全材料。后再次终审">
                </el-form-item>
                <el-form-item class="dialog-form-item" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio label="1">终审成功</el-radio>
                        <el-radio label="0">终审失败</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="" style="width: 60%" v-show="data.claimSupportType == 2 && formData.status == 1" prop="claimAmount">
                    <el-input class="" type="number" auto-complete="off" v-model="formData.claimAmount" placeholder="请填写理赔金额，如数字100">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item class="dialog-form-item" label="" v-show="formData.status == 0" prop="checkFailedReason">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" class="dialog-form-input" v-model="formData.checkFailedReason" placeholder="请输入终审失败原因"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show = false">取 消</el-button>
            <el-button type="primary" @click="submitFinal">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import Api from "@/api/preserve";
    export default {
        components: {
        },
        data() {
            const checkAmount = (rule, value, callback) => {
                if (!value && this.formData.status - 0 === 1 && this.data.claimSupportType == 2) {
                    callback(new Error('请输入理赔金额'));
                } else {
                    callback();
                }
            };
            const checkStatus = (rule, value, callback) => {
                if (value === null) {
                    callback(new Error('请选择终审结果'));
                } else {
                    callback();
                }
            };
            const checkFailedReason = (rule, value, callback) => {
                if (!value && this.formData.status - 0 === 0) {
                    callback(new Error('请输入终审失败原因'));
                } else {
                    callback();
                }
            };
            return {
                name: '',
                show: false,
                data: {},
                formData: {
                    claimInfoUuid: null, // uuid
                    status: null, // 0:审核不通过；1：审核通过
                    checkFailedReason: null, // 理赔不通过原因
                    claimAmount: null, // 理赔金额
                    needExpress: null, // 是否需要快递
                    expressAddress: null, // 邮寄地址
                    sendFiles: null // 寄送的材料
                },
                rules: {
                    claimAmount: [
                        { validator: checkAmount, trigger: 'blur' }
                    ],
                    checkFailedReason: [
                        { validator: checkFailedReason, trigger: 'blur' }
                    ],
                    status: [
                        { validator: checkStatus, trigger: 'change' }
                    ]
                }
            }
        },
        methods: {
            showDialog(data) {
                this.data = data;
                this.formData.claimInfoUuid = data.claimInfoUuid;
                this.formData.claimAmount = null;
                this.formData.checkFailedReason = null;
                this.formData.status = null;
                this.show = true;
            },
            submitFinal() {
                this.$refs.submitForm.validate(valid => {
                    if (valid) {
                        Api.submitFinalCheckResult(this.formData).then(rep => {
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
    .final-judgment-form{
        width: 80%;
        margin: auto;
    }
</style>