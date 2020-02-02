<template>
  <div class="main">
    <navi-bar></navi-bar>
    <form>
        <div class="form-group col-xs-6">
          <label for="title">제목</label>
          <input type="text" class="form-control" :disabled='isDisabled' v-model="myRoom.title" placeholder="제목 텍스트">
        </div>
        <div class="form-group col-xs-6">
          <label for="maxMemberNum">인원</label>
          <input type="number" class="form-control" :disabled='isDisabled' v-model="myRoom.maxMemberNum" placeholder="인원 숫자">
        </div>
        <div class="form-group col-xs-6">
          <label for="ageMin">최소 나이</label>
          <input type="number" class="form-control" :disabled='isDisabled' v-model="myRoom.ageMin" placeholder="최소 나이">
        </div>
        <div class="form-group col-xs-6">
          <label for="ageMax">최대 나이</label>
          <input type="number" class="form-control" :disabled='isDisabled' v-model="myRoom.ageMax" placeholder="최대 나이">
        </div>
      <div class="form-group col-xs-6">
        <label for="date">시간</label>
        <datetime type="datetime" :disabled='isDisabled' v-model="myRoom.regDate" use12-hour></datetime>
      </div>
      <div class="form-group col-xs-6">
        <label for="region">지역</label>
        <select v-model="myRoom.region" :disabled='isDisabled' class="form-control">
          <option value="0" selected>전체</option>
          <option value="10">강남</option>
          <option value="20">이태원</option>
          <option value="30">홍대</option>
          <option value="40">건대</option>
          <option value="50">대학로</option>
        </select>
      </div>
      <div class="form-group col-xs-6">
        <div class="form-group col-xs-6">
          <label for="price">가격</label>
          <input type="number" class="form-control" :disabled='isDisabled' v-model="myRoom.price" placeholder="가격">
        </div>
      </div>
      <div class="form-group col-xs-6">
        <label for="gender">성별</label>
        <select v-model="myRoom.gender" :disabled='isDisabled' class="form-control">
          <option value="0" selected>전체</option>
          <option value="10">남성</option>
          <option value="20">여성</option>
        </select>
      </div>
      <div class="form-group">
        <label for="intro">소개</label>
        <textarea class="form-control" v-model="myRoom.intro" :disabled='isDisabled' aria-label="With textarea">소개를 입력하세요...</textarea>
      </div>
      <ul class="list-group list-group-flush" v-if="myRoom.myRoomRequesterList.length > 0">
        <li class="list-group-item" v-for="requester of myRoom.myRoomRequesterList" :key="requester.memberId._id"
          @click="getRequestMemberInfo(requester.memberId._id, requester.requestStatus)">
          카카오아이디 : {{requester.memberId.kakaoId}}, 닉네임 : {{requester.memberId.nickName}} 신청상태 : {{requester.requestStatus}}
        </li>
      </ul>
          <button type="button" class="btn btn-primary" :disabled="isExist" @click="createMyRoom">방 만들기</button>
          <button type="button" class="btn btn-primary" :disabled="!isExist" @click="editMyRoom" >방 수정하기</button>
          <button type="button" class="btn btn-primary" :disabled="!isExist" @click="deleteMyRoom" >방 삭제하기</button>
    </form>
  </div>
</template>
<script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>

<script>
import Vue from 'vue'
import axios from 'axios'
import Datetime from 'vue-datetime'
import NaviBar from './NaviBar'
import 'vue-datetime/dist/vue-datetime.css'

Vue.use(Datetime)

