<template>
	<div class="main">
		<div class="btnList">
			<div id="panel"></div>
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
		plugins: ["AMap.Driving"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			const driving = new AMap.Driving({
				map: map,
				panel: "panel"
			})

			// 根据起终点经纬度规划驾车导航路线
			driving.search(
				new AMap.LngLat(116.379028, 39.865042),
				new AMap.LngLat(116.427281, 39.903719),
				function (status: string, result: any) {
					// result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
					if (status === "complete") {
						console.log(result)
					}
				}
			)
		})
		.catch(e => {
			console.log(e)
		})
}
</script>
<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100vh;
	display: flex;

	.btnList {
		width: 250px;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		overflow: auto;
	}

	.map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
