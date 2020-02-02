import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export const store = new Vuex.Store({
  modules: {

  },
  strict: false,
  state: {
    memberId: '',
    member: {
      memberId: '',
      nickName: '',
      profileImage: '',
      ageRange: '',
      gender: ''
    },
		accessToken : '',
		refreshToken : '',
		expiresIn : ''
  },
  getters: {
    getRoomId: state => {
      return state.roomId
    },
    getMemberId: state => {
      return state.memberId
    },
    getMemberInfo: state => {
      return state.member
    },
    getIsAppliedRoom: state => {
      return state.isAppliedRoom
    },
    getIsExist: state => {
      return state.isExist
    },
    getIsEditable: state => {
      return state.isEditable
    },
    getChatRooms: state => {
      return state.chatRooms
    }
  },
  mutations: {
    setRoomId: function(state, payload) {
      state.roomId = payload
    },
    setMemberId: function(state, payload) {
      state.memberId = payload
    },
    setMemberInfo: function(state, payload) {
      state.member.memberId = payload.memberId
      state.member.nickName = payload.nickName
      state.member.profileImage = payload.profileImage
      state.member.thumbnailImage = payload.thumbnailImage
      state.member.ageRange = payload.ageRange
      state.member.gender = payload.gender
    },
    setIsAppliedRoom: function(state, payload) {
      state.isAppliedRoom = payload
    },
    setIsExist: function(state, payload) {
      state.isExist = payload
    },
    setIsEditable: function(state, payload) {
      state.isEditable = payload
    },
    setChatRooms: function(state, payload) {
      state.chatRooms[payload.roomKey] = payload.msg
    }
  }

})
