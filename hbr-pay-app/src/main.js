import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import '@/plugins/amplify'
import '@/plugins/toast'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.config.productionTip = false

import router from './router'

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
