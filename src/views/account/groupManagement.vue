<template>
    <div class="app-container">
        <group ref="groupInfo" @chooseBank="showBankList" @refresh="getList"></group>
        <bank-list @chooseBank="chooseBank" ref="bankList" @confirm="confirmBankList"></bank-list>

        <el-button v-if="isAdmin" @click="showGroupInfo" type="primary" style="margin-bottom: 15px;">新建分组</el-button>

        <page-table
            :data-list="list"
            :columns="columns"
            :pageNo="formData.pageNum"
            :pageSize="formData.pageSize"
            :total="formData.total"
            :needPagination="false"
            @pageNoChange="pageNoChange"
            style="max-width: 800px;"
        >
            <template scope="props" slot="cell">
                <span v-if="props.column.label === '序号'">{{ props.index + 1 + (formData.pageNum - 1) * formData.pageSize}}</span>
                <span v-else-if="props.column.label === '操作'">
                    <el-button size="small" @click="editGroup(props.row)">编辑</el-button>
                    <el-button v-if="isAdmin" size="small" @click="deleteGroup(props.row)">删除</el-button>
                </span>
                <span v-else>{{ props.row[props.column.property]}}</span>

            </template>
        </page-table>
    </div>
</template>

<script>
    import PageTable from '../preserve/pageTable.vue';
    import Group from './components/group.vue';
    import BankList from './components/bankList.vue';
    import Api from '@/api/preserve';
    import Vue from 'vue';

    Vue.filter('bankFilter', (list, bank) => {
        for (const item in list) {
            if (item.id === bank.id) {
                return true;
            }
        }
        return false;
    })

    export default {
        components: {
            PageTable,
            BankList,
            Group
        },
        data() {
            return {
                name: '',
                bankList: [],
                isAdmin: this.$store.getters.permissions.indexOf('SUPER_ADMIN') > -1 ? true: false,
                columns: [
                    {
                        label: '序号',
                        width: '100'
                    },
                    {
                        label: '分组名',
                        width: '180',
                        prop: 'claimGroupName'
                    },
                    {
                        label: '备注名',
                        width: '300',
                        prop: 'companyName'
                    },
                    {
                        label: '操作',
                        width: '160'
                    }
                ],
                list: [],
                formData: {
                    pageNum: 1,
                    pageSize: 20,
                    total: 50
                }
            }
        },
        methods: {
            getList() {
                const loading = this.$loading({
                    lock: true,
                    text: '正在加载...'
                });
                Api.getGroupList().then(rep => {
                    this.list = rep.data;
                    loading.close()
                }).catch(()=> {
                    loading.close()
                })
            },
            pageNoChange(val) {
                this.formData.pageNum = val;
                this.getList();
            },
            showGroupInfo() {
                this.$refs.groupInfo.showDialog();
            },
            showBankList(list) {
                this.$refs.bankList.showDialog(list);
            },
            chooseBank(list) {
                this.$refs.groupInfo.formData.bankList = list;
            },
            confirmBankList(list) {
                this.bankList = list;
            },
            editGroup(data) {
                const loading = this.$loading({
                    lock: true,
                    text: '正在加载...'
                });
                Api.getGroupInfo(data.id).then(rep => {
                    this.$refs.groupInfo.showDialog(rep.data);
                    loading.close()
                }).catch(()=> {
                    loading.close()
                })
            },
            deleteGroup(data) {
                this.$confirm('确认删除该分组？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const loading = this.$loading({
                        lock: true,
                        text: '正在删除...'
                    });
                    Api.deleteGroupInfo(data.id).then(rep => {
                        this.getList();
                        loading.close()
                        this.$message({
                            message: '操作成功!',
                            type: 'success'
                        });
                    }).catch(()=> {
                        loading.close()
                    })
                })
            }
        },
        created() {
            this.getList();
        }
    }
</script>

<style scoped lang="scss">

</style>