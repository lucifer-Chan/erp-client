<template>
    <el-dialog title="变更打款方式" :visible.sync="show">
        <div class="dialog-body">
            <el-form
                ref="formData"
                class="appeal-form"
                label-position="top"
                :model="formData"
            >
                <el-form-item >
                    <el-select v-model="formData.refundType" clearable placeholder="请选打款方式">
                        <el-option v-for="item in refundTypeList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show = false">取 消</el-button>
            <el-button type="primary" @click="change">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import Api from "@/api/withdraw";
export default {
  components: {},
  data() {
    return {
      name: "",
      show: false,
      formData: {
        refundType: null
      },
      refundTypeList: [],
    //   data: {}
    };
  },
  methods: {
    change() {
      Api.changeRefundType(this.formData)
        .then(rep => {
          this.show = false;
          this.$emit("refresh");
          this.$message({
            message: "操作成功!",
            type: "success"
          });
        })
        .catch(error => {
          this.$message({
            message: error,
            type: "error"
          });
        });
    },
    showDialog(data, extraData) {
    //   this.data = data;
    console.log(extraData);
      this.formData.id = data.id;
      this.formData.refundType = data.refundType;
      this.refundTypeList = extraData;
      //   this.formData.rejectReason = "";
      this.show = true;
    }
  }
};
</script>

<style scoped lang="scss">

</style>