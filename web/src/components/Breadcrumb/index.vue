<template>
  <div>
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path" v-if="item.meta.title" >
          <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
          <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
    <div class="admin-content">
      管理员：{{admin_name}}
      <el-button type="text" style="margin-left: 20px" @click="updateShow = true">修改密码</el-button>
      <el-button type="text" style="margin-left: 20px" @click="outLogin">退出登录</el-button>
    </div>
    <!-- 修改密码弹窗 -->
    <el-dialog
      title="修改密码"
      :visible.sync="updateShow"
      width="40%"
      center
      :before-close="updateClose">
      <el-form :model="updateData" label-width="0" size="mini">
        <el-form-item>
          <div style="display: flex;flex-direction: row">
            <div style="width: 100px"><span class="red-must">*</span>&nbsp; 旧密码：</div>
            <el-input v-model="updateData.oldPwd" placeholder="请输入旧密码" maxlength="16" type="password" style="flex: 1;"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <div style="display: flex;flex-direction: row">
            <div style="width: 100px"><span class="red-must">*</span>&nbsp; 新密码：</div>
            <el-input v-model="updateData.newPwd1" placeholder="请输入密码" maxlength="16" type="password" style="flex: 1;"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <div style="display: flex;flex-direction: row">
            <div style="width: 100px"><span class="red-must">*</span>&nbsp; 重复密码：</div>
            <el-input v-model="updateData.newPwd2" placeholder="请再输入一次密码" maxlength="16" type="password" style="flex: 1;"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateClose">取消</el-button>
        <el-button type="primary" @click="updateDataRequest">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userModifyPwd } from '@/api/user'

export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null,
      admin_name: localStorage.sg_name,
      state: Number(localStorage.sg_state),
      updateData: {},
      updateShow: false
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'home') {
        matched = [{ path: '/home', meta: { title: '首页' }}].concat(matched)
      }
      if (this.state !== 3) {
        this.levelList = matched
      }
    },
    outLogin() {
      localStorage.clear()
      this.$router.push({ path: '/login' })
      this.$message.success('退出成功')
    },
    updateClose() {
      this.updateData = {}
      this.updateShow = false
    },
    updateDataRequest() {
      const reg = /^[A-Za-z0-9]+$/
      if (!this.updateData.oldPwd || !this.updateData.newPwd1 || !this.updateData.newPwd2) {
        this.$message.error('修改信息填写不完整')
      } else if (this.updateData.oldPwd.length === 0 || this.updateData.newPwd1.length === 0 || this.updateData.newPwd2.length === 0) {
        this.$message.error('修改信息填写不完整')
      } else if (this.updateData.newPwd1 !== this.updateData.newPwd2) {
        this.$message.error('两次密码输入不一致')
      } else if (!reg.test(this.updateData.newPwd1)) {
        this.$message.error('密码只能设置为数字和字母组合')
      } else if (this.updateData.newPwd1 < 6 || this.updateData.newPwd1 > 16) {
        this.$message.error('密码长度限制6-16位')
      } else {
        userModifyPwd({
          oldPwd: this.updateData.oldPwd,
          newPwd: this.updateData.newPwd1
        }).then(res => {
          if (res.code) {
            this.updateClose()
            for (let i = 0; i < 3; i++) {
              this.$message.success(`${res.msg},${i + 1}秒后自动退出请重新登录`)
              if (i === 2) {
                this.outLogin()
              }
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
  .admin-content {
    float: right;
    margin-right: 50px;
    display: inline-block;
    vertical-align: top;
    font-weight: 700;
    font-size: 14px;
  }
</style>
