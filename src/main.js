	// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { store } from './store'
import moment from 'moment'
import './plugins/socketPlugin'
import Directives from './plugins/directives'
import io from 'socket.io-client'
import VueLocalStorage from 'vue-localstorage'
 

//const socket = io('http://218.38.52.30:3030')

Vue.use(Directives)

Vue.config.productionTip = false

Vue.use(VueLocalStorage)


/* eslint-disable no-new */


//Vue.use(Chat)
Vue.prototype.$serverIp = 'http://218.38.52.30:3030'
Vue.prototype.$accountName = 'madori'
Vue.prototype.moment = moment
//Vue.prototype.$socket = socket

new Vue({
  components: { App },
  template: '<App/>',
  store,
  render: h => h(App),
  router
}).$mount('#app')
