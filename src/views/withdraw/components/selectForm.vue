<template>
    <el-form :inline="true" class="demo-form-inline" ref="pageForm">
            <el-form-item >
                <el-date-picker
                    v-model="dateRange"
                    @change="dateRangeChange"
                    type="daterange"
                    align="left"
                    :range-separator="rangeSeparator"
                    placeholder="请选择日期范围"
                    :editable="false"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item >
                <el-input v-model="formData.name" placeholder="保单号"></el-input>
            </el-form-item>
            <!-- <el-form-item >
                <el-select v-model="formData.branchCompanyId" clearable placeholder="请选择产品">
                    <el-option v-for="item in productList" :key="item.branchCompanyId" :label="item.branchCompanyName" :value="item.branchCompanyId"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item >
                <el-input v-model="formData.name" placeholder="投保人姓名"></el-input>
            </el-form-item>
            <el-form-item >
                <el-input v-model="formData.name" placeholder="代理人电话"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="reset">清空信息</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="onSubmit">搜索</el-button>
            </el-form-item>
        </el-form>
</template>

<script>
    import Api from '@/api/withdraw';

    export default {
        name: '',
        components: {
        },
        data() {
            return {
                name: 'pageTable',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        methods: {
            getSelectList() {
                Api.getSelectList().then(rep => {
                    this.productList = rep.data.productList.slice(0,10);
                    // console.log(this.productList);
                }).catch(error => {
                    this.loading = false;
                });
            },
            dateRangeChange(val) {
                if (!val) {
                    this.formData.minApplicantTime = null;
                    this.formData.maxApplicantTime = null;
                } else {
                    const dateArray = val.split(this.rangeSeparator);
                    this.formData.minApplicantTime = new Date(dateArray[0]).getTime() - 8*60*60*1000;
                    this.formData.maxApplicantTime = new Date(dateArray[1]).getTime() + 16*60*60*1000 -1;
                }
            }
        },
        created() {
            
        }
    }
</script>

<style scoped>

</style>
