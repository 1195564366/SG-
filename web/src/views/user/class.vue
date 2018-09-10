<template>
  <div class="grouping">
    <el-button type="primary" style="float: right;" @click="addShow = true">添加分组</el-button>
    <div class="header">
      <el-input
        placeholder="请输入分组名称"
        v-model="name"
        clearable>
      </el-input>
      <el-button type="success" @click="page = 1; getClassData()">搜索</el-button>
    </div>
    <!-- 表格 -->
    <div style="min-height: 600px;">
      <el-table
      :data="classData"
      border
      style="width: 100%;margin-top: 2%;">
        <el-table-column
          prop="name"
          label="分组名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="员工数量"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.staffNum}}
            &nbsp;&nbsp;
            <el-button type="text" @click="classDetailsClick(scope.row.cid, 1)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="进线详情"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="classDetailsClick(scope.row.cid, 2)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.create_time | dataFrm}}</template>
        </el-table-column>
        <el-table-column
          label="导出"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="exportShow = true; exportData.cid = scope.row.cid; exportData.name = scope.row.name">导出</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="primary" plain @click="modifyClick(scope.row)" size="mini">修改</el-button>
            <el-button type="danger" plain @click="deleteClick(scope.row.cid)" size="mini">删除</el-button>
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
    <!-- 添加分组弹窗 -->
    <el-dialog title="添加分组" 
      :visible.sync="addShow"
      center
      width="25%"
      @close="closeAddShow"
      >
      <el-form :model="addData">
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="addData.name" maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddShow">取 消</el-button>
        <el-button type="primary" @click="addQuest">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改分组弹窗 -->
    <el-dialog title="修改分组" 
      :visible.sync="modifyShow"
      center
      width="25%"
      @close="closeModifyShow"
      >
      <el-form :model="addData">
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="modifyData.name" maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModifyShow">取 消</el-button>
        <el-button type="primary" @click="modifyQuest">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详细信息弹窗 -->
    <el-dialog :title="detailsTitle" 
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
          prop="name"
          :label="detailsLabel.name">
          <template slot-scope="scope">{{type === 1 ? '' : '+'}} {{scope.row.name}}</template>
        </el-table-column>
        <el-table-column
          :label="detailsLabel.time">
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
    <!-- 选择导出时间弹窗 -->
    <el-dialog title="选择导出日期" 
      :visible.sync="exportShow"
      center
      width="40%"
      @close="closeExportShow"
      >
      <div style="text-align: center">
        <el-date-picker
        v-model="exportData.time"
        align="right"
        type="date"
        placeholder="选择日期"
        value-format="timestamp"
        :picker-options="pickerOptions1">
      </el-date-picker>
      <el-button type="primary" plain size="mini" @click="getExportExcel">导出</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { classAdd, classDataR, classDelete, classModify, classDetails, exportExcel } from '@/api/class'

export default {
  data() {
    return {
      exportShow: false,
      addShow: false,
      exportData: {},
      name: '',
      page: 1,
      total: 0,
      classData: [],
      addData: {},
      modifyData: {},
      modifyShow: false,
      detailsTitle: '',
      detailsShow: false,
      detailsPage: 1,
      detailsTotal: 0,
      detailsLabel: {},
      detailsDataRequest: {},
      detailsData: [],
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      type: 1
    }
  },
  methods: {
    getClassData() {
      classDataR({
        page: this.page,
        name: this.name
      }).then(res => {
        this.classData = res.data
        this.total = res.total
      })
    },
    handleCurrentChange(el) {
      this.page = el
      this.getClassData()
    },
    closeAddShow() {
      this.addData = {}
      this.addShow = false
    },
    closeModifyShow() {
      this.modifyData = {}
      this.modifyShow = false
    },
    addQuest() {
      if (!this.addData.name) {
        this.$message.error('信息填写不完整')
      } else if (this.addData.name.length === 0) {
        this.$message.error('信息填写不完整')
      } else {
        classAdd({
          name: this.addData.name
        }).then(res => {
          if (res.code) {
            this.$message.success(res.msg)
            this.getClassData()
            this.addShow = false
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    deleteClick(el) {
      console.log(el)
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        classDelete({
          cid: el
        }).then(res => {
          if (res.code) {
            this.$message.success(res.msg)
            this.getClassData()
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
    },
    modifyClick(el) {
      this.modifyData = {
        cid: el.cid,
        name: el.name
      }
      this.modifyShow = true
    },
    modifyQuest() {
      if (this.modifyData.name.length === 0) {
        this.$message.error('分组名不能为空')
      } else {
        classModify({
          cid: this.modifyData.cid,
          name: this.modifyData.name
        }).then(res => {
          if (res.code) {
            this.$message.success(res.msg)
            this.closeModifyShow()
            this.getClassData()
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    getDetailsData() {
      classDetails({
        page: this.detailsPage,
        cid: this.detailsDataRequest.cid,
        type: this.detailsDataRequest.type
      }).then(res => {
        this.detailsData = res.data
        this.detailsTotal = res.total
      })
    },
    classDetailsClick(el, type) {
      this.type = type
      this.detailsShow = true
      this.detailsTitle = type === 1 ? '员工详情' : '进线详情'
      this.detailsLabel.name = type === 1 ? '员工姓名' : '客户数量'
      this.detailsLabel.time = type === 1 ? '创建时间' : '添加时间'
      this.detailsDataRequest = {
        cid: el,
        type: type
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
    getExportExcel() {
      if (!this.exportData.time) {
        this.$message.error('请先选择导出日期')
      } else if (this.exportData.time.length === 0) {
        this.$message.error('请先选择导出日期')
      } else {
        this.$confirm(`是否导出${this.exportData.name}${moment(this.exportData.time).format('YYYY-MM-DD')}的进线日志`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exportExcel({
            time: this.exportData.time / 1000,
            cid: this.exportData.cid
          }).then(res => {
            console.log(res)
            if (res.code) {
              this.$message.success(res.msg)
              this.closeExportShow()
              // window.open(res.downUr)
              // var a1 = document.createElement('a') // 创建a标签
              // a1.setAttribute('href', res.downUrl)
              // a1.setAttribute('target', '_blank')
              // a1.click()
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消导出'
          })
        })
      }
    },
    closeExportShow() {
      this.exportShow = false
      this.exportData = {}
    }
  },
  created() {
    this.getClassData()
  },
  filters: {
    dataFrm(el) {
      return moment(el * 1000).format('YYYY-MM-DD HH:mm:ss') // eslint-disable-line
    }
  }
}
</script>

<style lang="stylus" scoped>
  .grouping
    width 95%
    margin 2% auto
    .header
      width 40%
      text-align center
      margin 0 auto
</style>
