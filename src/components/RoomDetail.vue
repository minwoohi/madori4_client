<template>
  <div class="hello">
    <navi-bar></navi-bar>
    <img :src="room.kakaoImage" width="400" height="400"/>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">roomId</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{room.roomId}}</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">memberId</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{memberId}}</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">방제</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{room.title}}</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">날짜 regDate</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{room.regDate}}</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">등록일자</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{room.registDate}}</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">장소</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{room.region}}</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">가격</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{room.price}} 원</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">소개</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{room.intro}}</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">최소 나이</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{room.ageMin}} 세</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">최대 나이</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{room.ageMax}} 세</div>
    </div>
    <div class="row detailDiv">
      <div class="col-sm-4" style="background-color:lavender;">최대인원</div>
      <div class="col-sm-8" style="background-color:lavenderblush;">{{room.myRoomRequesterList.length}} / {{room.maxMemberNum}}  명</div>
    </div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item"  v-for="requester of room.myRoomRequesterList" :key="requester.memberId._id"
        @click="getRequestMemberInfo(requester.memberId._id, requester.requestStatus)">
          카카오아이디 : {{requester.memberId.kakaoId}}, 닉네임 : {{requester.memberId.nickName}}, 신청상태 : {{requester.requestStatus}}
        </li>
    </ul>
    <button class="btn btn-primary" :disabled="isDisabled" @click="applyRoom" > 가치 먹자고 연락하고 싶어 </button>
    <button @click="$router.push('/room/')" class="btn btn-primary"> 목록으로 돌아가기 </button>
    </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import NaviBar from './NaviBar'
import LoginVue from './Login.vue'


