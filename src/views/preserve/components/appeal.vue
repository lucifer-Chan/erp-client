<template>
    <el-dialog title="申诉处理" :visible.sync="show">
        <div class="dialog-body">
            <el-form
                ref="submitForm"
                class="appeal-form"
                label-position="top"
                :model="formData"
                :rules="rules"
            >
                <el-form-item class="dialog-form-item" label="申诉内容:" prop="reply">
                    <p style="margin: 0 0 15px;line-height: 1.5em;">{{data.complaintContent}}</p>
                    <el-input type="textarea" v-model="formData.reply" required :autosize="{ minRows: 4, maxRows: 6 }" class="dialog-form-input" placeholder="请填写处理结果"></el-input>
                </el-form-item>

            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show = false">取 消</el-button>
            <el-button type="primary" @click="appeal">确 定</el-button>
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
                    callback(new Error('请填写处理结果'))
                } else {
                    callback()
                }
            }
            return {
                name: '',
                show: false,
                formData: {
                    reply: '',
                    complaintUuid: ''
                },
                rules: {
                    reply: [
                        { validator: replyCheck, trigger: 'blur' }
                    ]
                },
                data: {}
            }
        },
        methods: {
            showDialog(data) {
                this.data = data;
                this.formData.complaintUuid = data.complaintUuid;
                this.formData.reply = '';
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