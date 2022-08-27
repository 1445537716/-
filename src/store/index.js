import Vue from 'vue'
import Vuex from 'vuex'
import {
    setItem,
    getItem
} from '@/utils/storage.js'

Vue.use(Vuex)
// state 管理组件数据，管理的数据是响应式的，当数据改变时驱动视图更新。
// mutations 更新数据，state中的数据只能使用mutations去改变数据（只能处理同步的场景）
// actions 处理异步场景，处理成功后把数据提交给mutations，进而更新state
// Devtools指的是浏览器的Vue插件调试工具，它可以监控到数据的所有变更操作。

export default new Vuex.Store({
    state: {
        //用户登录状态信息
        user: getItem('TOUTIAO_USER')
        // user: JSON.parse(window.localStorage.getItem('TOUTIAO_USER'))
        // user: null
    },
    mutations: {
        setUser(state, data) {
            state.user = data
            setItem('TOUTIAO_USER', state.user)
            // window.localStorage.setItem('TOUTIAO_USER', JSON.stringify(data))
        }
    }
})