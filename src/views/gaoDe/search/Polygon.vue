<template>
	<div class="main">
		<div class="btnList">
			<div id="result"></div>
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
				pageSize: 5, // 单页显示结果条数
				pageIndex: 1, // 页码
				city: "010", // 兴趣点城市
				citylimit: true, //是否强制限制在设置的城市内搜索
				map: map, // 展现结果的地图实例
				panel: "result", // 结果列表将在此容器中进行展示。
				autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
			})

			const polygonArr = [
				//多边形覆盖物节点坐标数组
				[116.403322, 39.920255],
				[116.410703, 39.897555],
				[116.402292, 39.892353],
				[116.389846, 39.891365]
			]
			const polygon = new AMap.Polygon({
				path: polygonArr, //设置多边形边界路径
				strokeColor: "#FF33FF", //线颜色
				strokeOpacity: 0.2, //线透明度
				strokeWeight: 3, //线宽
				fillColor: "#1791fc", //填充色
				fillOpacity: 0.35 //填充透明度
			})
			placeSearch.searchInBounds("酒店", polygon)
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
