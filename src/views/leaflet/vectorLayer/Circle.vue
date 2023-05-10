<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="setRadius">设置半径</el-button>
			<el-button type="primary" @click="getRadius">获取半径</el-button>
			<el-button type="primary" @click="toGeoJSON">GeoJSON</el-button>
			<el-button type="primary" @click="setLatLng">设置圆心</el-button>
			<el-button type="primary" @click="getBounds">范围</el-button>
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
let circle: L.Circle | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]
	map.setView(center_point, 3)

	circle = L.circle([24.522422570142833, 118.11471659369913], {
		radius: 50,
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

	map.fitBounds(circle.getBounds())

	// 当标记通过 setLatLng移动时触发该事件，并且旧坐标和新坐标会作为 oldLatLng、latlng 包含在事件参数中。
	circle.on("move", e => {
		console.log(e, "move")
	})
	// 当用户 click（或 tap）图层时触发。
	circle.on("click", e => {
		console.log(e, "click")
	})
	// 当用户 double-click（或 double-tap）图层时触发。
	circle.on("dblclick", e => {
		console.log(e, "dblclick")
	})
	// 当用户在图层上按下鼠标按钮时触发。
	circle.on("mousedown", e => {
		console.log(e, "mousedown")
	})
	// 当用户释放在图层上按下的鼠标按钮时触发。
	circle.on("mouseup", e => {
		console.log(e, "mouseup")
	})
	// 当鼠标进入图层时触发。
	circle.on("mouseover", e => {
		console.log(e, "mouseover")
	})
	// 当鼠标离开图层时触发。
	circle.on("mouseout", e => {
		console.log(e, "mouseout")
	})
	// 当用户在图层上点击右键时触发，如果此事件有监听者，则阻止默认的浏览器上下文菜单显示。在移动设备上，当用户长按时，也会在手机上触发。
	circle.on("contextmenu", e => {
		console.log(e, "contextmenu")
	})
	// 当绑定到该层的 popup 打开时触发
	circle.on("popupopen", e => {
		console.log(e, "popupopen")
	})
	// 当绑定到该层的 popup 关闭时触发
	circle.on("popupclose", e => {
		console.log(e, "popupclose")
	})
	// 当绑定到该层的 tooltip 打开时触发。
	circle.on("tooltipopen", e => {
		console.log(e, "tooltipopen")
	})
	// 当绑定到该层的 tooltip 关闭时触发。
	circle.on("tooltipclose", e => {
		console.log(e, "tooltipclose")
	})
})
// 设置一个圆的半径。单位是米。
const setRadius = () => {
	circle?.setRadius(10)
}
// 返回一个圆的当前半径。单位是米。
const getRadius = () => {
	console.log(circle?.getRadius())
}
// 坐标值使用具有指定 precision 的 formatNum 函数进行四舍五入。返回折线的 GeoJSON 表示 (作为 GeoJSON LineString 或 MultiLineString Feature)。
const toGeoJSON = () => {
	console.log(circle?.toGeoJSON())
}
// 用给定的地理点数组替换多段折线中的所有点。
const setLatLng = () => {
	circle?.setLatLng([37, -109.05])
}
// 返回路径的 LatLngBounds 。
const getBounds = () => {
	console.log(circle?.getBounds())
}
// 重绘该图层。在你改变了路径使用的坐标后，有时会很有用。
const redraw = () => {
	circle?.redraw()
}
// 根据 Path options 对象中的选项，改变Path的外观。
const setStyle = () => {
	circle?.setStyle({
		color: "red"
	})
}
// 将该图层置于所有路径图层的顶部。
const bringToFront = () => {
	circle?.bringToFront()
}
// 将该图层置于所有路径图层的底部。
const bringToBack = () => {
	circle?.bringToBack()
}
// 将弹出窗口绑定到传入的图层 content 并设置必要的事件侦听器。如果一个Function被传递，它将接收图层作为第一个参数，并应返回 String 或 HTMLElement。
const bindPopup = () => {
	circle?.bindPopup("<div>123<div/>")
}
// 移除之前用bindPopup绑定的弹出窗口。
const unbindPopup = () => {
	circle?.unbindPopup()
}
// 在指定的 latlng 处打开绑定的弹出窗口，如果没有指定 latlng，则在默认的锚点打开弹出窗口。
const openPopup = () => {
	circle?.openPopup()
}
// 如果弹出窗口（popup）已打开，则关闭绑定到该层的弹出窗口。
const closePopup = () => {
	circle?.closePopup()
}
// 根据当前状态打开或关闭绑定到该层的弹出窗口。
const togglePopup = () => {
	circle?.togglePopup()
}
//如果该层绑定的弹出窗口当前已打开，则返回 true。
const isPopupOpen = () => {
	console.log(circle?.isPopupOpen())
}
// 设置绑定到该层的弹出窗口的内容。
const setPopupContent = () => {
	circle?.setPopupContent("<div>456789</div>")
}
// 返回绑定到该层的弹出窗口。
const getPopup = () => {
	console.log(circle?.getPopup())
}
// 将工具提示（tooltip）绑定到传入的图层 content 并设置必要的事件侦听器。如果一个 Function 被传递，它将接收图层作为第一个参数，并应返回 String 或 HTMLElement。
const bindTooltip = () => {
	circle?.bindTooltip("<div>789</div>")
}
// 移除之前用 bindTooltip 绑定的工具提示（tooltip）。
const unbindTooltip = () => {
	circle?.unbindTooltip()
}
// 在指定的 latlng 处打开绑定的工具提示（tooltip），如果没有指定 latlng，则在默认的锚点打开工具提示（tooltip）。
const openTooltip = () => {
	circle?.openTooltip()
}
// 如果该图层处于打开状态，则关闭绑定到该图层的工具提示。
const closeTooltip = () => {
	circle?.closeTooltip()
}
// 根据当前状态打开或关闭绑定到该图层的工具提示（tooltip）。
const toggleTooltip = () => {
	circle?.toggleTooltip()
}
// 如果该层绑定的工具提示（tooltip）当前已打开，则返回 true。
const isTooltipOpen = () => {
	console.log(circle?.isTooltipOpen())
}
// 设置绑定到该层的工具提示（tooltip）的内容。
const setTooltipContent = () => {
	circle?.setTooltipContent("<div>12356<div/>")
}
// 返回绑定到该层的工具提示（tooltip）。
const getTooltip = () => {
	console.log(circle?.getTooltip())
}
</script>
<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100%;
	display: flex;

	.btnList {
		width: 255px;
		display: flex;
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
