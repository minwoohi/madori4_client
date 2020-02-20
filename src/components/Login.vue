/* template */
<template>
		<GmapMap ref="mapRef"
			class="vue-map"
			:center="{lat:37.6559567, lng:127.0627454}"
			:zoom="18"
			map-type-id="roadmap"
			style="width: 900px; height: 900px;"
		>
			<GmapMarker
			style="width: 1600px; height: 900px;"
				:key="p.key"
				v-for="(p) in placeList"
				:position="p.position"
				:clickable="true"
				:draggable="true"
				@click="placeDetail(p.key)"
				/>
		</GmapMap>
</template>

<script>
/* declaration */
import Vue from 'vue'
import axios from 'axios'

export default {
name: 'login',
props: {
},
data () {
	return { // use in property
		placeList: []
	}
},
mounted() {
	/*this.$refs.mapRef.$mapPromise.then((map) => {
		map.panTo({lat: 37.6559567, lng: 127.0627454})
		})*/
		const comp = this
		let PLACE_LIST_REQ = Vue.prototype.$serverIp + '/place'

    axios.get(PLACE_LIST_REQ).then((res) => {
			res.data.result.forEach(element => {
				let position = {}
				let marker = {}
				position.lat = element.location.coordinates[1]
				position.lng = element.location.coordinates[0]
				marker.position = position
				marker.key = element._id
				this.placeList.push(marker)
			})
    })
},
computed: {
},
methods: {
	placeDetail(key) {
		console.log('key : ' + key)
	}
},
created () {
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
