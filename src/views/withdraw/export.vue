<template>
    <div class="app-container">
        <!--头部功能块-->
        <el-form :inline="true" class="demo-form-inline" ref="pageForm" :model="formData" >
            <el-form-item prop="startTime" label="时间" :rules="[
          { required: true, message: '请选择日期'},
        ]">
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

        </el-form>


            <el-button type="primary" @click="onSubmit()" >导出</el-button>


    </div>
</template>

<script>
import Api from "@/api/withdraw";
import Vue from "vue";

export default {
  name: "export",
  data() {
    return {
        _href: '',
        loading: false,
        formData: {},
        dateRange: null,
        rangeSeparator: " ~ ",
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
        initData: {
            name: "导出数据",
            getList: "refundExport",
        }
    };
  },
  methods: {
    reset() {
        this.formData = {
            startTime: null, // 搜索开始时间 毫秒数
            endTime: null, // 搜索截止时间 毫秒数
        };
        this.dateRange = null;
        console.log(this.formData);

    },
    onSubmit() {
        this.$refs.pageForm.validate(valid => {
            console.log(valid);
            if (valid) {
                this._href = process.env.BASE_API +"/refund/"+ this.initData.getList + "?startTime=" + (this.formData.startTime ? this.formData.startTime : '') + "&endTime=" + (this.formData.endTime ? this.formData.endTime : '')
                window.open(this._href)
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
      dateRangeChange(val) {
        console.log(val)
          if (!val) {
              this.formData.startTime = null;
              this.formData.endTime = null;
          } else {
              const dateArray = val.split(this.rangeSeparator);
              console.log(dateArray[0]);
              this.formData.startTime =
                      new Date(dateArray[0]).getTime() - 8 * 60 * 60 * 1000;
              this.formData.endTime =
                      new Date(dateArray[1]).getTime() + 16 * 60 * 60 * 1000 - 1;
          }


      }

  },
components: {
},
  created() {
      this._href = '';
      this.reset();
  }
};
</script>

<style scoped>
.upload-panel {
  width: 500px;
  margin-bottom: 20px;
}
</style>
