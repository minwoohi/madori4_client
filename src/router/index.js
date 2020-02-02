import Vue from 'vue'
import Login from '@/components/Login'
import MyRoom from '@/components/MyRoom'
import RoomList from '@/components/RoomList'
import RoomDetail from '@/components/RoomDetail'
import ApplyRoomList from '@/components/ApplyRoomList'
import MemberDetail from '@/components/MemberDetail'
import ChatRoomList from '@/components/ChatRoomList'
//import ChatRoomDetail from '@/components/ChatRoomDetail'
import ChatRoomDetail_ from '@/components/ChatRoomDetail_'
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
      path: '/myRoom/',
      name: 'MyRoom',
      component: MyRoom
    },
    {
      path: '/room/:memberId',
      name: 'RoomDetail',
      component: RoomDetail,
      props: true
    },
    {
      path: '/room/',
      name: 'RoomList',
      component: RoomList
    },
    {
        path: '/applyRoom/:memberId',
        name: 'ApplyRoomList',
        component: ApplyRoomList,
        props: true
    },
    {
      path: '/member/:requestMemberId',
      name: 'MemberDetail',
      component: MemberDetail,
      props: true
    },
    {
      path: '/chatRoom/',
      name: 'ChatRoomDetail_',
      component: ChatRoomDetail_,
      props: true
    },
		/*
    {
      path: '/chatRoom/',
      name: 'ChatRoomList',
      component: ChatRoomList,
      props: false
    },
    {
      path: '/chatRoom/:roomId',
      name: 'ChatRoomDetail',
      component: ChatRoomDetail,
      props: true
    },
		*/
    {
      path: '*',
      component: {
        template: '<div>Not Found</div>'
      }
    }
  ]
})
