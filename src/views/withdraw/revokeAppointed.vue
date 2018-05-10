<template>
    <div class="app-container">
        <!--头部功能块-->
        <el-form :inline="true" class="demo-form-inline" ref="pageForm">
            <el-form-item >
                <el-input v-model="formData.policyUuid" placeholder="保单UUID"></el-input>
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
            :needPagination="false"
            :total="total"
            :tablekey="key">
            <template scope="props" slot="cell">
                <!--根据表头来插入特定内容-->
                <span v-if="props.column.label === '序号'">{{ props.index + 1}}</span>
                <span v-else-if="props.column.label === '撤单结果'">{{ props.row[props.column.property] | applyStatus}}</span>
                <span v-else-if="props.column.label === '操作'">
                    <el-button v-if="props.row.status === 6" size="small" type="primary"  @click="retryRefund(props.row)">重新退款</el-button>
                    <el-button v-else-if="!props.row.status || props.row.status === 5" size="small" type="primary" @click="agreeApply(props.row)">撤单</el-button>
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

<script type="text/ecmascript-6">
import PageTable from "@/components/PageTable/index.vue";
import ImgDialog from "@/components/ImageList/Index.vue";
import refuse from "./components/refuse.vue";
import Api from "@/api/withdraw";
import Vue from "vue";

const applyStatusList = [
    { id: 0, text: "撤单已申请" },
    { id: 1, text: "撤单审核中" },
    { id: 2, text: "撤单通过" },
    { id: 3, text: "打款中" },
    { id: 4, text: "审核未通过" },
    { id: 5, text: "审核失败" },
    { id: 6, text: "退款失败" },
    { id: 7, text: "审核处理中" }
];

Vue.filter("applyStatus", value => {
    if(value){
        return applyStatusList[value].text;
    }
});

export default {
  name: "revokeAppointed",
  components: { ImgDialog, PageTable, refuse },
  data() {
    return {
      loading: false,
      initData: {
        name: "撤单申请",
        getList: "getAppointedPolicyInfo",
        columns: [
          {
            label: "序号",
            width: "90"
          },
          {
            label: "保单号",
            width: "160",
            prop: "policySn"
          },
          {
            label: "保单uuid",
            width: "160",
            show: false,
            prop: "policyUuid"
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
            label: "撤单结果",
            width: "120",
            prop: "status"
          },
          {
            label: "错误信息",
            width: "100",
            prop: "errorMsg"
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
      formData: {},
      tableData: [],
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
      Api[this.initData.getList](this.formData)
        .then(rsp => {
          this.tableData = rsp.data;
          this.loading = false;
          this.total = rsp.data.length;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    showImg(url, msg) {
      this.$refs.imageDialog.showImgDialog(url, msg);
    },
    reset() {
      this.formData = {
        policyUuid: null
      };
      this.dateRange = null;
    },
    onSubmit() {
      if(this.formData.policyUuid){
        this.setTableData();
      }else{
          this.$message({
              message: "请输入保单号",
              type: "error"
          });
      }
    },
    agreeApply(data) {
      this.$confirm("同意会发起撤单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          Api.revokeAppointed({ policyUuid: data.policyUuid })
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
      retryRefund(data) {
          this.$confirm("确认重新发起退款, 是否继续?", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning"
                  })
                  .then(() => {
                      this.loading = true;
                      Api.retryRefund({ id: data.id })
                              .then(rep => {
                                  this.loading = false;
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
  },
  created() {
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
