<template>
    <el-dialog title="选择银行支持" :visible.sync="show">
        <div class="dialog-body">
            <el-form
                ref="accountForm"
                class="appeal-form"
                label-position="top"
                :model="formData"
            >
                <el-form-item class="dialog-form-item" label="选择银行支持">
                    <el-checkbox-group style="display: inline-block;margin-right: 1rem;" v-model="formData.bankList">
                        <el-checkbox ref="banks" v-for="item in list" :key="item.id" :label="item.bankName">{{item.bankName}}</el-checkbox>
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
            return {
                name: '',
                show: false,
                list: [],
                formData: {
                    bankList: []
                }
            }
        },
        methods: {
            showDialog(data) {
                const list = [];
                for (const item of data || []) {
                    list.push(item.bankName);
                }
                this.formData.bankList = list;
                this.show = true;
            },
            submitForm() {
                let list = [];
                for (const item of this.formData.bankList) {
                    for (const bank of this.list) {
                        if (item === bank.bankName) {
                            list.push(bank);
                            break;
                        }
                    }
                }
                this.$emit('chooseBank', list)
                this.show = false;
            },
        },
        created() {
            Api.getBankList().then(rep => {
                this.list = rep.data;
            })
        }
    }
</script>

<style scoped lang="scss">
    .appeal-form {
        width: 80%;
        margin: auto;
    }

    .el-checkbox {
        margin-left: 15px;
    }
</style>