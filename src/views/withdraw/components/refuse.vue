<template>
    <el-dialog title="拒绝撤单" :visible.sync="show">
        <div class="dialog-body">
            <el-form
                ref="formData"
                class="appeal-form"
                label-position="top"
                :model="formData"
                :rules="rules"
            >
                <el-form-item class="dialog-form-item" label="拒绝理由:" prop="rejectReason">
                    <!-- <p style="margin: 0 0 15px;line-height: 1.5em;">{{data.complaintContent}}</p> -->
                    <el-input type="textarea" v-model="formData.rejectReason" required :autosize="{ minRows: 4, maxRows: 6 }" class="dialog-form-input" placeholder="请填写拒绝理由"></el-input>
                </el-form-item>

            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show = false">取 消</el-button>
            <el-button type="primary" @click="refuse('formData')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import Api from "@/api/withdraw";
export default {
  components: {},
  data() {
    const replyCheck = function(rules, value, callback) {
      if (!value || value == "") {
        console.log(value);
        callback(new Error("请填写拒绝理由"));
      } else {
        callback();
      }
    };
    return {
      name: "",
      show: false,
      formData: {},
      rules: {
        rejectReason: [{ validator: replyCheck, trigger: "blur" }]
      },
      data: {}
    };
  },
  methods: {
    refuse(formData) {
      // console.log(this.formData);
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.formData.status = 4; //STATUS_AUDIT_REJECT(4,"审核未通过")
          console.log(this.formData);
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
        } else {
          return false;
        }
      });
    },
    showDialog(data) {
      this.data = data;
      this.formData.id = data.id;
      this.formData.status = "";
      this.formData.rejectReason = "";
      this.show = true;
    }
  }
};
</script>

<style scoped lang="scss">

</style>