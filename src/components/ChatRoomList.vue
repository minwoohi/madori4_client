<template>
  <div class="hello">
    <navi-bar></navi-bar>
    <table class="table table-striped table-dark">
      <thead>
        <tr>
          <th scope="col">title</th>
          <th scope="col">roomId</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isExistMyRoom" @click="$router.push('/chatRoom/' + roomId)">
					<td v-if="isExistMyRoom"> 나의 방 </td>
					<td v-if="isExistMyRoom"> {{roomId}} </td>
        </tr>
        <tr v-for="(chatRoom) in chatRoomList" :key="chatRoom.roomId._id" @click="$router.push('/chatRoom/' + chatRoom.roomId._id)">
          <td v-if="chatRoom.requestStatus == 20">{{chatRoom.roomId.title}}</td>
          <td v-if="chatRoom.requestStatus == 20">{{chatRoom.roomId._id}}</td>
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
  name: 'ChatRoomList',
  data () {
    return {
			isExistMyRoom: false,
			roomId: '',
    	chatRoomList: []
    }
  },
  methods: {
    getChatRoomList (requestUrl) {
      axios.get(requestUrl).then((res) => {
        const resultObj = res.data
        this.chatRoomList = resultObj.resultItems
        this.total = resultObj.total
      })
    }
  },
  mounted () {
		let memberId = this.$store.state.memberId
		this.roomId = this.$store.state.roomId
		const data = ''
		const socket = this.$socket
		const CHAT_ROOM_LIST_REQUEST = Vue.prototype.$serverIp + '/myRequestInfo/' + memberId
		this.getChatRoomList(CHAT_ROOM_LIST_REQUEST)
		if (this.roomId.length > 0) {
			this.isExistMyRoom = true
		}
		//if (myChatRoom.length > 0) {
			
		//}
		/*socket.emit('GET_ROOM_LIST', data, (roomList) => {
			let roomListArr = Object.values(roomList)
			this.roomList = roomListArr
			console.log('roomList : ' + roomList)
			console.log('roomListArr size : ' + roomListArr.length)
			roomListArr.forEach(function(room, index, arr) {
				console.log('value : ' + Object.values(room))
				console.log('index : ' + index)
				console.log('arr : ' + arr)
			})
		})*/
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
