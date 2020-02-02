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
          <th scope="col">roomId (_id)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(room, index) in appliedRoomList" :key="room.roomId.memberId" @click="$router.push('/member/' + room.memberId)">
          <th scope="row">{{ index + 1}}</th>
          <td>
            <div v-if="room.place === 'Mirage'"> <img :src="arenaImage" width="100" height="100"/> </div>
            <div v-else-if="room.place === 'Crown Victoria'"> <img :src="kakaoImage" width="100" height="100"/> </div>
            <div v-else> <img :src="defaultImage" width="100" height="100"/> </div>
          </td>
          <td>{{room.roomId.title}}</td>
          <td>{{room.roomId.memberId}}</td>
          <td>{{room.roomId._id}}</td>
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
  name: 'ApplyRoom',
  props: ['memberId'],
  data () {
    return {
      roomId: '',
      requestMemberId: '',
      appliedRoomList: [],
      arenaImage: require('../assets/login/arena.jpg'),
      kakaoImage: require('../assets/login/kr/kakao_account_login_btn_large_wide.png'),
      defaultImage: require('../assets/login/logo.png')
    }
  },
  methods: {
    getAppliedRoomList (requestUrl) {
      axios.get(requestUrl).then((res) => {
        const resultObj = res.data
        console.log('result : ' + res)
        if (resultObj.statusCode === '200') {
          this.appliedRoomList = resultObj.resultItems
        } else {
          console.log('resultObj.statusCode != 200')
        }
      })
    }
  },
  mounted () {
    const APPLIED_ROOM_LIST_REQ_URL = Vue.prototype.$serverIp + '/myRequestInfo/' + this.$store.state.memberId //this.memberId
    console.log('url : ' + APPLIED_ROOM_LIST_REQ_URL)
    
    this.getAppliedRoomList(APPLIED_ROOM_LIST_REQ_URL)
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
