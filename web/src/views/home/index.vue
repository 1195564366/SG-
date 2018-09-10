<template>
  <div class="home">
    <div class="header">
      <el-radio-group v-model="type" @change="changeSelect">
        <el-radio :label="1">今天</el-radio>
        <el-radio :label="2">本周</el-radio>
        <el-radio :label="3">本月</el-radio>
      </el-radio-group>
    </div>
    <div id="echartDemo" style="height:800px;width: 100%"></div>
  </div>
</template>

<script>
import { homeData } from '@/api/home'

export default {
  data() {
    return {
      type: 1
    }
  },
  methods: {
    initEchart() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      homeData({
        type: this.type
      }).then(res => {
        if (res.code) {
          let series = [ // eslint-disable-line
            {
              type: 'pie',
              id: 'pie',
              radius: '30%',
              center: ['50%', '25%'],
              label: {
                formatter: `{b}: {@${res.data[0][res.data[0].length - 1]}} ({d}%)`
              },
              encode: {
                itemName: 'product',
                value: res.data[0][res.data[0].length - 1],
                tooltip: res.data[0][res.data[0].length - 1]
              }
            }
          ]
          res.data.forEach((item, index) => {
            if (index > 0) {
              series.push({ type: 'line', smooth: true, seriesLayoutBy: 'row' })
            }
          })
          var echartDemo = this.$echarts.init(document.getElementById('echartDemo')) // 初始化echart实例，获取dom
          var option = {
            legend: {},
            tooltip: {
              trigger: 'axis'
            },
            dataset: {
              source: res.data
            },
            xAxis: { type: 'category' },
            yAxis: { gridIndex: 0 },
            grid: { top: '55%' },
            series: series
          }
          echartDemo.on('updateAxisPointer', function(event) {
            var xAxisInfo = event.axesInfo[0]
            if (xAxisInfo) {
              var dimension = xAxisInfo.value + 1
              echartDemo.setOption({
                series: {
                  id: 'pie',
                  label: {
                    formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                  },
                  encode: {
                    value: dimension,
                    tooltip: dimension
                  }
                }
              })
            }
          })
          echartDemo.setOption(option)
          loading.close()
        } else {
          this.$message.error(res.msg)
          loading.close()
        }
      })
    },
    changeSelect() {
      this.initEchart()
    }
  },
  mounted() {
    this.initEchart()
  }
}
</script>

<style lang="stylus" scoped>
  .home
    .header
      width 40%
      text-align center
      margin 2% auto
</style>

