<template>
	<div class="main">
		<div class="btnList">
			<el-input v-model="location" @change="getArriveRange"> <template #prepend>出发位置</template></el-input>
			<el-slider v-model="time" :marks="marks" :max="45" @change="getArriveRange" />
			<el-select v-model="type" value-key="id" placeholder="Select" @change="getArriveRange">
				<el-option key="1" label="地铁+公交" value="SUBWAY,BUS" />
				<el-option key="2" label="地铁" value="SUBWAY" />
				<el-option key="3" label="公交" value="BUS" />
			</el-select>
			<el-button type="primary" @click="getArriveRange">查询</el-button>
		</div>
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"

onMounted(() => {
	initMap()
})

let map: any
let aMap: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.ArrivalRange"]
	})
		.then(AMap => {
			aMap = AMap
			map = new AMap.Map("map", {
				resizeEnable: true,
				zoom: 13 //地图显示的缩放级别
			})

			map.on("click", getLnglat)

			getArriveRange()
		})
		.catch(e => {
			console.log(e)
		})
}

const location = ref("116.381865,39.920247")
const time = ref(20)
const marks = reactive({
	1: "1",
	15: "15",
	30: "30",
	45: "45"
})
const type = ref("SUBWAY,BUS")
let arrivalRange: any
let polygons: AMap.Polygon[] = []

const getLnglat = (e: any) => {
	location.value = e.lnglat.toString()
	getArriveRange()
}

//添加多边形覆盖物
function getArriveRange() {
	if (!arrivalRange) {
		arrivalRange = new aMap.ArrivalRange()
	}
	let lnglat = location.value.split(",")
	addCenterMarker(lnglat)
	arrivalRange.search(
		lnglat,
		time.value,
		function (status: string, result: any) {
			map.remove(polygons)
			polygons = []
			if (result.bounds) {
				for (let i = 0; i < result.bounds.length; i++) {
					let polygon = new aMap.Polygon({
						fillColor: "#3366FF",
						fillOpacity: "0.4",
						strokeColor: "#00FF00",
						strokeOpacity: "0.5",
						strokeWeight: 1
					})
					polygon.setPath(result.bounds[i])
					polygons.push(polygon)
				}
				map.add(polygons)
				map.setFitView()
			}
		},
		{
			policy: type.value
		}
	)
}

let centerMarker: AMap.Marker
const addCenterMarker = (position: any) => {
	if (!centerMarker) {
		centerMarker = new aMap.Marker({
			map: map,
			position: position
		})
	} else {
		centerMarker.setPosition(position)
	}
}
</script>

<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100vh;

	.btnList {
		display: flex;
		width: 300px;
		padding: 5px;
		padding: 20px;
		overflow: auto;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	.map {
		flex: 1;
	}
}
</style>
