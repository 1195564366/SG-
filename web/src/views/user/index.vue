<template>
  <div class="user">
    <el-button type="primary" style="float: right;" @click="addShow = true">添加员工</el-button>
    <div class="header">
      <el-select v-model="cid" placeholder="请选择分组" clearable>
          <el-option
            v-for="item in classData"
            :key="item.cid"
            :label="item.name"
            :value="item.cid">
          </el-option>
        </el-select>
      <el-input
        placeholder="请输入员工姓名"
        v-model="name"
        clearable>
      </el-input>
      <el-button type="success" @click="page = 1;getUserData()">搜索</el-button>
    </div>
    <!-- 表格 -->
    <div style="min-height: 600px">
      <el-table
        :data="userData"
        border
        style="width: 100%;margin-top: 2%;">
        <el-table-column
          prop="name"
          label="姓名"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="state"
          label="职位"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="class"
          label="分组"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="wx_num"
          label="微信号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="进线详情"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="classDetailsClick(scope.row.uid)" v-if="scope.row.state === '普通'">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.create_time | dataFrm}}</template>
        </el-table-column>
        <el-table-column
          label="最后操作时间"
          show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.last_time | dataFrm}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="primary" plain @click="modifyClick(scope.row)">修改</el-button>
            <el-button type="danger" plain @click="deleteClick(scope.row.uid)" v-if="scope.row.state !== '超管'">删除</el-button>
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
    <!-- 添加员工弹窗 -->
    <el-dialog title="添加员工" 
      :visible.sync="addShow"
      center
      width="40%"
      @close="closeAddShow"
      >
      <el-form :model="addData">
        <el-form-item label="姓名" label-width="120px">
          <el-input v-model="addData.name" maxlength="10" style="flex: 1;"></el-input>
        </el-form-item>
        <el-form-item label="职位" label-width="120px">
          <el-select v-model="addData.state" placeholder="请选择职位" style="flex: 1;">
            <el-option
              v-for="item in jobData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组" label-width="120px">
          <el-select v-model="addData.cid" placeholder="请选择分组" style="flex: 1;">
            <el-option
              v-for="item in classData"
              :key="item.cid"
              :label="item.name"
              :value="item.cid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信号" label-width="120px">
          <el-input v-model="addData.wx_num" maxlength="50" style="flex: 1;"></el-input>
        </el-form-item>
        <el-form-item label="账号" label-width="120px">
          <el-input v-model="addData.account" maxlength="16" style="flex: 1;"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="addData.pwd1" maxlength="16" type="password" style="flex: 1;"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" label-width="120px">
          <el-input v-model="addData.pwd2" maxlength="16" type="password" style="flex: 1;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddShow">取 消</el-button>
        <el-button type="primary" @click="addRequest">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改员工弹窗 -->
    <el-dialog title="修改员工" 
      :visible.sync="modifyShow"
      center
      width="25%"
      @close="closeModifyShow"
      >
      <el-form :model="modifyData">
        <el-form-item label="姓名" label-width="120px">
          <el-input v-model="modifyData.name" maxlength="10" style="flex: 1;"></el-input>
        </el-form-item>
        <el-form-item label="微信号" label-width="120px">
          <el-input v-model="modifyData.wx_num" maxlength="10" :disabled="true" sstyle="flex: 1;"></el-input>
        </el-form-item>
        <el-form-item label="职位" label-width="120px">
          <el-input v-model="modifyData.state" :disabled="true" style="flex: 1;"></el-input>
        </el-form-item>
        <el-form-item label="分组" label-width="120px">
          <el-select v-model="modifyData.cid" placeholder="请选择分组" :disabled="modifyData.state === '超管' || modifyData.state === '审核员'" style="flex: 1;">
            <el-option
              v-for="item in classData"
              :key="item.cid"
              :label="item.name"
              :value="item.cid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" label-width="120px">
          <el-input v-model="modifyData.account" :disabled="true" style="flex: 1;"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="120px">
          <el-input v-model="modifyData.pwd1" maxlength="16" type="password" style="flex: 1;"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" label-width="120px">
          <el-input v-model="modifyData.pwd2" maxlength="16" type="password" style="flex: 1;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModifyShow">取 消</el-button>
        <el-button type="primary" @click="modifyRequest">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 客户详情弹窗 -->
    <el-dialog title="进线详情" 
      :visible.sync="detailsShow"
      center
      width="40%"
      @close="closeDetailsShow"
      >
      <el-table
        :data="detailsData"
        border
        style="width: 100%">
        <el-table-column
          label="进线数量">
          <template slot-scope="scope">+ {{scope.row.num}}</template>
        </el-table-column>
        <el-table-column
          label="添加时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFrm}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center; margin-top: 50px;"
        layout="prev, pager, next"
        @current-change="handleCurrentChangeDetails"
        :total="detailsTotal">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { userClass, userAdd, userDataRequest, userModify, userDelete } from '@/api/user'
import { classDetails } from '@/api/class'

