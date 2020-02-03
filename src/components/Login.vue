/* template */
<template>
  <div id="login">
  	<div> <img :src="entryPicture" width="350" height="350"/> </div>
 	<div style= "padding:20px">
 		<font color="blue"> <h1> {{ greeting }} </h1></font>
 		
 		<component1></component1>

 		<font color="black"> <h3> {{ datenow }} </h3></font>
    </div>
    <div id="kakao-login-btn" v-on:click=kakaoLogin >
       <img :src="kakaotalkPicture" width="350" height="50"/>
    </div>
  </div>
</template>

/* load script section */

<script>
/* declaration */
import Vue from 'vue'
import axios from 'axios'

Vue.component('component1', { template: 
	'<div> <font color="red"> <h2>  GNJ </h2></font> </div>'
})

export default {
  name: 'login',
  props: {
  	/* type definition */
  	apiKey: {
  		type: String,
  		default() { return 'caa85b46dd147a3ad2e040c4f37189dd' }
  	},
  	greeting : {
  		type: String,
  		default() { return '가치먹자' }
  	},
  	datenow : {
  		type: String,
  		default() { return '2019-05-06' }
  	}
  },
  data () {
  	return { // use in property
  		entryPicture: require('../assets/login/logo.png'),
      kakaotalkPicture: require('../assets/login/kr/kakao_account_login_btn_large_wide.png'),
      member: {
        kakaoId: '', 
        nickName: '',
        profileImage: '',
        thunbnailImage: '',
        ageRange: '',
        gender: ''
      }
  	}
  },
  computed: {
    year: function() {
      return (new Date()).getUTCFullYear()
    }
  },
  methods: {
    startClock () {
      var self = this
      //this.datenow = moment().format()
      setInterval(self.time, 1000)
    },
    kakaoLogin() {
    },
    onSuccess(authObj) {
        const router = this.$router
        const member = this.member
        const component = this
    },
    removeNullMemberInfo(member) {
      if (member.nickName === undefined) {
        member.nickName = ''
      }
      if (member.profileImage === undefined) {
        member.profileImage = ''
      }
      if (member.thumbnailImage === undefined) {
        member.thumbnailImage = ''
      }
      if (member.ageRange === false) {
        member.ageRange = 'unknown'
      }
      if (member.gender === false) {
        member.gender = 'unknown'
      }
    },
    onFailure(err) {
      console.log('onFailure. err : ' + err)
    },
    sendToServer() {
      console.log('sendDataToServer')
    }
  },
  created () {
  	this.startClock()
  },
  mounted () {
  },
  components: {}
}
</script>

/* css */
<style>
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
