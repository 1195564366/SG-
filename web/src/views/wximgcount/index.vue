<template>
  <div class="wximg">
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
      <el-button type="success" @click="page = 1;getWximgData()">搜索</el-button>
    </div>
    <!-- 表格 -->
    <!-- 表格 -->
    <div style="min-height: 600px; margin-top: 2%;">
      <el-table
        :data="wximg"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="员工姓名"
          v-if="state === 1 || state === 2">
        </el-table-column>
        <el-table-column
          prop="cname"
          label="分组名称"
          v-if="state === 1 || state === 2">
        </el-table-column>
        <el-table-column
          label="截图">
          <template slot-scope="scope">
            <img :src="scope.row.wx_img_url" alt="" @click="enlargeImage(scope.row.wx_img_url)" class="wx-img">
            <!-- <img src="../../../../api/wximage/测试一组/2018-08-26/测试一号.png" alt="" @click="enlargeImage('../../../../api/wximage/测试一组/2018-08-26/测试一号.png')" class="wx-img"> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="wx_num"
          label="客户人数">
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
  </div>
</template>

<script>
import moment from 'moment'
import { userClass } from '@/api/user'
import { wximgData } from '@/api/customer'

export default {
  data() {
    return {
      state: Number(localStorage.sg_state),
      seachData: {},
      classData: [],
      page: 1,
      total: 0,
      wximg: []
    }
  },
  methods: {
    getWximgData() {
      wximgData({
        page: this.page,
        cid: this.seachData.cid,
        name: this.seachData.name
      }).then(res => {
        this.wximg = res.data
        this.total = res.total
      })
    },
    handleCurrentChange(el) {
      this.page = el
      this.getWximgData()
    },
    enlargeImage(el) { // 图片放大
      this.$alert(`<img src="${el}" width="300px" height="600px">`, '微信截图', {
        dangerouslyUseHTMLString: true,
        center: true
      })
    }
  },
  created() {
    userClass().then(res => {
      this.classData = res.data
    })
    this.getWximgData()
  },
  filters: {
    dataFrm(el) {
      return moment(el * 1000).format('YYYY-MM-DD') // eslint-disable-line
    }
  }
}
</script>

<style lang="stylus" scoped>
  .wximg
    width 95%
    margin 2% auto
    .header
      width 70%
      text-align center
      margin 0 auto
    .wx-img
      width 40px
      height 40px
      cursor pointer
</style>
