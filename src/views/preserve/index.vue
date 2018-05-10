<template>
    <div class="app-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="待处理" name="waitHandle">
                <!--批量处理上传-->
                <el-upload
                        class="upload-panel"
                        ref="upload"
                        :action="uploadUrl"
                        accept="application/vnd.ms-excel"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="fileUploadSuccess"
                        :before-upload="beforeUpload"
                        :with-credentials=true
                        :auto-upload="true">
                    <el-button slot="trigger" size="small" type="primary">批量处理</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传Excel文件，且不超过500kb</div>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="已处理" name="alreadyHandled">

            </el-tab-pane>
        </el-tabs>

        <!--头部功能块-->
        <el-form :inline="true" class="demo-form-inline" ref="pageForm">
            <el-form-item >
                <el-date-picker
                    v-model="dateRange"
                    @change="dateRangeChange"
                    type="daterange"
                    align="left"
                    :range-separator="rangeSeparator"
                    placeholder="请选择申请时间段"
                    :editable="false"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item >
                <el-select v-model="formData.branchCompanyId" clearable placeholder="选择分公司">
                    <el-option v-for="item in groupList" :key="item.branchCompanyId" :label="item.branchCompanyName" :value="item.branchCompanyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="activeName === 'alreadyHandled'">
                <el-select v-model="statesSelect" clearable placeholder="审核状态(成功或驳回)">
                    <el-option label="成功" value=2></el-option>
                    <el-option label="驳回" value=3></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-input v-model="formData.name" placeholder="申请用户名"></el-input>
            </el-form-item>
            <el-form-item >
                <el-input v-model="formData.addressee" placeholder="收件人"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="reset">清空信息</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="onSubmit">搜索</el-button>
            </el-form-item>
            <el-form-item v-if="activeName === 'waitHandle'">
                <el-button type="primary" @click="unifyHandle">批量统一处理</el-button>
            </el-form-item>
        </el-form>
        <!--表单主体-->
        <page-table
            v-loading.body="loading"
            :data-list="tableData"
            :columns="initData.columns | checkColumns(activeName)"
            :pageNo="formData.pageNum"
            :pageSize="pageSize"
            :total="total"
            :tablekey="key"
            @pageNoChange="pageNoChange"
            @selection-change="handleSelectionChange"
            ref="pageTable">
            <template scope="props" slot="cell">
                <!--根据表头来插入特定内容-->
                <span v-if="props.column.label === '订单编号'">{{ props.index + 1 + (formData.page - 1) * pageSize}}</span>
                <span v-else-if="props.column.label === '申请时间'">{{ props.row[props.column.property] | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                <span v-else-if="props.column.label === '申请状态'">{{ props.row[props.column.property] | checkStatus}}</span>
                <span v-else-if="props.column.label === '申请物流'">{{ props.row[props.column.property] | checkLogistics}}</span>

                <span v-else-if="props.column.label === '操作'">

                    <el-button v-if="initData.name === '纸质发票管理' && activeName === 'waitHandle'" size="small" type="primary" @click="showDialog('todeal', props.row)">处理</el-button>
                    <el-button v-if="initData.name === '纸质发票管理' && activeName === 'alreadyHandled'" size="small" type="primary" @click="showDialog('checkDetail', props.row)">查看</el-button>

                    <!--<el-button size="small" type="primary" @click="showDialog('finalJudgment', props.row)">终审</el-button>-->
                    <!--<el-button size="small" type="primary" @click="showDialog('appeal',props.row)">申诉处理</el-button>-->
                    <!--<el-button size="small" type="primary" @click="showDialog('feedback', props.row)">反馈</el-button>-->
                </span>
                <span v-else>{{ props.row[props.column.property]}}</span>
            </template>
        </page-table>

        <!--处理-->
        <to-deal ref="todeal" @refresh="setTableData"></to-deal>
        <!--查看状态-->
        <check-detail ref="checkDetail" ></check-detail>

    </div>
</template>

<script>
    import PageTable from './pageTable.vue';
    import checkDetail from './components/checkDetail.vue';
//    import ClaimVerification from './components/claimVerification.vue';
//    import FinalJudgment from './components/finalJudgment.vue';
//    import Appeal from './components/appeal.vue';
//    import Feedback from './components/feedback.vue';
    import toDeal from './components/todeal.vue';
    import ImgDialog from '@/components/ImageList/Index.vue';
    import Api from '@/api/preserve';
//    import initData from './claimInitData';
    import Vue from 'vue';


    Vue.filter('checkColumns', (list, activeName) => {
        return list.filter(item => {
            if ((activeName === 'waitHandle') && item.dealed) {
                return false
        }
            return true
        })
    })
    Vue.filter('checkStatus', value => {
        const data = {
            50: '待审批',
            200: '审批成功',
            300: '驳回',
        }
        return data[value]
    })
    Vue.filter('checkLogistics', value => {
        const data = {
            1: '顺丰快递',
            2: '中通快递',
            3: '申通快递',
            4: '圆通快递',
            5: 'EMS',
            99: '其他',
        };
        return data[value]
    })
    export default {
        name: 'preserve',
        components: { PageTable, ImgDialog, toDeal ,checkDetail},
        data() {
            return {
                loading: false,
//                isInner: this.$store.getters.permissions.indexOf('INNER') > -1 ? true: false, // 是否属于微易内部人员(用来展示／隐藏页面上的某些内容)
                products: [],
                groupList: [],
                rangeSeparator: ' ~ ',
                initData: {
                    name: '纸质发票管理',
                    getList: 'getInvoiceList',
                    toDeal: 'updateInvoiceInfo',
//                    searchParam: {
//                        applicantTime: false,
//                        branchCompanyId: true,
//                        name: true,
//                        statusCode: true,
//                    },
                    status: [2],
                    columns: [
                        {
                            label: '订单编号',
                            width: '100',
                            prop: 'index'
                        },
                        {
                            label: '申请时间',
                            width: '180',
                            prop: 'applicantTime',
//                            admin: true
                        },
                        {
                            label: '申请状态',
                            width: '130',
                            prop: 'statusCode',
                            dealed:true
                        },
                        {
                            label: '申请用户',
                            width: '220',
                            prop: 'applicantName'
                        },
                        {
                            label: '所属分公司',
                            width: '180',
                            prop: 'branchCompanyName',
//                            admin: true
                        },
                        {
                            label: '产品',
                            width: '180',
                            prop: 'productName'
                        },
                        {
                            label: '投保人(抬头)',
                            width: '180',
                            prop: 'invoiceTitle'
                        },
                        {
                            label: '收件人',
                            width: '180',
                            prop: 'addressee'
                        },
//                        {
//                            label: '申请物流',
//                            width: '180',
//                            prop: 'expressCompany'
//                        },
                        {
                            label: '面额',
                            width: '180',
                            prop: 'price'
                        },
                        {
                            label: '操作',
                            width: '160',
                            fix: 'right'
                        }
                    ]
                },
                dateRange: null,
                total: 0,
                pageSize: null,
                formData: {},
                tableData: [],
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
                activeName:'waitHandle',
                statesSelect:null,
                key:1,
                uploadUrl:process.env.BASE_API + '/insure/product/preservation/batchUpload',
                selectedItem: []
            }
        },
        watch:{
            activeName (val) {
                this.formData = {
                    searchStartTime: null,  // 搜索开始时间 毫秒数
                    searchEndTime: null,    // 搜索截止时间 毫秒数
                    branchCompanyId: null,  // 公司筛选
                    name: null,             // 申请用户名筛选
                    page: 1,
                    pageSize:50,
                };

                if (val === 'waitHandle') {
                    this.formData.statusCode = 0
                }
                else {
                    this.formData.statusCode = 1
                }
                this.statesSelect=null;
                this.setTableData();
                this.key = this.key + 1
            },
//            statesSelect (val) {
//                this.formData.statusCode = val
//            }
        },
        methods: {
            beforeUpload (file) {
                console.log(file)
            },
            handleRemove(file, fileList) {
//                console.log(file, fileList);
            },
            handlePreview(file) {
//                console.log(file);
            },
            fileUploadSuccess (file) {
                location.reload()
            },
            handleClick(tab, event) {
//                console.log(tab.name, event);
            },
            showDialog(ref, data) {
                if (ref === 'appeal' || ref === 'finalJudgment' || ref === 'feedback') {
                    this.$refs[ref].showDialog(data);
                    return;
                }
                const loading = this.$loading({
                    lock: true,
                    text: '正在加载...'
                });
                console.log(data)

                setTimeout(() =>{
                    this.$refs[ref].showDialog(data);
                    loading.close();
                },200)

            },
            /* 获取表格数据 */
            setTableData() {
                this.loading = true;
                Api[this.initData.getList](this.formData).then(rsp => {
//                    console.log(rsp)
                    this.tableData = rsp.data.invoiceList;
                    this.pageSize = this.formData.pageSize;
                    this.total = rsp.data.invoiceTotalCount;
                    this.loading = false;
                }).catch(error => {
//                    console.log(error)
                    this.loading = false;
                });
            },
            showImg(url) {
                this.$refs.imageDialog.showImgDialog(url);
            },
            getProducts() {
                Api.getListProducts().then(rep => {
                    this.products = rep.data;
                }).catch(error => {
//                    console.log(error)
                    this.loading = false;
                });
            },
            getGroupList() {
                Api.getBranchCompany().then(rep => {
                    this.groupList = rep.data;
                })
            },
            reset() {
                this.formData = {
                    searchStartTime: null,  // 搜索开始时间 毫秒数
                    searchEndTime: null,    // 搜索截止时间 毫秒数
                    branchCompanyId: null,  // 公司筛选
                    addressee:null,
                    name: null,             // 申请用户名筛选
                    page: 1,
                    pageSize:50,

                };
                this.statesSelect=null;
                this.dateRange = null;
                this.formData.statusCode = this.activeName === 'waitHandle' ? 0:1;
                this.setTableData();
            },
            onSubmit() {
                this.formData.page = 1;
                this.formData.statusCode = this.statesSelect ? this.statesSelect : (this.activeName === 'waitHandle' ? 0:1);
                this.setTableData();
            },
            pageNoChange(val) {
                this.formData.page = val;
                this.setTableData();
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
            },
            //批量统一处理
            unifyHandle() {
                if (!this.selectedItem.length) {
                    return this.$message('请先选择订单')
                }
                let invoiceId = this.selectedItem.map((item) => {
                    return item.invoiceId
                }).join(',')
                this.$refs.todeal.showDialog({invoiceId: invoiceId})
            },
            handleSelectionChange(val) {
                this.selectedItem = val
            }
        },
        created() {
//            this.initData = initData[this.$route.path.split('/').pop()];
            this.reset();
//            this.getProducts();
            //获取筛选分公司名
//            if (this.isInner) {
                this.getGroupList()
//            }
        }
    }
</script>

<style scoped>
.upload-panel{
    width: 500px;
    margin-bottom: 20px;
}
</style>
