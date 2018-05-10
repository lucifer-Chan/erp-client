<template>
    <el-dialog title="分组信息" :visible.sync="show">
        <div class="dialog-body">
            <el-form
                ref="submitForm"
                class="appeal-form"
                label-position="left"
            >
                <el-form-item class="dialog-form-item" label="分组名称">
                    <el-input v-model="formData.claimGroupName" required placeholder="请填写分组名称"></el-input>
                </el-form-item>
                <el-form-item class="dialog-form-item" label="备注名称">
                    <el-input v-model="formData.companyName" required placeholder="请填写备注名称"></el-input>
                </el-form-item>
                <el-form-item class="dialog-form-item" label="投保电话">
                    <el-input type="number" v-model="formData.contactPhone" required placeholder="请填写投保电话"></el-input>
                </el-form-item>
                <el-form-item class="dialog-form-item" label="寄送地址">
                    <el-input type="textarea" v-model="formData.deliveryAddress" required :autosize="{ minRows: 4, maxRows: 6 }" class="dialog-form-input" placeholder="请填写寄送地址（提示用户材料寄送地址）"></el-input>
                </el-form-item>
                <el-form-item class="dialog-form-item" label="打款信息">
                        <el-checkbox v-model="formData.needBankInfo">填写银行卡信息</el-checkbox>
                        <el-checkbox v-model="formData.bankBookSupport">支持存折</el-checkbox>
                </el-form-item>
                <el-form-item class="dialog-form-item" label="需要填写开户行" v-if="formData.needBankInfo">
                    <el-radio-group class="sh-radio-group" v-model="formData.needBranchBank">
                        <el-radio :label="true">需要填写开户行</el-radio>
                        <el-radio :label="false">不需要填写开户行</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="dialog-form-item" label="">
                    <el-button type="primary" size="small" @click="showChooseBank(formData.bankList)">选择银行支持</el-button>
                </el-form-item>
                <el-form-item class="dialog-form-item" label="理赔单号">
                    <el-radio-group class="sh-radio-group" v-model="formData.needClaimSerialNumber">
                        <el-radio :label="true">必须上传</el-radio>
                        <el-radio :label="false">不需要上传</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import Api from "@/api/preserve";
    export default {
        components: {
        },
        data() {
            return {
                name: '',
                show: false,
                formData: {
                    id: null,
                    claimGroupName: '',
                    companyName: '',
                    contactPhone: '',
                    bankBookSupport: null,
                    bankList: [],
                    deliveryAddress: '',
                    needBankInfo: null,
                    needBranchBank: null,
                    needClaimSerialNumber: null,
                }
            }
        },
        methods: {
            initFormData() {
                this.formData = {
                    id: null,
                    claimGroupName: '',
                    companyName: '',
                    contactPhone: '',
                    bankBookSupport: null,
                    bankList: [],
                    deliveryAddress: '',
                    needBankInfo: null,
                    needBranchBank: null,
                    needClaimSerialNumber: null,
                }
            },
            showDialog(data) {
                this.initFormData();
                if (data) {
                    this.formData = data;
                }
                this.show = true;
            },
            submitForm() {
                this.$refs.submitForm.validate(valid => {
                    if (valid) {
                        if (!this.formData.claimGroupName) {
                            this.$message({
                                message: '请输入分组名称',
                                type: 'error'
                            });
                            return;
                        }
                        if (!this.formData.deliveryAddress) {
                            this.$message({
                                message: '请输入寄送地址',
                                type: 'error'
                            });
                            return;
                        }
                        if (!this.formData.contactPhone) {
                            this.$message({
                                message: '请输入投保电话',
                                type: 'error'
                            });
                            return;
                        }
                        if (!this.formData.needBankInfo && !this.formData.bankBookSupport) {
                            this.$message({
                                message: '请选择打款信息',
                                type: 'error'
                            });
                            return;
                        }
                        if (this.formData.needBankInfo && this.formData.needBranchBank === null) {
                            this.$message({
                                message: '请选择是否需要填写开户行',
                                type: 'error'
                            });
                            return;
                        }
                        if (this.formData.bankList.length === 0) {
                            this.$message({
                                message: '请选择银行支持',
                                type: 'error'
                            });
                            return;
                        }
                        if (this.formData.needClaimSerialNumber === null) {
                            this.$message({
                                message: '请选择是否需要理赔单号',
                                type: 'error'
                            });
                            return;
                        }

                        const loading = this.$loading({
                            lock: true,
                            text: '正在加载...'
                        });

                        let params = {};
                        Object.assign(params, this.formData);
                        params.bankList = [];

                        for (const item of this.formData.bankList) {
                            params.bankList.push(item.id);
                        }

                        Api.saveGroupInfo(params).then(() => {
                            loading.close()
                            this.$message({
                                message: '操作成功!',
                                type: 'success'
                            });
                            this.$emit('refresh');
                            this.show = false;
                        }).catch(()=> {
                            loading.close()
                        })
                    }
                });
            },
            showChooseBank() {
                this.$emit('chooseBank', this.formData.bankList);
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