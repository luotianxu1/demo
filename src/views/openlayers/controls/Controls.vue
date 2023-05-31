<template>
	<div id="map"></div>
</template>

<script lang="ts" setup>
import Map from "ol/Map"
import Tile from "ol/layer/Tile" // 瓦片加载器
import XYZ from "ol/source/XYZ" // 引入XYZ地图格式
import View from "ol/View"
import ZoomToExtent from "ol/control/ZoomToExtent"
import ZoomSlider from "ol/control/ZoomSlider"
import FullScreen from "ol/control/FullScreen"
import MousePosition from "ol/control/MousePosition"
import Rotate from "ol/control/Rotate"
import ScaleLine from "ol/control/ScaleLine"

onMounted(() => {
	initMap()
})

let map

const initMap = () => {
	map = new Map({
		target: "map",
		layers: [
			new Tile({
				source: new XYZ({
					url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
				})
			})
		],
		view: new View({
			center: [113.300839, 23.048857], // 中心点坐标
			zoom: 10, // 缩放等级
			rotation: 0.1,
			projection: "EPSG:4326" // 坐标系
		})
	})

	// 视图跳转控件
	const zoomToEctent = new ZoomToExtent({
		extent: [110, 30, 160, 30]
	})
	map.addControl(zoomToEctent)

	// 放大缩小控件
	const zoomSlider = new ZoomSlider()
	map.addControl(zoomSlider)

	// 全屏控件
	const fullScreen = new FullScreen()
	map.addControl(fullScreen)

	// 鼠标位置控件
	const mousePosition = new MousePosition()
	map.addControl(mousePosition)

	// 旋转控件
	const rotate = new Rotate()
	map.addControl(rotate)

	// 比例尺控件
	const scaleLine = new ScaleLine()
	map.addControl(scaleLine)
}
</script>

<style lang="scss" scoped>
#map {
	width: 100vw;
	height: 100vh;
}

:deep(.ol-zoomslider) {
	top: 7.5rem;
}

:deep(.ol-mouse-position) {
	right: 45px;
}

:deep(.ol-rotate) {
	top: 2rem;
}
</style>
