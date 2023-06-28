<template>
	<div class="main">
		<div class="btnList">
			<el-input v-model="input" placeholder="请输入站点">
				<template #prepend>站点</template>
			</el-input>
			<el-button type="primary" @click="stationSearch">查询</el-button>
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
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.StationSearch"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})
		})
		.catch(e => {
			console.log(e)
		})
}

const input = ref("阜通")

let markers: AMap.Marker[] = []
/*公交站点查询*/
const stationSearch = () => {
	// 移除原有marker
	map.remove(markers)
	markers = []
	if (!input.value) return
	//实例化公交站点查询类
	let station = new (AMap as any).StationSearch({
		pageIndex: 1, //页码
		pageSize: 60, //单页显示结果条数
		city: "010" //确定搜索城市
	})
	station.search(input.value, function (status: string, result: any) {
		console.log(result)

		if (status === "complete" && result.info === "OK") {
			stationSearch_CallBack(result)
		}
	})
}

/*公交站点查询返回数据解析*/
const stationSearch_CallBack = (searchResult: any) => {
	let stationArr = searchResult.stationInfo
	let searchNum = stationArr.length
	if (searchNum > 0) {
		for (let i = 0; i < searchNum; i++) {
			let marker = new AMap.Marker({
				icon: new AMap.Icon({
					image: "//a.amap.com/jsapi_demos/static/resource/img/pin.png",
					size: new AMap.Size(32, 32),
					imageSize: new AMap.Size(32, 32)
				}),
				offset: new AMap.Pixel(-16, -32),
				position: stationArr[i].location,
				map: map,
				title: stationArr[i].name,
				label: {
					content: stationArr[i].name,
					offset: new AMap.Pixel(-13, -30),
					direction: "right"
				}
			})
			markers.push(marker)
		}
		map.setFitView()
	}
}
</script>
<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100vh;
	display: flex;

	.btnList {
		width: 200px;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		overflow: auto;
		padding: 5px;
	}

	.map {
		flex: 1;
	}
}
</style>
