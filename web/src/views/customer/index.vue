<template>
  <div class="customer">
    <div v-if="state === 3" class="header">
      <el-button type="primary" @click="uploadShow = true; fileList.length === 0" >上传微信截图</el-button>
      <el-button type="primary" @click="addShow = true">添加客户</el-button>
    </div>
    <div class="header" v-if="state === 1 || state === 2">
      <el-select v-model="seachData.cid" placeholder="请选择分组" clearable>
          <el-option
            v-for="item in classData"
            :key="item.cid"
            :label="item.name"
            :value="item.cid">
          </el-option>
        </el-select>
      <el-input
        placeholder="请输入员工姓名"
        v-model="seachData.name"
        clearable>
      </el-input>
      <el-button type="success" @click="page = 1;getCustomerData()">搜索</el-button>
    </div>
    <!-- 表格 -->
    <div style="min-height: 600px; margin-top: 2%;">
      <el-table
        :data="customer"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="员工姓名"
          v-if="state === 1 || state === 2">
        </el-table-column>
        <el-table-column
          prop="class"
          label="分组名称"
          v-if="state === 1 || state === 2">
        </el-table-column>
        <el-table-column
          label="客户数量">
          <template slot-scope="scope">
            + {{scope.row.num}}
          </template>
        </el-table-column>
        <el-table-column
          label="添加时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFrm}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="total"
      style="margin: 2% auto; text-align: center;">
    </el-pagination>
    <!-- 添加客户弹窗 -->
    <el-dialog title="添加客户" 
      :visible.sync="addShow"
      center
      width="25%"
      @close="closeAddShow"
      >
      <el-form>
        <el-form-item label="客户数量" label-width="120px">
          <!-- <el-input v-model="wxNum" maxlength="50" clearable style="flex: 1;"></el-input> -->
          <el-input-number v-model="wxNum" :min="1" :max="100" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddShow">取 消</el-button>
        <el-button type="primary" @click="addRequest">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传微信截图 -->
    <el-dialog title="微信截图" 
      :visible.sync="uploadShow"
      center
      width="30%"
      @close="closeUploadShow"
      >
      <el-upload
        ref="uploadImg"
        class="upload-demo"
        action="http://192.168.0.101:8083/wximage/num"
        :auto-upload="true"
        :file-list="fileList"
        :data="uploadData"
        :limit="1"
        :on-exceed="onExceed"
        :on-success="onSuccessImg"
        :before-upload="verificationImageFormat"
        accept=".jpg,.jpeg,.png"
        list-type="picture-card"
        style="text-align: center;">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { userClass } from '@/api/user'
import { customerData, customerADD } from '@/api/customer'

export default {
  data() {
    return {
      uploadData: {
        token: localStorage.sg_token
      },
      customer: [],
      classData: [],
      seachData: {},
      state: Number(localStorage.sg_state),
      page: 1,
      total: 0,
      addShow: false,
      wxNum: 1,
      uploadShow: false,
      fileList: []
    }
  },
  methods: {
    getCustomerData() {
      customerData({
        page: this.page,
        cid: this.seachData.cid,
        name: this.seachData.name
      }).then(res => {
        this.customer = res.data
        this.total = res.total
      })
    },
    handleCurrentChange(el) {
      this.page = el
      this.getCustomerData()
    },
    closeAddShow() {
      this.addShow = false
      this.wxNum = ''
    },
    addRequest() {
      const reg = /^[0-9]+.?[0-9]*$/
      if (this.wxNum.length === 0) {
        this.$message.success('输入客户数量')
      } else if (!reg.test(this.wxNum)) {
        this.$message.success('客户数量只能为整数')
      } else {
        customerADD({
          wx_num: Number(this.wxNum)
        }).then(res => {
          if (res.code) {
            this.$message.success(res.msg)
            this.closeAddShow()
            this.getCustomerData()
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    closeUploadShow() {
      this.uploadShow = false
    },
    onSuccessImg(res) { // 上传微信截图
      console.log(res)
      if (res.code) {
        this.closeUploadShow()
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    verificationImageFormat(file) {
      if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') {
        this.$message.error('图片格式错误')
        return false
      } else if (!(file.size / 1024 / 1024 < 1)) {
        this.$message.error('图片太大不能超过1M')
        return false
      } else {
        return true
      }
    },
    onExceed() {
      this.$message.error('请先清除已上传记录')
    }
  },
  created() {
    userClass().then(res => {
      this.classData = res.data
    })
    this.getCustomerData()
  },
  filters: {
    dataFrm(el) {
      if (el) {
        return moment(el * 1000).format('YYYY-MM-DD HH:mm:ss') // eslint-disable-line
      } else {
        return '无'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .customer
    width 95%
    margin 2% auto
    .header
      width 70%
      text-align center
      margin 0 auto
</style>
