<template>
    <div class="app-container">
        <!--头部功能块-->
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
                <el-input v-model="formData.policySn" placeholder="保单号"></el-input>
            </el-form-item>
            <el-form-item >
                <el-select v-model="formData.productId" filterable clearable placeholder="请选择产品">
                    <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-select v-model="formData.refundReason" filterable clearable placeholder="撤单原因">
                    <el-option v-for="item in refundReasonList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-input v-model="formData.holderName" placeholder="投保人姓名"></el-input>
            </el-form-item>
            <el-form-item >
                <el-input v-model="formData.salesUserMobile" placeholder="代理人电话"></el-input>
            </el-form-item>
            <el-form-item >
                <el-input v-model="formData.salesUserId" placeholder="代理人ID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="reset">清空信息</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="onSubmit">搜索</el-button>
            </el-form-item>
        </el-form>
        <!--表单主体-->
        <page-table
            v-loading.body="loading"
            :data-list="tableData"
            :columns="initData.columns"
            :pageNo="formData.pageNum"
            :pageSize="pageSize"
            :total="total"
            :tablekey="key"
            @pageNoChange="pageNoChange">
            <template scope="props" slot="cell">
                <!--根据表头来插入特定内容-->
                <span v-if="props.column.label === '序号'">{{ props.index + 1}}</span>
                <span v-if="props.column.label === '投保人身份正反面'">
                    <el-button size="small" type="primary" @click="showImg(props.row[props.column.property.split(',')[0]], '投保人姓名： ' + props.row.holderName + '， 身份证号： ' + props.row.holderIdCard)">正面</el-button>
                    <el-button size="small" type="primary" @click="showImg(props.row[props.column.property.split(',')[1]])">反面</el-button>
                </span>
                <span v-else-if="props.column.label === '撤单申请表'">
                    <el-button size="small" type="primary"  @click="showImg(props.row[props.column.property])">查看</el-button>
                </span>

                <span v-else-if="props.column.label === '接收手机变更申请'">

                    <el-button size="small" v-if="props.row[props.column.property]" type="primary"  @click="showImg( props.row.standbyMobileProof ,  '变更后的手机：' + props.row[props.column.property])">查看</el-button>

                    <span v-else>-</span>
                </span>
                <span v-else-if="props.column.label === '申请时间'">{{ props.row[props.column.property] | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>

                <span v-else-if="props.column.label === '操作'">
                    <el-button size="small" type="primary" @click="agreeApply(props.row)">同意</el-button>
                    <el-button size="small" type="danger" @click="showDialog('refuse', props.row)">拒绝</el-button>
                    <el-button size="small" type="primary" @click="justRefund(props.row)">一键撤单</el-button>
                </span>
                <span v-else>{{ props.row[props.column.property]}}</span>
            </template>
        </page-table>

        <!--处理-->
        <refuse ref="refuse" @refresh="setTableData"></refuse>
        <!--查看状态-->
        <!-- <check-detail ref="checkDetail" ></check-detail> -->

        <img-dialog ref="imageDialog"></img-dialog>

    </div>
</template>

<script>
import PageTable from "@/components/PageTable/index.vue";
import ImgDialog from "@/components/ImageList/Index.vue";
import refuse from "./components/refuse.vue";
import Api from "@/api/withdraw";
import Vue from "vue";

export default {
  name: "apply",
  components: { ImgDialog, PageTable, refuse },
  data() {
    return {
      loading: false,
      productList: [],
      groupList: [],
      refundReasonList: [],
      rangeSeparator: " ~ ",
      initData: {
        name: "撤单申请",
        getList: "getAuditList",
        // toDeal: 'updateInvoiceInfo',
        columns: [
          {
            label: "序号",
            width: "90"
            // prop: "index"
          },
          {
            label: "保单号",
            width: "160",
            prop: "policySn"
          },
          {
            label: "保险产品名称",
            width: "160",
            prop: "productName",
            dealed: true
          },
          {
            label: "投保人",
            width: "120",
            prop: "holderName"
          },
          {
            label: "被保人",
            width: "180",
            prop: "insuredName"
          },
          {
            label: "ID",
            width: "180",
            prop: "userId"
          },
          {
            label: "投保人身份正反面",
            width: "180",
            prop: "idCardFront,idCardBack"
          },
          {
            label: "撤单申请表",
            width: "100",
            prop: "userSign"
          },
          {
            label: "错误信息",
            width: "100",
            prop: "errorMsg"
          },
            {
                label: "申请时间",
                width: "180",
                prop: "applyTime"
            },
            {
                label: "撤单原因",
                width: "150",
                prop: "refundReason"
            },
            {
                label: "接收手机变更申请",
                width: "100",
                prop: "standbyMobile"
            },
          {
            label: "操作",
            width: "260",
            fix: "right"
          }
        ]
      },
      dateRange: null,
      total: 0,
      pageSize: null,
      formData: {},
      tableData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      activeName: "waitHandle",
      statesSelect: null,
      key: 1
    };
  },
  methods: {
    handleClick(tab, event) {},
    showDialog(ref, data) {
      const loading = this.$loading({
        lock: true,
        text: "正在加载..."
      });
      console.log(data);

      setTimeout(() => {
        this.$refs[ref].showDialog(data);
        loading.close();
      }, 200);
    },
    /* 获取表格数据 */
    setTableData() {
      this.loading = true;
      //   this.formData.pageNum = this.formData.pageNum - 1;
      Api[this.initData.getList](this.formData)
        .then(rsp => {
          this.tableData = rsp.data.content;
          this.pageSize = this.formData.size;
          this.total = rsp.data.totalElements;
          //   this.pageNum = rsp.data.number + 1;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    showImg(url, msg) {
      this.$refs.imageDialog.showImgDialog(url, msg);
    },
    getSelectList() {
      Api.getSelectList()
        .then(rep => {
          this.productList = rep.data.productList;
            this.refundReasonList = rep.data.refundReasonList
          // console.log(this.productList);
        })
        .catch(error => {
          this.loading = false;
        });
    },
    reset() {
      this.formData = {
        startTime: null, // 搜索开始时间 毫秒数
        endTime: null, // 搜索截止时间 毫秒数
        policySn: null, // 保单号
        productId: null, // 产品筛选
        holderName: null, //投保人姓名
        salesUserMobile: null, //代理人电话
        salesUserId: null, //代理人ID
        refundReason: null, //撤单原因
        pageNum: 1,
        pageSize: 20
      };
      this.dateRange = null;
      this.setTableData();
    },
    onSubmit() {
      this.formData.pageNum = 1;
      this.setTableData();
    },
    pageNoChange(val) {
      this.formData.pageNum = val;
      this.setTableData();
    },
    dateRangeChange(val) {
      if (!val) {
        this.formData.startTime = null;
        this.formData.endTime = null;
      } else {
        const dateArray = val.split(this.rangeSeparator);
        this.formData.startTime =
          new Date(dateArray[0]).getTime() - 8 * 60 * 60 * 1000;
        this.formData.endTime =
          new Date(dateArray[1]).getTime() + 16 * 60 * 60 * 1000 - 1;
      }
      console.log(this.formData);
    },
    agreeApply(data) {
      this.$confirm("同意会发起退款, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          Api.auditPass({ id: data.id })
            .then(rep => {
              this.loading = false;
              if(!rep.data) {
                this.$message({
                  message: "撤单失败!",
                  type: "error"
                });
                return;
              }
              this.$message({
                message: "操作成功!",
                type: "success"
              });
              this.setTableData();
            })
            .catch(error => {
              this.loading = false;
              this.$message({
                message: error,
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
      justRefund(data) {
        this.$confirm("一键撤单, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {

             this.loading = true;
              Api.justRefund({ id: data.id })
                      .then(rep => {
                      this.loading = false;
                      if(!rep.data) {
                          this.$message({
                              message: "撤单失败!",
                              type: "error"
                          });
                          return;
                      }
                        this.$message({
                              message: "操作成功!",
                              type: "success"
                          });
                        this.setTableData();
                  })
              .catch(error => {
                      this.loading = false;
                      this.$message({
                          message: error,
                          type: "error"
                      });
              });


        }).catch(() => {});
      }
  },
  created() {
    this.getSelectList();
    this.reset();
  },
    computed: {

    }
};
</script>

<style scoped>
.upload-panel {
  width: 500px;
  margin-bottom: 20px;
}
</style>
