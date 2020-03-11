import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import axios from 'axios'
//配置请求
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"
Vue.prototype.$http = axios

// 导入基本全局样式
import './assets/css/base.css'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')