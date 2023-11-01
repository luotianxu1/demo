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
let placeSearch: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.PlaceSearch"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			placeSearch = new AMap.PlaceSearch({
				type: "餐饮服务", // 兴趣点类别
				pageSize: 5, // 单页显示结果条数
				pageIndex: 1, // 页码
				city: "010", // 兴趣点城市
				citylimit: true, //是否强制限制在设置的城市内搜索
				map: map, // 展现结果的地图实例
				autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
			})

			const cpoint = [116.405467, 39.907761] //中心点坐标
			placeSearch.searchNearBy("", cpoint, 200, function (status: string, result: any) {
				if (status === "complete") {
					console.log(result)
				}
			})
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
