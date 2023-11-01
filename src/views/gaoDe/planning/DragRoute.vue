<template>
	<div class="main">
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
		plugins: ["AMap.DragRoute"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			let path: any = []
			path.push([116.303843, 39.983412])
			path.push([116.321354, 39.896436])
			path.push([116.407012, 39.992093])
			let route = new AMap.DragRoute(map, path, AMap.DrivingPolicy.LEAST_FEE) //构造拖拽导航类
			route.search() //查询导航路径并开启拖拽导航
		})
		.catch(e => {
			console.log(e)
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
		width: 250px;
		overflow: auto;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	.map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
