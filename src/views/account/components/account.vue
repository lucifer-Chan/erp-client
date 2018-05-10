<template>
    <el-dialog title="编辑账号" :visible.sync="show">
        <div class="dialog-body">
            <el-form
                ref="accountForm"
                class="appeal-form"
                label-position="top"
                :model="formData"
                :rules="rules"
            >
                <el-form-item class="dialog-form-item" label="账号">
                    <el-input :disabled="true" v-model="formData.uId" required placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item class="dialog-form-item" label="备注名" prop="displayName">
                    <el-input v-model="formData.displayName" placeholder="请输入备注名"></el-input>
                </el-form-item>
                <el-form-item class="dialog-form-item" label="手机号" prop="mobile">
                    <el-input v-model="formData.mobile" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <!--<el-form-item class="dialog-form-item" label="" prop="bzname">-->
                    <!--<el-input v-model="formData.bzname" required placeholder="请输入姓名"></el-input>-->
                <!--</el-form-item>-->

                <el-form-item class="dialog-form-item" label="角色列表" prop="roleList">
                    <p style="line-height: 1.4em;">配置账号需要产品配置后关联理赔产品的账号后，对应账号即可处理对应保险产品理赔业务</p>
                    <el-checkbox-group style="display: inline-block;margin-right: 1rem;" v-model="roleList">
                        <el-checkbox v-for="item in allRoles" :label="item.id" :key="item.id">{{item.displayName}}</el-checkbox>
                    </el-checkbox-group>
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
            const commonCheck = function(rules, value, callback) {
                if (!value || value === []) {
                    switch (rules.fields) {
                        case 'displayName':
                            callback(new Error('请输入备注名'))
                        case 'mobile':
                            callback(new Error('请输入手机号'))
                        default:
                            callback(new Error('请完善信息'))
                    }
                } else {
                    callback()
                }
            }
            return {
                name: '',
                show: false,
                allRoles: [],
                roleList: [],
                formData: {
                    uId: '',
                    mobile: '',
                    claimGroupId: '',
                    displayName: '',
                },
                rules: {
                    displayName: [
                        { validator: commonCheck, trigger: 'blur' }
                    ],
                    mobile: [
                        { validator: commonCheck, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            getAllRoles() {
                Api.getPowerList().then(rep => {
                    this.allRoles = rep.data;
                })
            },
            showDialog(data) {
                let formData = {}, roleList = [];
                Object.assign(formData, data)
                this.formData = formData;

                for (const item of data.roleList || []) {
                    roleList.push(item.id);
                }

                this.roleList = roleList;
                this.show = true;
            },
            submitForm() {
                this.$refs.accountForm.validate(valid => {
                    if (valid) {
                        const params = {

                        };
                        Object.assign(params, this.formData);
                        params.roleList = this.roleList;
                        params.uid = params.uId;

                        delete params.uId;

                        console.log(params)
                        const loading = this.$loading({
                            lock: true,
                            text: '正在提交...'
                        });
                        Api.saveUser(params).then(rep => {
                            this.show = false;
                            loading.close()
                            this.$emit('refresh');
                            this.$message({
                                message: '操作成功!',
                                type: 'success'
                            });
                        }).catch(() => {
                            loading.close()
                        })
                    }
                });
            }
        },
        created() {
            this.getAllRoles()
        }
    }
</script>

<style scoped lang="scss">
    .appeal-form{
        width: 80%;
        margin: auto;
    }
    .el-checkbox{
        margin-left: 15px;
    }
</style>