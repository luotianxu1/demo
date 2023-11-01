<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="getLatLng">获取位置</el-button>
			<el-button type="primary" @click="setLatLng">设置位置</el-button>
			<el-button type="primary" @click="setZIndexOffset">设置zindex</el-button>
			<el-button type="primary" @click="getIcon">获取图标</el-button>
			<el-button type="primary" @click="setIcon">设置图标</el-button>
			<el-button type="primary" @click="setOpacity">设置透明度</el-button>
			<el-button type="primary" @click="toGeoJSON">GeoJSON</el-button>
			<el-button type="primary" @click="removeFrom">移除</el-button>
			<el-button type="primary" @click="bindPopup">绑定Popup</el-button>
			<el-button type="primary" @click="unbindPopup">移除Popup</el-button>
			<el-button type="primary" @click="openPopup">打开Popup</el-button>
			<el-button type="primary" @click="closePopup">关闭Popup</el-button>
			<el-button type="primary" @click="togglePopup">切换Popup</el-button>
			<el-button type="primary" @click="isPopupOpen">是否打开Popup</el-button>
			<el-button type="primary" @click="setPopupContent">设置Popup内容</el-button>
			<el-button type="primary" @click="getPopup">获取Popup内容</el-button>
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
let marker: L.Marker | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]
	map.setView(center_point, 3)

	marker = L.marker([50.5, 30.5], {
		keyboard: true, //是否可以用键盘标记并按回车键进行点击。
		title: "marker", //悬停在标记（marker）上时出现的浏览器 tooltip 提示文本内容（默认情况下没有 tooltip 提示）。
		alt: "marker", //Icon图标的 alt 属性提示文本内容。
		zIndexOffset: 0, //默认情况下，标记（marker）图像 zIndex 是根据其纬度自动设置的。如果您想将标记置于所有其他标记（marker）之上(或之下)，则使用此选项指定一个高值，如 1000(或高的负值)。
		opacity: 1.0, //标记（marker）的不透明度。
		riseOnHover: false, //如果为 true，当你把鼠标悬停在它上面时，该标记（marker）会在其他标记之上。
		riseOffset: 250, //用于 riseOnHover 功能的 z-index 偏移。
		pane: "markerPane", //Map pane 将添加标记图标的位置。
		shadowPane: "shadowPane", //Map pane 将添加标记阴影的位置。
		bubblingMouseEvents: false, //当为 true 时，此标记上的鼠标事件将触发地图上的相同事件(除非使用 L.DomEvent.stopPropagation）。
		autoPanOnFocus: false, //当为true时，每当标记被聚焦时(通过按键盘上的tab键)，地图就会移动，以确保标记在地图的边界内可见
		draggable: true, //标记（marker）是否可通过鼠标/触摸拖动。
		autoPan: false, //将此标记（marker）拖动到其边缘附近时是否平移地图。
		autoPanPadding: [50, 50], //开始平移地图时距离边缘的距离（左/右和上/下，以像素为单位）。
		autoPanSpeed: 10, //地图应该平移的像素数。
		interactive: true //如果为 false，该图层将不会触发鼠标事件，并作为底层地图的一部分。
	})
	map.addLayer(marker)

	// 当用户开始拖动标记时触发。
	marker.on("dragstart", e => {
		console.log(e, "dragstart")
	})
	// 当标记物开始移动（因为拖动）时触发。
	marker.on("movestart", e => {
		console.log(e, "movestart")
	})
	// 当用户拖动标记时重复触发。
	marker.on("drag", e => {
		console.log(e, "drag")
	})
	//当用户停止拖动标记时触发。
	marker.on("dragend", e => {
		console.log(e, "dragend")
	})
	// 当标记物停止移动（因为拖动）时启动。
	marker.on("moveend", e => {
		console.log(e, "moveend")
	})
	// 当用户 click（或 tap）图层时触发。
	marker.on("click", e => {
		console.log(e, "click")
	})
	// 当用户 double-click（或 double-tap）图层时触发。
	marker.on("dblclick", e => {
		console.log(e, "dblclick")
	})
	// 当用户在图层上按下鼠标按钮时触发。
	marker.on("mousedown", e => {
		console.log(e, "mousedown")
	})
	// 当用户释放在图层上按下的鼠标按钮时触发。
	marker.on("mouseup", e => {
		console.log(e, "mouseup")
	})
	// 当鼠标进入图层时触发。
	marker.on("mouseover", e => {
		console.log(e, "mouseover")
	})
	// 当鼠标离开图层时触发。
	marker.on("mouseout", e => {
		console.log(e, "mouseout")
	})
	// 当用户在图层上点击右键时触发，如果此事件有监听者，则阻止默认的浏览器上下文菜单显示。在移动设备上，当用户长按时，也会在手机上触发。
	marker.on("contextmenu", e => {
		console.log(e, "contextmenu")
	})
})
// 返回标记的当前地理位置。
const getLatLng = () => {
	console.log(marker?.getLatLng())
}
// 将标记位置更改为指定坐标。
const setLatLng = () => {
	marker?.setLatLng([60.5, 40.5])
}
// 更改标记的 zIndex 偏移量 。
const setZIndexOffset = () => {
	marker?.setZIndexOffset(100)
}
// 返回标记使用的当前图标。
const getIcon = () => {
	console.log(marker?.getIcon())
}
// 更改标记图标。
const setIcon = () => {
	marker?.setIcon(
		L.icon({
			iconUrl: "./leaflet/calculation/map-point.png"
		})
	)
}
// 更改标记的透明度。
const setOpacity = () => {
	marker?.setOpacity(0.5)
}
// precision 是坐标的小数位数，默认值是6位。
const toGeoJSON = () => {
	console.log(marker?.toGeoJSON())
}
// 从当前处于活动状态的地图中删除图层。
const removeFrom = () => {
	marker?.remove()
}
// 将弹出窗口绑定到传入的图层 content 并设置必要的事件侦听器。如果一个Function被传递，它将接收图层作为第一个参数，并应返回 String 或 HTMLElement。
const bindPopup = () => {
	marker?.bindPopup("<div>123<div/>")
}
// 移除之前用bindPopup绑定的弹出窗口。
const unbindPopup = () => {
	marker?.unbindPopup()
}
// 在指定的 latlng 处打开绑定的弹出窗口，如果没有指定 latlng，则在默认的锚点打开弹出窗口。
const openPopup = () => {
	marker?.openPopup()
}
// 如果弹出窗口（popup）已打开，则关闭绑定到该层的弹出窗口。
const closePopup = () => {
	marker?.closePopup()
}
// 根据当前状态打开或关闭绑定到该层的弹出窗口。
const togglePopup = () => {
	marker?.togglePopup()
}
//如果该层绑定的弹出窗口当前已打开，则返回 true。
const isPopupOpen = () => {
	console.log(marker?.isPopupOpen())
}
// 设置绑定到该层的弹出窗口的内容。
const setPopupContent = () => {
	marker?.setPopupContent("<div>456789</div>")
}
// 返回绑定到该层的弹出窗口。
const getPopup = () => {
	console.log(marker?.getPopup())
}
// 将工具提示（tooltip）绑定到传入的图层 content 并设置必要的事件侦听器。如果一个 Function 被传递，它将接收图层作为第一个参数，并应返回 String 或 HTMLElement。
const bindTooltip = () => {
	marker?.bindTooltip("<div>789</div>")
}
// 移除之前用 bindTooltip 绑定的工具提示（tooltip）。
const unbindTooltip = () => {
	marker?.unbindTooltip()
}
// 在指定的 latlng 处打开绑定的工具提示（tooltip），如果没有指定 latlng，则在默认的锚点打开工具提示（tooltip）。
const openTooltip = () => {
	marker?.openTooltip()
}
// 如果该图层处于打开状态，则关闭绑定到该图层的工具提示。
const closeTooltip = () => {
	marker?.closeTooltip()
}
// 根据当前状态打开或关闭绑定到该图层的工具提示（tooltip）。
const toggleTooltip = () => {
	marker?.toggleTooltip()
}
// 如果该层绑定的工具提示（tooltip）当前已打开，则返回 true。
const isTooltipOpen = () => {
	console.log(marker?.isTooltipOpen())
}
// 设置绑定到该层的工具提示（tooltip）的内容。
const setTooltipContent = () => {
	marker?.setTooltipContent("<div>12356<div/>")
}
// 返回绑定到该层的工具提示（tooltip）。
const getTooltip = () => {
	console.log(marker?.getTooltip())
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
