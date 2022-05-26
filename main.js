import Vue from 'vue'
import App from './App'

import user from './pages/user/home.vue'
Vue.component('user',user)

import home from './pages/home/index.vue'
Vue.component('home',home)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

 



