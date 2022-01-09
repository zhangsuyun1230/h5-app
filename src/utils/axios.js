import axios from 'axios';
import router from '@/router'
const service = axios.create({
  baseURL: `/st_api`,
  timeout: 10000,
  headers: {}
});

/**
 * @param {Error} error 
 * @returns Promise
 */
const err = (error) => {
  console.log(error.response)
  if (error.response.status === 500) {
    return Promise.reject(error.response.data.message);
  }
  return Promise.reject(error);
};

// 请求拦截器
service.interceptors.request.use((config) => {
  return config;
}, err);
// 响应拦截器
service.interceptors.response.use((response) => {
  // response 根据不同status 状态返回 对应不同的comfirm
  const res = response.data
  if (res.info === '未登录') {
    router.push('/login')
  }
  return res
}, err);

export default service


