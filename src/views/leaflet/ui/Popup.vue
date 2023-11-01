<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="close">关闭</el-button>
			<el-button type="primary" @click="toggle">切换</el-button>
			<el-button type="primary" @click="getLatLng">获取位置</el-button>
			<el-button type="primary" @click="setLatLng">设置位置</el-button>
			<el-button type="primary" @click="getContent">获取内容</el-button>
			<el-button type="primary" @click="setContent">设置内容</el-button>
			<el-button type="primary" @click="getElement">获取内容</el-button>
			<el-button type="primary" @click="update">更新</el-button>
			<el-button type="primary" @click="isOpen">是否打开</el-button>
			<el-button type="primary" @click="bringToFront">前置</el-button>
			<el-button type="primary" @click="bringToBack">后置</el-button>
			<el-button type="primary" @click="removeFrom">移除</el-button>
			<el-button type="primary" @click="bindTooltip">绑定Tooltip</el-button>
			<el-button type="primary" @click="unbindTooltip">解绑Tooltip</el-button>
			<el-button type="primary" @click="openTooltip">打开Tooltip</el-button>
			<el-button type="primary" @click="closeTooltip">关闭Tooltip</el-button>
			<el-button type="primary" @click="toggleTooltip">切换Tooltip</el-button>
			<el-button type="primary" @click="isTooltipOpen">是否打开Tooltip</el-button>
			<el-button type="primary" @click="setTooltipContent">设置Tooltip</el-button>
			<el-button type="primary" @click="getTooltip">获取Tooltip</el-button>
		</div>
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"

let map: L.Map | null = null
let popup: L.Popup | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)

	const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]
	map.setView(center_point, 3)

	popup = L.popup({
		offset: [0, 7], //弹出位置的偏移量。
		maxWidth: 300, //Popup 的最大宽度，以像素为单位。
		minWidth: 50, //Popup 的最小宽度，以像素为单位。
		maxHeight: 500, //设置后，如果其内容超过它，则在 Popup 内创建给定高度的可滚动容器。
		autoPan: true, //如果你不想让地图做平移动画，把它设置为 false，以适应打开的 Popup。
		autoPanPaddingTopLeft: [0, 0], //自动平移后，Popup 与地图左上角之间的边距。
		autoPanPaddingBottomRight: [0, 0], //自动平移后，Popup 与地图右下角之间的边距。
		autoPanPadding: [5, 5], //相当于将左上角和右下角自动平移填充设置为相同的值。
		keepInView: false, //如果您想防止用户在弹出窗口（popup）打开时将其移出屏幕，请将其设置为true。
		closeButton: true, //控制弹出窗口中是否有关闭按钮。
		autoClose: true, //如果您想重写在打开另一个弹出框时关闭弹出框的默认行为,请将其设置为 false。
		closeOnEscapeKey: true, //如果你想覆盖 ESC 键关闭弹出窗口 (popup) 的默认行为，将其设置为 false。
		className: "poup", //为弹出窗口（popup）设置自定义 CSS 类名称。
		interactive: true //如果为 true，popup/tooltip 将监听鼠标事件。
	})
		.setLatLng([50.5, 30.5])
		.setContent("<p>Hello world!<br />This is a nice popup.</p>")
		.openOn(map)

	// 当 overlay 的内容被更新时触发。
	popup.on("contentupdate", e => {
		console.log(e, "contentupdate")
	})
	// 当用户 click 或 tap 该图层时触发。
	popup.on("click", e => {
		console.log(e, "click")
	})
	// 当用户 double-click 或 double-tap 该图层时触发。
	popup.on("dblclick", e => {
		console.log(e, "dblclick")
	})
	// 当用户在该图层上按下鼠标按钮时触发。
	popup.on("mousedown", e => {
		console.log(e, "mousedown")
	})
	// 当用户在该图层上释放按下的鼠标按钮时触发。
	popup.on("mouseup", e => {
		console.log(e, "mouseup")
	})
	// 鼠标进入该图层时触发。
	popup.on("mouseover", e => {
		console.log(e, "mouseover")
	})
	// 当鼠标离开该图层时触发。
	popup.on("mouseout", e => {
		console.log(e, "mouseout")
	})
	// 当用户在图层上点击右键时触发，如果该事件有监听者，可以防止显示默认的浏览器上下文菜单。在手机上，当用户保持单次触摸一秒钟（也叫长按）时也会触发。
	popup.on("contextmenu", e => {
		console.log(e, "contextmenu")
	})
	popup.on("popupopen", e => {
		console.log(e, "popupopen")
	})
	popup.on("popupclose", e => {
		console.log(e, "popupclose")
	})
})
const close = () => {
	popup?.close()
}
const toggle = () => {
	popup?.toggle()
}
const setLatLng = () => {
	popup?.setLatLng([60.5, 40.5])
}
const getLatLng = () => {
	console.log(popup?.getLatLng())
}
const getContent = () => {
	console.log(popup?.getContent())
}
const setContent = () => {
	popup?.setContent("<div>123456<div/>")
}
const getElement = () => {
	console.log(popup?.getElement())
}
const update = () => {
	popup?.update()
}
const isOpen = () => {
	console.log(popup?.isOpen())
}
// 将此覆盖层置于其他覆盖层前面(在同一地图窗格中)。
const bringToFront = () => {
	popup?.bringToFront()
}
const bringToBack = () => {
	popup?.bringToBack()
}
const removeFrom = () => {
	popup?.remove()
}
// 将工具提示（tooltip）绑定到传入的图层 content 并设置必要的事件侦听器。如果一个 Function 被传递，它将接收图层作为第一个参数，并应返回 String 或 HTMLElement。
const bindTooltip = () => {
	popup?.bindTooltip("<div>789</div>")
}
// 移除之前用 bindTooltip 绑定的工具提示（tooltip）。
const unbindTooltip = () => {
	popup?.unbindTooltip()
}
// 在指定的 latlng 处打开绑定的工具提示（tooltip），如果没有指定 latlng，则在默认的锚点打开工具提示（tooltip）。
const openTooltip = () => {
	popup?.openTooltip()
}
// 如果该图层处于打开状态，则关闭绑定到该图层的工具提示。
const closeTooltip = () => {
	popup?.closeTooltip()
}
// 根据当前状态打开或关闭绑定到该图层的工具提示（tooltip）。
const toggleTooltip = () => {
	popup?.toggleTooltip()
}
// 如果该层绑定的工具提示（tooltip）当前已打开，则返回 true。
const isTooltipOpen = () => {
	console.log(popup?.isTooltipOpen())
}
// 设置绑定到该层的工具提示（tooltip）的内容。
const setTooltipContent = () => {
	popup?.setTooltipContent("<div>12356<div/>")
}
// 返回绑定到该层的工具提示（tooltip）。
const getTooltip = () => {
	console.log(popup?.getTooltip())
}
</script>
<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100%;

	.btnList {
		display: flex;
		width: 255px;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	#map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
