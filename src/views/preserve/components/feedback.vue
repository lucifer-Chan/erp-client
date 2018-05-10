<template>
    <el-dialog title="编辑沟通结果" :visible.sync="show">
        <div class="dialog-body">
            <el-form
                class="feedback-form"
                label-position="top"
                ref="submitForm"
                :rules="rules"
                :model="formData"
            >
                <el-form-item class="dialog-form-item" label="" prop="reply">
                    <el-input type="textarea" v-model="formData.reply" :autosize="{ minRows: 4, maxRows: 6 }" class="dialog-form-input" placeholder="请填写沟通反馈"></el-input>
                </el-form-item>

            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show = false">取 消</el-button>
            <el-button type="primary" @click="feedBack">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import Api from "@/api/preserve";
    export default {
        components: {
        },
        data() {
            const replyCheck = function(rules, value, callback) {
                if (!value) {
                    callback(new Error('请填写沟通反馈'))
                } else {
                    callback()
                }
            }
            return {
                name: '',
                show: false,
                data: {},
                formData: {
                    claimUuid: '',
                    reply: ''
                },
                rules: {
                    reply: [
                        { validator: replyCheck, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            showDialog(data) {
                this.data = data;
                this.formData.claimUuid = data.claimInfoUuid;
                this.formData.reply = data.evaluationReply;
                this.show = true;
            },
            feedBack() {
                this.$refs.submitForm.validate(valid => {
                    if (valid) {
                        Api.replyEvaluation(this.formData).then(() => {
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
    .feedback-form{
        width: 80%;
        margin: auto;
    }
</style>