<template>
    <el-dialog title="变更撤单状态" :visible.sync="show">
        <div class="dialog-body">
            <el-form
                ref="formData"
                class="appeal-form"
                label-position="top"
                :model="formData"
            >
                <el-form-item >
                    <el-select v-model="formData.status" clearable placeholder="请选撤单结果">
                        <el-option v-for="item in applyStatusList" :key="item.id" :label="item.text" :value="item.id"></el-option>
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
        status: null
      },
      applyStatusList: [],
    //   data: {}
    };
  },
  methods: {
    change() {
      Api.changeStatus(this.formData)
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
      this.formData.id = data.id;
      this.formData.status = data.status;
      this.applyStatusList = extraData;
      //   this.formData.rejectReason = "";
      this.show = true;
    }
  }
};
</script>

<style scoped lang="scss">

</style>