export default {
  data() {
    return {
      userData: [],
      page: 1,
      total: 0,
      name: '',
      cid: '',
      jobData: [
        {
          value: 2,
          label: '审核员'
        },
        {
          value: 3,
          label: '普通员工'
        }
      ],
      classData: [],
      addShow: false,
      addData: {},
      detailsShow: false,
      detailsPage: 1,
      detailsTotal: 0,
      detailsDataRequest: {},
      detailsData: [],
      modifyShow: false,
      modifyData: {}
    }
  },
  methods: {
    closeAddShow() {
      this.addData = {}
      this.addShow = false
    },
    addRequest() {
      const reg = /^[A-Za-z0-9]+$/
      if (!this.addData.name || !this.addData.state || (this.addData.state === 3 && !this.addData.cid) || (this.addData.state === 3 && !this.addData.wx_num) || !this.addData.account || !this.addData.pwd1 || !this.addData.pwd2) {
        this.$message.error('信息填写不完整')
      } else if (this.addData.name.length === 0 || this.addData.state.length === 0 || (this.addData.state === 3 && this.addData.cid.length === 0) || (this.addData.state === 3 && this.addData.wx_num.length === 0) || this.addData.account.length === 0 || this.addData.pwd1.length === 0 || this.addData.pwd2.length === 0) {
        this.$message.error('信息填写不完整')
      } else if (this.addData.pwd1 !== this.addData.pwd2) {
        this.$message.error('两次密码输入不一致')
      } else if (this.addData.account > 16 || this.addData.account < 6) {
        this.$message.error('账号应为6-16位')
      } else if (this.addData.pwd1 > 16 || this.addData.pwd1 < 6) {
        this.$message.error('密码应为6-16位')
      } else if (!reg.test(this.addData.account)) {
        this.$message.error('账号应为字母或数字')
      } else if (!reg.test(this.addData.pwd1)) {
        this.$message.error('密码应为字母或数字')
      } else {
        if (this.addData.state === 2) {
          this.addData.cid = null
          this.addData.wx_num = null
        }
        userAdd({
          account: this.addData.account,
          password: this.addData.pwd1,
          name: this.addData.name,
          state: this.addData.state,
          cid: this.addData.cid,
          wx_num: this.addData.wx_num
        }).then(res => {
          if (res.code) {
            this.$message.success(res.msg)
            this.closeAddShow()
            this.getUserData()
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    getUserData() {
      userDataRequest({
        page: this.page,
        name: this.name,
        cid: this.cid
      }).then(res => {
        this.userData = res.data
        this.total = res.total
      })
    },
    handleCurrentChange(el) {
      this.page = el
      this.getUserData()
    },
    getDetailsData() {
      classDetails({
        page: this.detailsPage,
        cid: this.detailsDataRequest.cid,
        type: 3
      }).then(res => {
        this.detailsData = res.data
        this.detailsTotal = res.total
      })
    },
    classDetailsClick(el) {
      this.detailsShow = true
      this.detailsDataRequest = {
        cid: el
      }
      this.getDetailsData()
    },
    handleCurrentChangeDetails(el) {
      this.detailsPage = el
      this.getDetailsData()
    },
    closeDetailsShow() {
      this.detailsShow = false
      this.detailsPage = 1
      this.detailsTotal = 0
    },
    modifyClick(el) {
      console.log(el)
      this.modifyData = {
        name: el.name,
        account: el.account,
        state: el.state,
        cid: el.cid,
        uid: el.uid,
        wx_num: el.wx_num
      }
      this.modifyShow = true
    },
    closeModifyShow() {
      this.modifyData = {}
      this.modifyShow = false
    },
    modifyRequest() {
      const reg = /^[A-Za-z0-9]+$/
      if (this.modifyData.name.length === 0) {
        this.$message.error('请输入姓名')
      } else if ((!this.modifyData.pwd1 && this.modifyData.pwd2) || (this.modifyData.pwd1 && !this.modifyData.pwd2)) {
        this.$message.error('两次密码必须同时输入')
      } else {
        if (this.modifyData.pwd1 || this.modifyData.pwd2) {
          if (this.modifyData.pwd1 !== this.modifyData.pwd2) {
            this.$message.error('两次密码输入不一致')
          } else if (!reg.test(this.modifyData.pwd1)) {
            this.$message.error('密码应为字母或数字')
          } else if (this.modifyData.pwd1 > 16 || this.modifyData.pwd1 < 6) {
            this.$message.error('密码应为6-16位')
          } else {
            userModify({
              uid: this.modifyData.uid,
              cid: this.modifyData.cid,
              name: this.modifyData.name,
              pwd: this.modifyData.pwd1
            }).then(res => {
              if (res.code) {
                this.$message.success(res.msg)
                this.closeModifyShow()
                this.getUserData()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        } else {
          userModify({
            uid: this.modifyData.uid,
            cid: this.modifyData.cid,
            name: this.modifyData.name
          }).then(res => {
            if (res.code) {
              this.$message.success(res.msg)
              this.closeModifyShow()
              this.getUserData()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      }
    },
    deleteClick(el) {
      this.$confirm('此操作将永久删除该员工账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userDelete({
          uid: el
        }).then(res => {
          if (res.code) {
            this.$message.success(res.msg)
            this.getUserData()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  created() {
    userClass().then(res => {
      this.classData = res.data
    })
    this.getUserData()
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
  .user
    width 95%
    margin 2% auto
    .header
      width 70%
      text-align center
      margin 0 auto
</style>
