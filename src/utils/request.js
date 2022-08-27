import axios from 'axios'
import store from '@/store'
import jsonbig from 'json-bigint'

const request = axios.create({
    baseURL: "http://toutiao.itheima.net/", //基础路径
    // transformResponse 允许自定义原始的响应数据（字符串）
    transformResponse: [function (data) {
        try {
            return jsonbig.parse(data)
        } catch (error) {
            return data;
        }
    }],
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    //config:本次请求的请求配置对象
    const {
        user
    } = store.state
    // console.log(user);
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});
export default request