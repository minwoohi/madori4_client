<template>
  <div>
	<navi-bar></navi-bar>
    <h1>채팅방</h1>
    <tr v-for="(msg, index) in messages" :key="index">
      <td>{{msg.msg}}</td>
    </tr>
    <div>
      <input type="text" @keyup.enter="saveChatting()" v-model="chatBox">
    </div>
    <button type="button" class="btn btn-primary" @click="saveChatting()">전송</button>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapMutations, mapState } from 'vuex'
import NaviBar from './NaviBar'

export default {
  name: 'ChatRoom',
  props: {
    roomId: String
  },
  data() {
    return {
      messages: [],
      chatBox: ''
    }
  },
	mounted() {
		const socket = this.$socket
		const component = this
		let roomId = this.roomId
		let nickName = this.$store.state.member.nickName
		const memberId = this.$store.state.memberId
		const roomKey = 'chatRoom_' + this.roomId
		const chatRoomObj = this.$store.state.chatRooms
		// for undefined exception. if there are no messages yet, messages array initialized by []
		this.messages = chatRoomObj[roomKey]
		if (this.messages === undefined) {
			this.messages = []
		}

		this.$socket.on('BROADCAST_MESSAGE', (data) => {
			//this.messages = data
			component.writeMessage('broadcast', data.nickName, data.message)
		})
		},
		created() {
			const socket = this.$socket
			const component = this
			let roomId = this.roomId
			let nickName = this.$store.state.member.nickName

			this.$socket.emit('JOIN_ROOM', {
				roomId : this.roomId,
				nickName : nickName
			})
			//this.messages = this.$localStorage.get('messages_' + roomId)
  },
  methods: {
    sendMessage() {
      const socket = this.$socket
      let msg = this.chatBox
      let roomId = this.roomId
			let nickName = this.$store.state.member.nickName
      socket.emit('SEND_MESSAGE', {
          nickName : nickName,
					roomId : roomId,
          message : msg
        })
      this.writeMessage('me', '나', msg)
      this.chatBox = ''
    },
    writeMessage(type, name, message) {
      let printName = ''
      if (type === 'system') {
        // do nothing
      } else {
        printName = name + ' : '
      }
      this.messages.push({
        msg : printName + message
      })
    },
    saveChatting() {
			this.sendMessage()
			const memberId = this.$store.state.memberId
			const arr = this.messages
			const roomKey = 'chatRoom_' + this.roomId
			let jsonObj = {roomKey : roomKey, msg: arr}
			this.$store.commit('setChatRooms', jsonObj)
			//this.$localStorage.set(roomKey, arr)
    }
  },
	components: {
		'NaviBar' : NaviBar
	}
}
</script>

<style>
.msg-form {
  bottom: -28px;
  position: absolute;
  left: 0;
  right: 0;
}
.msg-list {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 60px;
  overflow-x: scroll;
}
</style>