export default {
  name: 'RoomDetail',
  props: {
    memberId: String
  },
  data () {
    return {
      //isAppliedRoom: false,
      isDisabled: false,
      total: 0,
      room: {
        roomId: '',
        title: '',
        maxMemberNum: '',
        joinedMemberCount: 0,
        date: '',
        price: '',
        ageMax: '',
        ageMin: '',
        gender: '',
        region: '',
        intro: '',
        registDate: '',
        myRoomRequesterList: [],
        requestMemberId: '',
        arenaImage: require('../assets/login/arena.jpg'),
        kakaoImage: '',
        defaultImage: require('../assets/login/logo.png')
      }
    }
  },
  methods: {
    getRoomDetail (requestUrl) {
      const component = this

      axios.get(requestUrl).then((res) => {
        const resultObj = res.data

        if (resultObj.statusCode === '200') {
          const room = resultObj.resultItems
          this.room.roomId = room._id
          this.room.title = room.title
          this.room.date = room.date
          this.room.place = room.place
          this.room.maxMemberNum = room.maxMemberNum
          this.room.region = room.region
          this.room.regDate = Vue.prototype.moment(room.regDate).format('YY 년 MM 월 DD 일 hh시 mm분 a')
          this.room.registDate = Vue.prototype.moment(room.registDate).format('YYYY-MM-DD')
          this.room.ageMin = room.ageMin
          this.room.ageMax = room.ageMax
          this.room.gender = room.gender
          this.room.price = room.price
          this.room.intro = room.intro
          
          // added 190220
          this.$store.state.roomId = this.room.roomId
        } else {
          console.log('resultObj.statusCode != 200')
        }

        const MY_ROOM_REQUESTER_LIST = Vue.prototype.$serverIp + '/room/applyRoom/' + this.room.roomId
      
        axios.get(MY_ROOM_REQUESTER_LIST).then((res) => {
          const resultObj = res.data

          if (resultObj.statusCode === '200') {
            let myMemberId = this.$store.state.memberId
            let roomMemberId = this.memberId
            let myRoomRequesterListSize = resultObj.total

            this.room.myRoomRequesterList = resultObj.resultItems
            //this.total = resultObj.total
            this.room.myRoomRequesterList.forEach(function(requester, index, arr) {
              let requestMemberId = requester.memberId._id
              if (requestMemberId === myMemberId) {
                component.isDisabled = true
              }
            })
            this.isDisabled = this.isDisabled ||
              this.isOverMaxMemberCount(myRoomRequesterListSize, this.room.maxMemberNum) ||
              this.isMyRoom(myMemberId, roomMemberId) ||
              this.isOverMaxApplyCount(this.$store.state.maxApplyCount)
          }
        })
      })
    },
    getMemberDetail(requestMemberId) {
      this.room.requestMemberId = requestMemberId
      this.room.roomId = this.$store.state.roomId
      this.$router.push('/member/' + this.room.requestMemberId)
    },
    applyRoom() {
      const component = this
      const memberId = this.memberId
      
      const Swal = require('sweetalert2')
      const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        title: '방 신청하기',
        text: '이 친구랑 가치 놀고 싶어?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '응 같이 놀기 신청할래!',
        cancelButtonText: '아니, 다시 생각해봐야겠어',
        reverseButtons: false
      }).then((result) => {
        if (result.value) { //call accept request API
          const APPLY_ROOM_REQ_URL = Vue.prototype.$serverIp + '/room/applyRoom/'
          this.room.requestMemberId = this.$store.state.memberId
          this.room.roomId = this.$store.state.roomId

          axios.post(APPLY_ROOM_REQ_URL, this.room).then(res => {
            swalWithBootstrapButtons.fire({
              position: 'center',
              type: 'success',
              title: '가치놀기 신청이 완료되었습니다!',
              showConfirmButton: false,
              timer: 1500
            })
            component.$router.push('/room')
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) { // call reject request API
            swalWithBootstrapButtons.fire({
              position: 'center',
              type: 'error',
              title: '가치놀기 신청이 취소되었습니다!',
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
    },
    getRequestMemberInfo (memberId, requestStatus) {
      this.$store.state.requestStatus = requestStatus
      this.$store.state.isMyRoomRequestMember = false
      this.$router.push('/member/' + memberId)
    },
    getKakaoImage(requestUrl) {
      axios.get(requestUrl).then((res) => {
          if (res.data.resultItems.profileImage === undefined) {
            this.room.kakaoImage = res.data.resultItems.thumbnailImage
          } else {
            this.room.kakaoImage = res.data.resultItems.profileImage
          }
        })
    },
    isMyRoom(myMemberId, roomMemberId) {
      if (myMemberId === roomMemberId) {
        return true
      } else {
        return false
      }
    },
    isOverMaxApplyCount(maxApplyCount) {
      const MY_REQUEST_ROOM_LIST = Vue.prototype.$serverIp + '/myRequestInfo/' + this.$store.state.memberId
      let appliedRoomCount = 0

      axios.get(MY_REQUEST_ROOM_LIST).then((res) => {
        const resultObj = res.data

        if (resultObj.statusCode === '200') {
          appliedRoomCount = resultObj.total
        }
        if (maxApplyCount <= appliedRoomCount) {
          return true
        } else {
          return false
        }
      })
    },
    isOverMaxMemberCount(requesterListSize, maxMemberNum) {
      if (maxMemberNum <= requesterListSize) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    let maxApplyCount = this.$store.state.maxApplyCount
    this.isAppliedRoom = this.$store.state.isAppliedRoom
    const ROOM_DETAIL_REQUEST = Vue.prototype.$serverIp + '/room/' + this.memberId
    const MEMBER_DETAIL_REQUEST = Vue.prototype.$serverIp + '/member/' + this.memberId

    this.room.requestMemberId = this.$store.state.memberId
    this.room.roomId = this.$store.state.roomId
    
    this.getRoomDetail(ROOM_DETAIL_REQUEST)
    this.getKakaoImage(MEMBER_DETAIL_REQUEST)
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
.detailDiv {
  margin-bottom: 0.5px;
}
</style>
