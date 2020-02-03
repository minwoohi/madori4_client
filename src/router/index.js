import Vue from 'vue'
import Login from '@/components/Login'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      component: {
        template: '<div>Not Found</div>'
      }
    }
  ]
})
