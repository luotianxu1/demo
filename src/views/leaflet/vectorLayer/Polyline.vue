<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="toGeoJSON">GeoJSON</el-button>
			<el-button type="primary" @click="getLatLngs">获取路径</el-button>
			<el-button type="primary" @click="setLatLngs">设置路径</el-button>
			<el-button type="primary" @click="isEmpty">是否为空</el-button>
			<el-button type="primary" @click="closestLayerPoint">最接近的点</el-button>
			<el-button type="primary" @click="getCenter">中心点</el-button>
			<el-button type="primary" @click="getBounds">范围</el-button>
			<el-button type="primary" @click="addLatLng">添加点</el-button>
			<el-button type="primary" @click="redraw">重绘</el-button>
			<el-button type="primary" @click="setStyle">设置样式</el-button>
			<el-button type="primary" @click="bringToFront">置顶</el-button>
			<el-button type="primary" @click="bringToBack">置底</el-button>
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
let polyline2: L.Polyline | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]
	map.setView(center_point, 3)

	// 从LatLng点的数组中创建一条红色的折线
	// let latlngs: LatLngExpression[] = [
	// 	[45.51, -122.68],
	// 	[37.77, -122.43],
	// 	[34.04, -118.2]
	// ]
	// let polyline = L.polyline(latlngs, { color: "red" }).addTo(map)

	let latlngs2: LatLngExpression[][] = [
		[
			[45.51, -122.68],
			[37.77, -122.43],
			[34.04, -118.2]
		],
		[
			[40.78, -73.91],
			[41.83, -87.62],
			[32.76, -96.72]
		]
	]
	polyline2 = L.polyline(latlngs2, {
		smoothFactor: 1.0, //在每个缩放级别简化多段线的程度。更多意味着更好的性能和更平滑的外观，而更少意味着更精确的表现。
		noClip: false, //禁用折线剪裁。
		stroke: true, //是否沿路径绘制边框。把它设置为false ，可以禁用多边形或圆形的边框。
		color: "#3388ff", //Stroke（描边）颜色
		weight: 3, //Stroke（描边）宽度，单位：像素
		opacity: 1.0, //Stroke（描边）的不透明度
		lineCap: "round", //定义描边 结束时使用的形状 的字符串。
		lineJoin: "round", //定义在描边 转角处使用的形状 的字符串。
		// dashArray: null, //一个定义描边的点画线的 图案范式的字符串。 在一些旧的浏览器中，对 Canvas-powered 图层不起作用。
		// dashOffset: null, //一个字符串，它定义了进入 dash 范式的距离，以 dash 开始。 在一些旧的浏览器中，对 Canvas-powered 图层不起作用。
		fill: false, //是否对路径进行颜色填充。设置为 false 可以禁止对多边形或圆形的填充。
		fillColor: "#3388ff", //填充颜色。默认为 color 选项的值。
		fillOpacity: 0.2, //填充的不透明度。
		fillRule: "evenodd", //一个字符串，定义 形状的内部区域 是如何被确定的。
		bubblingMouseEvents: true, //当为 true时，这个路径上的鼠标事件将在地图上触发相同的事件 (除非使用 L.DomEvent.stopPropagation )。
		className: "polyline", //在一个元素上设置的自定义类名。仅适用于 SVG 渲染器。
		interactive: true, //如果是 false, 该图层将不会发出鼠标事件，而是作为底层地图的一部分。
		pane: "overlayPane" //默认情况下，该图层将被添加到地图的 overlay pane（覆盖窗格）中。 覆盖该选项将导致该图层被默认放置在另一个窗格中。
	}).addTo(map)

	map.fitBounds(polyline2.getBounds())

	// 当用户 click（或 tap）图层时触发。
	polyline2.on("click", e => {
		console.log(e, "click")
	})
	// 当用户 double-click（或 double-tap）图层时触发。
	polyline2.on("dblclick", e => {
		console.log(e, "dblclick")
	})
	// 当用户在图层上按下鼠标按钮时触发。
	polyline2.on("mousedown", e => {
		console.log(e, "mousedown")
	})
	// 当用户释放在图层上按下的鼠标按钮时触发。
	polyline2.on("mouseup", e => {
		console.log(e, "mouseup")
	})
	// 当鼠标进入图层时触发。
	polyline2.on("mouseover", e => {
		console.log(e, "mouseover")
	})
	// 当鼠标离开图层时触发。
	polyline2.on("mouseout", e => {
		console.log(e, "mouseout")
	})
	// 当用户在图层上点击右键时触发，如果此事件有监听者，则阻止默认的浏览器上下文菜单显示。在移动设备上，当用户长按时，也会在手机上触发。
	polyline2.on("contextmenu", e => {
		console.log(e, "contextmenu")
	})
	// 当绑定到该层的 popup 打开时触发
	polyline2.on("popupopen", e => {
		console.log(e, "popupopen")
	})
	// 当绑定到该层的 popup 关闭时触发
	polyline2.on("popupclose", e => {
		console.log(e, "popupclose")
	})
	// 当绑定到该层的 tooltip 打开时触发。
	polyline2.on("tooltipopen", e => {
		console.log(e, "tooltipopen")
	})
	// 当绑定到该层的 tooltip 关闭时触发。
	polyline2.on("tooltipclose", e => {
		console.log(e, "tooltipclose")
	})
})
// 坐标值使用具有指定 precision 的 formatNum 函数进行四舍五入。返回折线的 GeoJSON 表示 (作为 GeoJSON LineString 或 MultiLineString Feature)。
const toGeoJSON = () => {
	console.log(polyline2?.toGeoJSON())
}
// 返回 path（路径）中的点的数组，如果是多段折线，则返回点的嵌套数组。
const getLatLngs = () => {
	console.log(polyline2?.getLatLngs())
}
// 用给定的地理点数组替换多段折线中的所有点。
const setLatLngs = () => {
	polyline2?.setLatLngs([
		[
			[45.51, -122.68],
			[37.77, -122.43],
			[34.04, -118.2]
		],
		[
			[40.78, -73.91],
			[41.83, -87.62],
			[32.76, -96.72]
		]
	])
}
// 如果折线没有经纬度，则返回 true 。
const isEmpty = () => {
	console.log(polyline2?.isEmpty())
}
// 返回折线上最接近 p 的点。
const closestLayerPoint = () => {
	console.log(polyline2?.closestLayerPoint(L.point(45.51, -122.68)))
}
// 返回折线的中心坐标 (centroid) 。
const getCenter = () => {
	console.log(polyline2?.getCenter())
}
// 返回路径的 LatLngBounds 。
const getBounds = () => {
	console.log(polyline2?.getBounds())
}
// 将一个给定的点添加到折线上。默认情况下，如果是多段折线，会添加到折线的第一个环上，但是可以通过传递一个特定的环作为LatLng数组来重写（你可以提前用 getLatLngs访问）。
const addLatLng = () => {
	polyline2?.addLatLng([45.51, -122.68])
}
// 重绘该图层。在你改变了路径使用的坐标后，有时会很有用。
const redraw = () => {
	polyline2?.redraw()
}
// 根据 Path options 对象中的选项，改变Path的外观。
const setStyle = () => {
	polyline2?.setStyle({
		color: "red"
	})
}
// 将该图层置于所有路径图层的顶部。
const bringToFront = () => {
	polyline2?.bringToFront()
}
// 将该图层置于所有路径图层的底部。
const bringToBack = () => {
	polyline2?.bringToBack()
}
// 将弹出窗口绑定到传入的图层 content 并设置必要的事件侦听器。如果一个Function被传递，它将接收图层作为第一个参数，并应返回 String 或 HTMLElement。
const bindPopup = () => {
	polyline2?.bindPopup("<div>123<div/>")
}
// 移除之前用bindPopup绑定的弹出窗口。
const unbindPopup = () => {
	polyline2?.unbindPopup()
}
// 在指定的 latlng 处打开绑定的弹出窗口，如果没有指定 latlng，则在默认的锚点打开弹出窗口。
const openPopup = () => {
	polyline2?.openPopup()
}
// 如果弹出窗口（popup）已打开，则关闭绑定到该层的弹出窗口。
const closePopup = () => {
	polyline2?.closePopup()
}
// 根据当前状态打开或关闭绑定到该层的弹出窗口。
const togglePopup = () => {
	polyline2?.togglePopup()
}
//如果该层绑定的弹出窗口当前已打开，则返回 true。
const isPopupOpen = () => {
	console.log(polyline2?.isPopupOpen())
}
// 设置绑定到该层的弹出窗口的内容。
const setPopupContent = () => {
	polyline2?.setPopupContent("<div>456789</div>")
}
// 返回绑定到该层的弹出窗口。
const getPopup = () => {
	console.log(polyline2?.getPopup())
}
// 将工具提示（tooltip）绑定到传入的图层 content 并设置必要的事件侦听器。如果一个 Function 被传递，它将接收图层作为第一个参数，并应返回 String 或 HTMLElement。
const bindTooltip = () => {
	polyline2?.bindTooltip("<div>789</div>")
}
// 移除之前用 bindTooltip 绑定的工具提示（tooltip）。
const unbindTooltip = () => {
	polyline2?.unbindTooltip()
}
// 在指定的 latlng 处打开绑定的工具提示（tooltip），如果没有指定 latlng，则在默认的锚点打开工具提示（tooltip）。
const openTooltip = () => {
	polyline2?.openTooltip()
}
// 如果该图层处于打开状态，则关闭绑定到该图层的工具提示。
const closeTooltip = () => {
	polyline2?.closeTooltip()
}
// 根据当前状态打开或关闭绑定到该图层的工具提示（tooltip）。
const toggleTooltip = () => {
	polyline2?.toggleTooltip()
}
// 如果该层绑定的工具提示（tooltip）当前已打开，则返回 true。
const isTooltipOpen = () => {
	console.log(polyline2?.isTooltipOpen())
}
// 设置绑定到该层的工具提示（tooltip）的内容。
const setTooltipContent = () => {
	polyline2?.setTooltipContent("<div>12356<div/>")
}
// 返回绑定到该层的工具提示（tooltip）。
const getTooltip = () => {
	console.log(polyline2?.getTooltip())
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
