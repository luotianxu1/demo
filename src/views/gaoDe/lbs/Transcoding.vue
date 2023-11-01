<template>
	<div class="main">
		<div class="btnList">
			<el-card class="box-card">
				<el-input v-model="input" placeholder="请输入地址">
					<template #prepend>地址</template>
				</el-input>
				<el-input v-model="lng">
					<template #prepend>经纬度</template>
				</el-input>
				<el-button type="primary" @click="getLng">转换</el-button>
			</el-card>
			<el-card class="box-card">
				<el-input v-model="input1" placeholder="请输入经纬度">
					<template #prepend>经纬度</template>
				</el-input>
				<el-input v-model="name">
					<template #prepend>地址</template>
				</el-input>
				<el-button type="primary" @click="getLocation">转换</el-button>
			</el-card>
		</div>
		<div class="map" id="container"></div>
	</div>
</template>
<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"

onMounted(() => {
	initMap()
})

let map: AMap.Map
let geocoder: any
let marker: AMap.Marker
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.Geocoder"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			marker = new AMap.Marker()
			geocoder = new AMap.Geocoder()
		})
		.catch(e => {
			console.log(e)
		})
}

const input = ref("")
const lng = ref("")
const getLng = () => {
	if (!input.value) return
	geocoder.getLocation(input.value, function (status: string, result: any) {
		if (status === "complete" && result.geocodes.length) {
			let lnglat = result.geocodes[0].location
			lng.value = lnglat

			marker.setPosition(lnglat)
			map.add(marker)
			map.setFitView([marker])
		}
	})
}

const input1 = ref("")
const name = ref("")
const getLocation = () => {
	let lnglat = input1.value.split(",")
	geocoder.getAddress(lnglat, function (status: string, result: any) {
		if (status === "complete" && result.regeocode) {
			name.value = result.regeocode.formattedAddress

			marker.setPosition(lnglat as any)
			map.add(marker)
			map.setFitView([marker])
		}
	})
}
</script>
<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100vh;

	.btnList {
		display: flex;
		width: 350px;
		padding: 5px;
		overflow: auto;
		flex-wrap: wrap;
		align-content: flex-start;

		.box-card {
			margin-bottom: 10px;
		}
	}

	.map {
		flex: 1;
	}
}
</style>
