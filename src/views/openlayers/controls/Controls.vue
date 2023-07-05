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
import OverviewMap from "ol/control/OverviewMap"

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
		className: "ol-zoom-extent", // CSS 类名
		// target: '', // 如果您希望控件在地图视口之外呈现，请指定目标
		// label: "", // 用于按钮的文本标签
		// tipLabel: '', // 用于按钮提示的文本标签
		extent: [110, 30, 160, 30]
	})
	map.addControl(zoomToEctent)

	// 放大缩小控件
	const zoomSlider = new ZoomSlider({
		className: "ol-zoomslider", // CSS 类名
		duration: 200 // 动画持续时间
		// render: () => {}, // 当控件应该重新呈现时调用的函数
	})
	map.addControl(zoomSlider)

	// 全屏控件
	const fullScreen = new FullScreen({
		className: "ol-full-screen", // CSS 类名
		// label: "", // 用于按钮的文本标签
		// labelActive: '', // 全屏激活时用于按钮的文本标签
		// activeClassName: '', // 全屏活动时按钮的 CSS 类名称
		// inactiveClassName: '', // 全屏处于非活动状态时按钮的 CSS 类名称
		// tipLabel: '', // 用于按钮提示的文本标签
		keys: false // 全键盘访问
		// target: '', // 如果您希望控件在地图视口之外呈现，请指定目标
		// source: '' // 要全屏显示的元素。如果未提供，包含地图视口的元素将全屏显示
	})
	map.addControl(fullScreen)

	// 鼠标位置控件
	const mousePosition = new MousePosition({
		className: "ol-mouse-position", // CSS 类名
		// projection: "", // 投影。默认是视图投影。
		// render: () => {}, // 当控件应该重新呈现时调用的函数
		// target: '', // 如果您希望控件在地图视口之外呈现，请指定目标
		wrapX: true // 如果是全局投影，则将世界水平包裹在投影的反子午线上。
	})
	map.addControl(mousePosition)

	// 旋转控件
	const rotate = new Rotate({
		className: "ol-rotate", // CSS 类名
		// label: "", // 用于旋转按钮的文本标签
		// tipLabel: "", // 	用于旋转尖端的文本标签
		compassClassName: "ol-compass", // 指南针的 CSS 类名称
		duration: 250, // 动画持续时间
		autoHide: false // 当旋转为 0 时隐藏控件
		// render: () => {}, // 当控件应该重新呈现时调用的函数
		// resetNorth: () => {}, // 单击控件时调用的函数
		// target: '', // 如果您希望控件在地图视口之外呈现，请指定目标
	})
	map.addControl(rotate)

	// 比例尺控件
	const scaleLine = new ScaleLine({
		className: "ol-scale-line", // CSS 类名
		minWidth: 64, // 默认 dpi 下的最小宽度（以像素为单位）
		maxWidth: 150, // 默认 dpi 下的最大宽度（以像素为单位）
		// render: () => {}, // 当控件应该重新呈现时调用的函数
		// target: '', // 如果您希望控件在地图视口之外呈现，请指定目标
		units: "metric", // 单位 {'degrees'} {'imperial'} {'nautical'} {'metric'} {'us'}
		bar: false, // 渲染比例尺而不是线条
		steps: 4, // 比例尺应使用的步数。使用偶数可获得最佳结果
		text: false // 渲染比例尺上方的文本比例
	})
	map.addControl(scaleLine)

	// 鹰眼控件
	const overviewMap = new OverviewMap({
		className: "ol-overviewmap", //CSS 类名
		collapsed: false, // 控件是否应该开始折叠（展开）
		collapseLabel: "\u00BB", // 用于扩展概览图按钮的文本标签。
		collapsible: true, // 控件是否可以折叠
		label: "\u00AB", // 用于折叠概览图按钮的文本标签
		layers: [
			// 图层
			new Tile({
				source: new XYZ({
					url: "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=3bc6874f2b919aa581635abab7759a3f",
					wrapX: false
				})
			})
		],
		// 当控件应该重新呈现时调用的函数
		// render: () => {
		// 	console.log("鹰眼图更改了")
		// }
		rotateWithView: true, // 控制视图是否应随主地图视图旋转
		// target: "div" // 如果您希望控件在地图视口之外呈现，请指定目标
		tipLabel: "string" // 用于按钮提示的文本标签
	})
	map.addControl(overviewMap)
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

:deep(.ol-overviewmap) {
	bottom: 0;
	left: auto;
	right: 0;
	top: auto;
}

:deep(.ol-overviewmap-map .ol-overviewmap-box) {
	border: 2px solid red;
}
</style>
