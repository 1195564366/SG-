import axios from 'axios'
import { Message } from 'element-ui'
// import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  withCredentials: true
})

// request拦截器
service.interceptors.request.use(config => {
  const filterApi = config.url
  if (filterApi === '/user/captcha' || filterApi === '/user/login') {
    return config
  } else {
    if (getToken()) {
      config.headers.common['Authorization'] = getToken()
      return config
    } else {
      Message({
        message: '请重新登录',
        type: 'error',
        duration: 5 * 1000
      })
    }
  }
})

// respone拦截器
service.interceptors.response.use(
  response => {
    if (response.data.msg === '账号在别处登录') {
      localStorage.clear()
      Message({
        message: response.data.msg,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return response.data
  }
)

export default service
