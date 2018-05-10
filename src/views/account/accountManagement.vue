<template>
    <div class="app-container">
        <add-account ref="addAccount" @refresh="getList"></add-account>
        <el-form :inline="true" ref="pageForm">
            <el-form-item>
                <el-input placeholder="请输入备注名" v-model="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="search" icon="search" type="primary">搜索</el-button>
            </el-form-item>
        </el-form>

        <page-table
            :data-list="list"
            :columns="columns"
            :pageNo="formData.pageNum"
            :pageSize="formData.pageSize"
            :total="formData.total"
            :needPagination="false"
            @pageNoChange="pageNoChange"
            style="max-width: 1120px;">
            <template scope="props" slot="cell">
                <span v-if="props.column.label === '序号'">{{ props.index + 1 + (formData.pageNum - 1) * formData.pageSize}}</span>
                <span v-else-if="props.column.label === '角色'">
                    {{props.row[props.column.property] | roleFilter}}
                </span>
                <span v-else-if="props.column.label === '操作'">
                    <el-button v-if="$store.getters.name === props.row.uId" type="text" :disabled="true" size="small">当前用户</el-button>
                    <el-button v-if="$store.getters.name !== props.row.uId" size="small" @click="showUser(props.row)">编辑</el-button>
                    <el-button v-if="$store.getters.name !== props.row.uId" size="small" @click="deleteUser(props.row)">删除</el-button>
                </span>
                <span v-else-if="props.column.label === '保全操作'">
                    <el-button type="text" :disabled="true" size="small">保单及发票</el-button>
                </span>
                <span v-else>{{ props.row[props.column.property]}}</span>

            </template>
        </page-table>
    </div>
</template>

<script>
    import PageTable from '../preserve/pageTable.vue';
    import AddAccount from './components/account.vue';
    import Api from '@/api/preserve'
    import Vue from 'vue'

    Vue.filter('roleFilter', list => {
        let value = '';
        for (const item of list) {
            if (value) {
                value += '，';
            }
            value += item.displayName;
        }
        return value
    })

    export default {
        components: {
            PageTable,
            AddAccount
        },
        data() {
            return {
                name: '',
                columns: [
                    {
                        label: '序号',
                        width: '100'
                    },
                    {
                        label: '分组名',
                        width: '180',
                        prop: 'displayName'
                    },
                    {
                        label: '账号数',
                        width: '180',
                        prop: 'uId'
                    },
                    {
                        label: '保单',
                        width: '280',
                        prop: 'roleList'
                    },
                    {
                        label: '发票',
                        width: '180',
                        prop: 'mobile'
                    },
                    {
                        label: '已关联产品数量',
                        width: '180',
                        prop: 'mobile'
                    },
                    {
                        label: '操作',
                        width: '150',
                        fix: 'right'
                    },
                    {
                        label: '保全操作',
                        width: '100',
                        fix: 'right'
                    }
                ],
                searchInput: '',
                list: [],
                formData: {
                    pageNum: 1,
                    pageSize: 20,
                    total: 50
                }
            }
        },
        methods: {
            search() {
                this.formData.pageNum = 1;
                this.getList();
            },
            getList() {
                const loading = this.$loading({
                    lock: true,
                    text: '正在加载...'
                });
                Api.getUserList().then(rep => {
                    const list = rep.data.filter(item => {
//                        if (item.uId === this.$store.getters.name) {
//                            return false
//                        }
                        if (!this.searchInput) {
                            return true
                        } else if (this.searchInput && item.displayName && item.displayName.indexOf(this.searchInput) > -1) {
                            return true
                        }
                        return false
                    })
                    this.list = list;
                    loading.close()
                }).catch(()=> {
                    loading.close()
                })
            },
            pageNoChange(val) {
                this.formData.pageNum = val;
                this.getList();
            },
            showUser(data) {
                this.$refs.addAccount.showDialog(data);
            },
            deleteUser(data) {
                console.log(data)
                this.$confirm('确认删除该账号？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const loading = this.$loading({
                        lock: true,
                        text: '正在删除...'
                    });
                    Api.deleteUser(data.id).then(rep => {
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
            this.getList()
        }
    }
</script>

<style scoped lang="scss">

</style>