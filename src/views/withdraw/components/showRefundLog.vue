<template>
    <el-dialog title="退款详情" :visible.sync="show">
        <div class="dialog-body">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="statusCode"
                    label="退款状态"
                    align="center"
                    :formatter="refundCode">
                </el-table-column>
                <el-table-column
                    prop="refundSuccessTime"
                    align="center"
                    label="退款时间"
                    :formatter="formatDate">
                </el-table-column>
                <el-table-column
                    prop="errorMsg"
                    align="center"
                    label="退款信息">
                </el-table-column>
            </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show = false">关 闭</el-button>
            <!-- <el-button type="primary" @click="change">确 定</el-button> -->
        </span>
    </el-dialog>
</template>

<script>
import Api from "@/api/withdraw";
// import PageTable from "@/components/PageTable/index.vue";
import Vue from "vue";
import { parseTime } from "@/utils/index.js";

// Vue.filter('refundCode', value => {
//     const data = {
//         400: "退款中",
//         500: "退款成功",
//         600: "退款失败",
//     }
//     return data[value]
// });

const refundCodeList = {
        400: "退款中",
        500: "退款成功",
        600: "退款失败",
    }


export default {
  components: {},
  data() {
    return {
      name: "",
      show: false,
      tableData: [{statusCode: 400, refundSuccessTime: new Date().getTime(), errorMsg: 'errorMsg'}]
    };
  },
  methods: {
    showDialog(data) {
        // data.refundLogList = [{statusCode: 400, refundSuccessTime: new Date().getTime(), errorMsg: 'errorMsg'}]
        this.tableData = data.refundLogList;
        this.show = true;
    }, 
    refundCode(row, column) {
        return refundCodeList[row[column.property]];
    },
    formatDate(row, column) {
        return parseTime(row[column.property]);
    }
  }
};
</script>

<style scoped lang="scss">

</style>