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
let contextMenuPositon: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.MouseTool"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			//地图绑定鼠标右击事件——弹出右键菜单
			map.on("rightclick", function (e) {
				contextMenu.open(map, e.lnglat)
				contextMenuPositon = e.lnglat
			})

			//创建右键菜单
			const contextMenu = new AMap.ContextMenu()

			//右键放大
			contextMenu.addItem(
				"放大一级",
				function () {
					map.zoomIn()
				},
				0
			)

			//右键缩小
			contextMenu.addItem(
				"缩小一级",
				function () {
					map.zoomOut()
				},
				1
			)

			//右键显示全国范围
			contextMenu.addItem(
				"缩放至全国范围",
				function () {
					map.setZoomAndCenter(4, [108.946609, 34.262324])
				},
				2
			)

			//右键添加Marker标记
			contextMenu.addItem(
				"添加标记",
				function () {
					new AMap.Marker({
						map: map,
						position: contextMenuPositon //基点位置
					})
				},
				3
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

	.map {
		flex: 1;
	}
}
</style>
