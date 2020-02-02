<template>
  <div class="hello">
    <navi-bar></navi-bar>
    <table class="table table-striped table-dark">
      <thead>
        <tr>
          <th scope="col">No</th>
          <th scope="col">Main Image</th>
          <th scope="col">Title</th>
          <th scope="col">MemberId</th>
          <th scope="col">신청상태</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(room, index) in appliedRoomList" :key="room.roomId.memberId" @click="$router.push('/room/' + room.roomId.memberId)">
          <th scope="row">{{ index + 1}}</th>
          <td>
            <div v-if="room.place === 'Mirage'"> <img :src="arenaImage" width="100" height="100"/> </div>
            <div v-else-if="room.place === 'Crown Victoria'"> <img :src="kakaoImage" width="100" height="100"/> </div>
            <div v-else> <img :src="defaultImage" width="100" height="100"/> </div>
          </td>
          <td>{{room.roomId.title}}</td>
          <td>{{room.roomId.memberId}}</td>
          <td v-if="room.requestStatus == '10'">신청중</td>
          <td v-else-if="room.requestStatus == '20'">승인됨</td>
          <td v-else-if="room.requestStatus == '30'">거절당함</td>
          <td v-else>몰라</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import NaviBar from './NaviBar'

export default {
  name: 'ApplyRoomList',
  props: ['memberId'],
  data () {
    return {
      roomId: '',
      requestMemberId: '',
      appliedRoomList: [],
      requestStatus: '',
      arenaImage: require('../assets/login/arena.jpg'),
      kakaoImage: require('../assets/login/kr/kakao_account_login_btn_large_wide.png'),
      defaultImage: require('../assets/login/logo.png')
    }
  },
  methods: {
    getAppliedRoomList (requestUrl) {
      axios.get(requestUrl).then((res) => {
        const resultObj = res.data
        if (resultObj.statusCode === '200') {
          this.appliedRoomList = resultObj.resultItems
          console.log('resultList size :  ' + this.appliedRoomList.length)
        } else {
          
        }
      })
    }
  },
  mounted () {
    this.$store.state.isAppliedRoom = true
    const APPLIED_ROOM_LIST_REQ_URL = Vue.prototype.$serverIp + '/myRequestInfo/' + this.$store.state.memberId //this.memberId
    
    this.getAppliedRoomList(APPLIED_ROOM_LIST_REQ_URL)
  },
  computed: {
  
  },
  components: {
    'NaviBar': NaviBar
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
