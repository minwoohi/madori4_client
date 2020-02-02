<template>
  <div class="naviBar">
    <!-- <nav class="navbar navbar-expand-sm fixed-top navbar-light bg-light">
       <div class="collapse navbar-collapse" id="navbarSupportedContent"> 
        <ul class="navbar-nav mr-auto">
          <li>
            <router-link to="/myRoom">방만들기 및 방 수정하기</router-link>
          </li>
          <li>
            <router-link to="/room">방목록 보기</router-link>
          </li>
           <li>
            <router-link :to="'/applyRoom/' + naviMemberId">내가 신청한 방보기 setMember 정보로</router-link>
          </li>
          <li>
            <input type="text" class="form-control" v-model="naviMemberId">
          </li>
          <li>
            <button type="button" class="btn btn-primary" @click="setMemberId">Set MemberId</button>
          </li>
          <li>
            현재 memberId : {{memberIdText}}
          </li>
          <li>
            <router-link :to="'/applyRoom/' + storedMemberId">내가 신청한 방보기 내 member 정보로</router-link>
          </li> 
          <li>
            <router-link :to="'/chatRoom/'">채팅방 목록</router-link>
          </li>
        </ul>
      </div> 
    </nav> -->
    <nav class="navbar navbar-dark bg-dark">
      <div class="btn-group">
  <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Menu List
  </button>
  <div class="dropdown-menu">
    <li>
      <router-link to="/myRoom">방만들기 및 방 수정하기</router-link>
    </li>
    <li>
      <router-link to="/room">방목록 보기</router-link>
    </li>
      <li>
      <router-link :to="'/applyRoom/' + naviMemberId">내가 신청한 방보기 setMember 정보로</router-link>
    </li>
    <li>
      <input type="text" class="form-control" v-model="naviMemberId">
    </li>
    <li>
      <button type="button" class="btn btn-primary" @click="showIds">Show Ids</button>
    </li>
    <li>
      <router-link :to="'/applyRoom/' + storedMemberId">내가 신청한 방보기 내 member 정보로</router-link>
    </li>
    <li>
      <router-link :to="'/chatRoom/'">채팅방 목록</router-link>
    </li>
  </div>
</div>
<div class="btn-group">
  <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Setting
  </button>
  <div class="dropdown-menu">
      <router-link class="dropdown-item" :to="'/'">Login</router-link>
      <a class="dropdown-item" @click="logout" href="#">Logout</a>
  </div>
</div>
    </nav>
  </div>
</template>

<script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>

<script>
import Vue from 'vue'
import axios from 'axios'

Vue.component('navi-bar', {
  // 옵션
})

export default {
  name: 'NaviBar',
  data () {
    return {
        keyword: '',
        naviMemberId: '', // for test
        memberIdText: '',  // get memberId text for test
        storedMemberId: '',
        roomId: '',
      }
    },
  mounted() {
    this.storedMemberId = this.$store.state.memberId
    this.roomId = this.$store.state.roomId
  },
  methods: {
		showIds() {
    	let memberId = this.$store.state.memberId
    	let roomId = this.$store.state.roomId
    	let accessToken = this.$store.state.accessToken
			console.log('memberId : ' + memberId)
			console.log('roomId : ' + roomId)
			console.log('accessToken : ' + accessToken)
		},
    logout () {
      const router = this.$router
			let accessToken = this.$store.state.access_token
			let LOGOUT_REQUEST = Vue.prototype.$serverIp + '/logout/' + accessToken
			axios.get(LOGOUT_REQUEST).then((res) => {
				const jsonObj = res
				alert('jsonObj : ' + JSON.stringify(jsonObj))
				this.$store.state.access_token = ''
				this.$store.state.refresh_token = ''
				router.push('/')
			})

			/*const LOGOUT_REQUEST = 'https://kapi.kakao.com/v1/user/logout'
			let access_token = this.$store.state.access_token
			console.log('access_token : ' + access_token)
			const config = {
				headers :{
						'Authorization' : 'Bearer ' + access_token,
					  'Access-Control-Allow-Origin' : '*',
  					'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
					 	'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept',
					  'Access-Control-Allow-Credentials' : true
				}
			}
			console.log('config : ' + JSON.stringify(config))

			axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token
			axios.post(LOGOUT_REQUEST).then(res => {
				//console.log('res : ' + JSON.stringify(res))
				alert('res : ' + JSON.stringify(res))
        router.push('/')
			})*/
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
