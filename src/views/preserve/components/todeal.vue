<template>
    <el-dialog title="申诉处理" :visible.sync="show">
        <div class="dialog-body">
            <el-tabs v-model="activeName" >
                <el-tab-pane label="申请通过" name="applyPass">
                    <el-form
                            v-if="activeName == 'applyPass'"
                            ref="submitForm"
                            class="appeal-form"
                            label-position="top"
                            :model="formData"
                            :rules="rules">
                        <el-form-item label="快递公司" :label-width="formLabelWidth" required prop="expressCompany">
                            <el-select v-model="formData.expressCompany" placeholder="请选择快递公司">
                                <el-option label="顺丰快递" value=1></el-option>
                                <el-option label="中通快递" value=2></el-option>
                                <el-option label="申通快递" value=3></el-option>
                                <el-option label="圆通快递" value=4></el-option>
                                <el-option label="EMS" value=5></el-option>
                                <el-option label="其他" value=99></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="快递单号" prop="expressSn">
                            <el-input v-model="formData.expressSn" auto-complete="off"></el-input>
                        </el-form-item>


                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="驳回" name="applyReject">
                    <el-form
                            v-if="activeName == 'applyReject'"
                            ref="submitForm"
                            class="appeal-form"
                            label-position="top"
                            :model="formData"
                            :rules="rules">
                        <!--<el-form-item label="快递公司" :label-width="formLabelWidth" required prop="rejectCode">-->
                            <!--<el-select v-model="formData.rejectCode" placeholder="请选择原因">-->
                                <!--<el-option label="已退保" value="700"></el-option>-->
                                <!--<el-option label="撤单" value="800"></el-option>-->
                                <!--<el-option label="其他状态" value="900"></el-option>-->
                            <!--</el-select>-->
                        <!--</el-form-item>-->
                        <!--<el-select v-model="formData.rejectCode" placeholder="原因" required prop="rejectCode" style="margin-bottom: 20px">-->
                            <!--<el-option label="已退保" value="700"></el-option>-->
                            <!--<el-option label="撤单" value="800"></el-option>-->
                            <!--<el-option label="其他状态" value="900"></el-option>-->
                        <!--</el-select>-->
                        <el-form-item class="dialog-form-item" required label="驳回原因:" prop="rejectInfo">
                        <!--<p style="margin-top:15px;line-height: 1.5em;">{{data.complaintContent}}</p>-->
                            <el-input type="textarea" v-model="formData.rejectInfo" required :autosize="{ minRows: 4, maxRows: 6 }" class="dialog-form-input" placeholder="请填写处理结果"></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
            <!--<tinymce :height='200' v-model="content"></tinymce>-->

        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show = false">取 消</el-button>
            <el-button type="primary" @click="deal">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import Api from "@/api/preserve";
    import Tinymce from '@/components/Tinymce'
    export default {
        components: {
            Tinymce
        },
        data() {
            const replyCheck = function(rules, value, callback) {
                if (!value) {
                    callback(new Error('请填写驳回理由'))
                } else {
                    callback()
                }
            }
            return {
                activeName:'applyPass',
                name: '',
                show: false,

                formData: {
                    expressCompany: '',
                    expressSn: '',
                    rejectCode:'',
                    rejectInfo:'',
                },
                rules: {
                    rejectInfo: [
                        { validator: replyCheck, trigger: 'blur' }
                    ],
                    expressSn:[
                        { required: true, message: '请输入快递单号', trigger: 'blur' }
                    ],
//                    rejectCode:[
//                        { required: true, message: '请输入原因', trigger: 'change' }
//                    ],
                    expressCompany:[
                        { required: true, message: '请输入快递公司', trigger: 'change' }
                    ]
                },
                data: {},
                formLabelWidth:'120px',
                content:''
            }
        },
        watch :{
            activeName () {
//                if (this.activeName === 'applyPass') {
//                    this.formData.expressCompany = data.expressCompany;
//                    this.formData.expressSn = data.expressSn;
//                }
//                else {
//                    this.formData.rejectCode = '';    //驳回状态
//                    this.formData.rejectInfo = '';    //驳回理由
//                }

            }
        },
        methods: {
            showDialog(data) {
                let ids = data.invoiceId.toString().split(',')
                this.data = data;
                if (ids.length) {
                    this.formData.invoiceIds = ids
                } else {
                    this.formData.invoiceId = data.invoiceId;
                }
                this.show = true;
            },
            deal() {
                this.formData.status = this.activeName === 'applyReject' ? 0:1;


                console.log(this.formData)
                this.$refs.submitForm.validate(valid => {
                    if (valid) {
                        if (this.activeName === 'applyPass') {
                            this.formData.rejectCode = '';    //驳回状态
                            this.formData.rejectInfo = '';    //驳回理由
                            this.formData.expressCompany = parseInt(this.formData.expressCompany)
                        }
                        else {
                            this.formData.expressCompany = '';
                            this.formData.expressSn = '';
                            this.formData.rejectCode = parseInt(this.formData.rejectCode)
                        }
                        Api.updateInvoiceInfo(this.formData).then(() => {
                            this.show = false;
                            this.$emit('refresh');
                            this.$message({
                                message: '操作成功!',
                                type: 'success'
                            });
                            this.resetFormData()
                        }).catch(error=>{
                            this.$message({
                                message: error,
                                type: 'error'
                            });
                        })
                    }
                });
            },
            resetFormData (){
                this.formData = {
                    expressCompany: '',
                    expressSn: '',
                    rejectCode:'',
                    rejectInfo:'',
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .appeal-form{
        width: 80%;
        margin: auto;
        .el-select{
            display: block;
        }
    }

</style>