export default {
  name: 'MyRoom',
  data () {
    return {
      isExist: false,
      isEditable: false,
      total: '0',
      myRoom: {
        memberId: '',
        title: '',
        maxMemberNum: '',
        regDate: '',
        price: '',
        ageMax: '',
        ageMin: '',
        gender: '',
        region: '',
        intro: '',
				openUrl: 'asd',
        myRoomRequesterList: []
      }
    }
  },
  computed:{
    isDisabled: function() {
    	return this.isEditable
    }
  },
  watch:{
  },
  mounted () {
		const component = this
    //let memberId = this.$store.state.memberId
    //this.getMyRoomInfo(memberId)
    //this.getRequesterList(memberId)
		let accessToken = this.$store.state.accessToken
		let code = this.$route.query.code
		let memberId = this.$store.state.memberId
		console.log('code : ' + code)
		console.log('memberId : ' + memberId)


		if (code != undefined) {
			let TOKEN_REQUEST = 'https://kauth.kakao.com/oauth/token'
			let payload = 'grant_type=authorization_code&client_id=50aefcaff7f2522cd11eee31a319bb37&redirect_uri=http://218.38.52.30:8082/myRoom&code=' + code

			axios.post(TOKEN_REQUEST, payload).then(res => {
				let status = res.status
				if(status === 200) {
					component.$store.state.accessToken = res.data.access_token
					component.$store.state.refreshToken = res.data.refresh_token
					component.$store.state.expiresIn = res.data.expires_in
				}
				console.log('this store access token : ' + this.$store.state.accessToken)
				console.log('this store refresh token : ' + this.$store.state.refreshToken)
				console.log('this store expires : ' + this.$store.state.expiresIn)
				component.setMemberInfo(this.$store.state.accessToken)
				component.getMyRoomInfo(this.$store.state.memberId)
		})
		} else {	// do nothing
			console.log('accessToken not ===')
			component.getMyRoomInfo(memberId)
		}
  },
  updated() {
    
  },
  methods: {
		setMemberInfo (accessToken) {
			let MEMBER_INFO_REQUEST = Vue.prototype.$serverIp + '/kakao/member/' + accessToken
      let GET_MEMBER_INFO_URI = Vue.prototype.$serverIp + '/member/'
      let GET_ROOM_INFO_URI = Vue.prototype.$serverIp + '/room/'
      const router = this.$router
      const member = {} 
      const component = this

			axios.get(MEMBER_INFO_REQUEST).then((res) => {
				console.log('res : ' + JSON.stringify(res))
      	const memberProperties = res.data.properties
        const memberKakaoAccount = res.data.kakao_account

        member['kakaoId'] = res.data.id
        member['nickName'] = memberProperties.nickname
        member['profileImage'] = memberProperties.profile_image
        member['thumbnailImag'] = memberProperties.thumbnail_image
        member['ageRange'] = memberKakaoAccount.has_age_range
        member['gender'] = memberKakaoAccount.has_gender
				console.log('kakaoId : ' + member.kakaoId)
				console.log('nickName : ' + member.nickName)

        component.removeNullMemberInfo(member)
        axios.post(GET_MEMBER_INFO_URI, member).then((res) => {
              //component.$store.state.roomId = res.data.roomId
          component.$store.state.memberId = res.data.memberId

          axios.get(GET_ROOM_INFO_URI + res.data.memberId).then((res) => {
            if(res.data.total === '0' ){

            } else {
              component.$store.state.roomId = res.data.resultItems._id
							component.getMyRoomInfo(component.$store.state.memberId)
            }
                
          })

        })
			})
		},
    getMyRoomInfo (memberId) {
      let GET_ROOM_INFO_URI = Vue.prototype.$serverIp + '/room/'
			console.log('getMyRoomInfo, memberId : ' + memberId)
      axios.get(GET_ROOM_INFO_URI + memberId).then((res) => {
        const total = res.data.total
        const resultObj = res.data.resultItems
        const statusCode = res.data.statusCode
        const statusMsg = res.data.statusMsg

        if (total > 0 && statusCode === '200' && resultObj !== undefined) {
          console.log('is total > 0 && statusCode === 200 && resultObj !== undefined ')
          this.isExist = true
          
          //this.$store.state.isEditable = true
          //this.$store.state.isExist = true
          this.total = res.data.total
          this.myRoom.statusCode = res.data.statusCode
          this.myRoom.title = resultObj.title
          this.myRoom.regDate = resultObj.regDate
          this.myRoom.maxMemberNum = resultObj.maxMemberNum
          this.myRoom.region = resultObj.region
          this.myRoom.ageMin = resultObj.ageMin
          this.myRoom.ageMax = resultObj.ageMax
          this.myRoom.gender = resultObj.gender
          this.myRoom.price = resultObj.price
          this.myRoom.intro = resultObj.intro
        } // if
      })
    },
    getRequesterList (memberId) {
      const MY_ROOM_REQUESTER_LIST = Vue.prototype.$serverIp + '/requestMemberInfo/' + memberId
    
      axios.get(MY_ROOM_REQUESTER_LIST).then((res) => {
        this.myRoom.myRoomRequesterList = res.data.resultItems
      })
    },
    enableEditMyRoom () {
      this.isEditable = true
      const memberId = this.$store.state.memberId
      
      const GET_MY_ROOM_INFO_URI = Vue.prototype.$serverIp + '/room/' + memberId

      axios.get(GET_MY_ROOM_INFO_URI).then((res) => {
        this.total = res.data.total
        if (this.total > 0) {
          this.$store.state.isExist = true
          this.isExist = true

          this.$store.state.isEditable = true
          this.isEditable = true
        } else {
          this.$store.state.isExist = false
          this.isExist = false
        }
      })
    },
    createMyRoom() {
      const component = this
      const socket = this.$socket
      const Swal = require('sweetalert2')

      const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        title: '방 만들기',
        text: '방을 만드시겠습니까?',
        type: 'question',
        showCancelButton: true,
        confirmButtonText: '응 방을 만들래!',
        cancelButtonText: '아니, 다시 생각해봐야겠어!',
        reverseButtons: false
      }).then((result) => {
        if (result.value) { //call accept request API
					let invalidatedField = this.invalidatedField()
					if (invalidatedField.length > 0) {
						this.validationPopup(invalidatedField)
						return
					}
          const CREATE_MY_ROOM_URI = Vue.prototype.$serverIp + '/room/'
					this.myRoom.memberId = this.$store.state.memberId

          axios.post(CREATE_MY_ROOM_URI, this.myRoom).then((res) => {
            if (res.data.statusCode === '200') {
							let roomId = res.data.roomId
							let nickName = this.$store.state.member.nickName
							this.$store.state.roomId = roomId
							
              swalWithBootstrapButtons.fire({
                position: 'center',
                type: 'success',
                title: '방 만들기가 완료되었습니다!',
                showConfirmButton: false,
                timer: 1500
              })
              component.$router.push('/room')
            } else {
              swalWithBootstrapButtons.fire({
                position: 'center',
                type: 'success',
                title: '방 만들기가 실패했습니다! 서버 에러라 관리자 확인이 필요합니다 ㅠ.ㅠ',
                showConfirmButton: false,
                timer: 1500
              })
              //component.$router.go(0)
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) { // call reject request API
           swalWithBootstrapButtons.fire({
              position: 'center',
              type: 'error',
              title: '방 만들기를 취소했습니다!',
              showConfirmButton: false,
              timer: 1500
            })
            component.$router.push('/myRoom')
          }
        })
    },
    editMyRoom() {
      const component = this

      const memberId = this.$store.state.memberId
      const EDIT_MY_ROOM_URI = Vue.prototype.$serverIp + '/room/' + memberId

      const Swal = require('sweetalert2')
      const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        title: '방 정보 수정하기',
        text: '방 정보 수정하시겠습니까?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '응 수정할래!',
        cancelButtonText: '아니, 다시 생각해봐야겠어!',
        reverseButtons: false
      }).then((result) => {
        if (result.value) { //call accept request API
					let invalidatedField = this.invalidatedField()
					if (invalidatedField.length > 0) {
						this.validationPopup(invalidatedField)
						return
					} 
          axios.put(EDIT_MY_ROOM_URI, this.myRoom).then((res) => {
            if (res.data.statusCode === '200') {
              swalWithBootstrapButtons.fire({
                position: 'center',
                type: 'success',
                title: '방 수정하기 성공했습니다!',
                showConfirmButton: false,
                timer: 1500
              })
              component.$router.push('/room')
            } else {
              swalWithBootstrapButtons.fire({
                  position: 'center',
                  type: 'error',
                  title: '방 수정하기 실패했습니다!',
                  showConfirmButton: false,
                  timer: 1500
              })
              component.$router.push('/myRoom')
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
           swalWithBootstrapButtons.fire(
                  '방 수정 취소!',
                  '방 수정 취소되었습니다!',
                  'error'
                )
          }
        })
    },
    deleteMyRoom() {
      const component = this
      const memberId = this.$store.state.memberId
      
      const Swal = require('sweetalert2')
      const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        title: '내가 만든 방 삭제하기',
        text: '방을 삭제하시겠습니까?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '응 삭제할래!',
        cancelButtonText: '아니, 다시 생각해봐야겠어!',
        reverseButtons: false
      }).then((result) => {
        if (result.value) { //call accept request API
					let roomId = component.$store.state.roomId 
					let nickName = component.$store.state.member.nickName 
					console.log('roomId : ' + roomId)
      
          const DELETE_MY_ROOM_URI = Vue.prototype.$serverIp + '/room/' + memberId

          axios.delete(DELETE_MY_ROOM_URI).then((res) => {
            if (res.data.statusCode === '200') {
              this.$socket.emit('LEAVE_ROOM', {
								roomId : roomId,
								nickName : nickName
							})
              swalWithBootstrapButtons.fire({
                  position: 'center',
                  type: 'success',
                  title: '방 삭제하기 성공했습니다!',
                  showConfirmButton: false,
                  timer: 1500
              })
							this.$store.state.roomId = '' 
              component.$router.push('/room')
              }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) { // call reject request API
           swalWithBootstrapButtons.fire({
                position: 'center',
                type: 'error',
                title: '방 삭제하기 취소했습니다!',
                showConfirmButton: false,
                timer: 1500
            })
            component.$router.push('/myRoom')
          }
        })
    },
    getRequestMemberInfo (memberId, requestStatus) {
      this.$store.state.requestStatus = requestStatus
      this.$store.state.isMyRoomRequestMember = true
      this.$router.push('/member/' + memberId)
    },
	  invalidatedField() {
			this.myRoom.openUrl = 'openUrl'
			let fieldName = ''
			if (!this.myRoom.title) {
				fieldName = '제목'
				console.log('myRoom.title is empty...')
			}	else if (!this.myRoom.maxMemberNum) {
				fieldName = '최대인원'
				console.log('myRoom.maxMemberNum is empty...')
			} else if (!this.myRoom.price) {
				fieldName = '가격'
				console.log('myRoom.price is empty...')
			} else if (!this.myRoom.ageMax) {
				fieldName = '최대나이'
				console.log('myRoom.title is empty...')
			} else if (!this.myRoom.ageMin) {
				fieldName = '최소나이'
				console.log('myRoom.title is empty...')
			} else if (!this.myRoom.gender) {
				fieldName = '성별'
				console.log('myRoom.title is empty...')
			} else if (!this.myRoom.region) {
				fieldName = '지역'
				console.log('region.title is empty...')
			} else if (!this.myRoom.intro) {
				fieldName = '소개'
				console.log('intro.title is empty...')
			} else if (!this.myRoom.regDate) {
				fieldName = '만나는 시간'
				console.log('intro.regDate is empty...')
			}
			return fieldName
		},
		validationPopup (fieldName) {
      const Swal = require('sweetalert2')
      const swalWithBootstrapButtons = Swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      })
      swalWithBootstrapButtons.fire({
        position: 'center',
        type: 'error',
        title: fieldName + '은(는) 필수 입력항목입니다.',
        showConfirmButton: false,
        timer: 1500
      })
		},
		removeNullMemberInfo(member){
      if(member.nickName === undefined ){
        member.nickName = ''
      }
      if(member.profileImage === undefined ){
        member.profileImage = ''
      }
      if(member.thumbnailImage === undefined ){
        member.thumbnailImage = ''
      }
      if(member.ageRange === false ){
        member.ageRange = 'unknown'
      }
      if(member.gender === false ){
        member.gender = 'unknown'
      }
		}
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
