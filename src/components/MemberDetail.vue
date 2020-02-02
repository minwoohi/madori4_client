<template>
  <div class="hello">
    <navi-bar></navi-bar>
    <modals-container />
    <img :src="member.profileImage" width="400" height="400"/>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">memberID</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{requestMemberId}}</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">카카오 id</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{member.kakaoId}}</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">닉네임</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{member.nickName}}</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">프로필 이미지</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{member.profileImage}}</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">연령대</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{member.ageRange}}</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">성별</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{member.gender}}</div>
    </div>
    <div>
      <button v-if="isMyRoomRequestMember" @click="callAcceptModal" class="btn btn-primary" >가치 먹을지 말지 결정하기</button>
      <button @click="$router.go(-1)" class="btn btn-primary"  > 뒤로 가기 </button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import NaviBar from './NaviBar'
import LoginVue from './Login.vue'


export default {
  name: 'MemberDetail',
  props: {
    requestMemberId: String
  },
  data () {
    return {
      member: {
        roomId: '',
        kakaoId: '',
        nickName: '',
        profileImage: '',
        thumbnailImage: '',
        ageRange: '',
        gender: ''
      },
      requestStatus: '',
      isMyRoomRequestMember: false
    }
  },
  methods: {
    callAcceptModal() {
      const component = this
      const Swal = require('sweetalert2')
			const socket = this.$socket
			let roomId = this.$store.state.roomId
			let nickName = this.member.nickName
			let msg = ''

      const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        title: '가치 놀기 승인, 거부',
        text: '이 친구랑 가치 놀래?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '응 같이 놀래!',
        cancelButtonText: '미안하지만 너랑 놀기 좀 그래!',
        reverseButtons: false
      }).then((result) => {
        if (result.value) { //call accept request API
          const APPLY_ROOM_REQ_URL = Vue.prototype.$serverIp + '/room/applyRoom/status'
          this.member.roomId = this.$store.state.roomId// apply room id
          this.member.requestMemberId = this.requestMemberId//  request member id
          this.member.requestStatus = '20'//  apply code

          axios.put(APPLY_ROOM_REQ_URL, this.member).then(res => {
          	swalWithBootstrapButtons.fire(							
                '가치놀기 승인!',								
                '가치놀기 신청이 승인되었습니다 =)',
                'success'
              )
            component.$router.push('/room') 
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) { // call reject request API
            const APPLY_ROOM_REQ_URL = Vue.prototype.$serverIp + '/room/applyRoom/status'
            this.member.roomId = this.$store.state.roomId// apply room id
            this.member.requestMemberId = this.requestMemberId//  request member id
            this.member.requestStatus = '30'// apply code

            axios.put(APPLY_ROOM_REQ_URL, this.member).then(res => {
              swalWithBootstrapButtons.fire(
                  '가치놀기 거절!',
                  '가치놀기 신청이 거절되었습니다 ㅠ.ㅠ',
                  'error'
                )
            })
            component.$router.push('/room')
          }
        })
      }
  },
  created () {
    /*const ROOM_DETAIL_REQUEST = Vue.prototype.$serverIp + '/member/' + this.requestMemberId
    axios.get(ROOM_DETAIL_REQUEST).then((res) => {
      this.member = res.data.resultItems
    })
    this.member.requestStatus = this.$store.state.requestStatus
    this.isMyRoomRequestMember = this.$store.state.isMyRoomRequestMember*/
  },
  mounted () {
    const ROOM_DETAIL_REQUEST = Vue.prototype.$serverIp + '/member/' + this.requestMemberId
    axios.get(ROOM_DETAIL_REQUEST).then((res) => {
      this.member = res.data.resultItems
    })
    this.requestStatus = this.$store.state.requestStatus

    this.isMyRoomRequestMember = this.$store.state.isMyRoomRequestMember
  },
  components: {
    'NaviBar': NaviBar
    //'AcceptApplyModal': AcceptApplyModal
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
.detailDiv {
  margin-bottom: 0.5px;
}
</style>
