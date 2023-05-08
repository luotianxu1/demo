<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="setView">设置视图</el-button>
			<el-button type="primary" @click="setZoom">设置缩放</el-button>
			<el-button type="primary" @click="zoomIn">放大地图</el-button>
			<el-button type="primary" @click="zoomOut">缩小地图</el-button>
			<el-button type="primary" @click="setZoomAround">缩放地图</el-button>
			<el-button type="primary" @click="fitBounds">适应缩放</el-button>
			<el-button type="primary" @click="fitWorld">世界</el-button>
			<el-button type="primary" @click="panTo">平移指定点</el-button>
			<el-button type="primary" @click="panBy">平移像素</el-button>
			<el-button type="primary" @click="flyToBounds">平移视图</el-button>
			<el-button type="primary" @click="setMaxBounds">限制视图</el-button>
			<el-button type="primary" @click="setMinZoom">限制最小缩放</el-button>
			<el-button type="primary" @click="setMaxZoom">限制最大缩放</el-button>
			<el-button type="primary" @click="stop">停止动画</el-button>
			<el-button type="primary" @click="locate">定位</el-button>
			<el-button type="primary" @click="remove">销毁地图</el-button>
			<el-button type="primary" @click="getCenter">获取中心点</el-button>
			<el-button type="primary" @click="getZoom">获取缩放</el-button>
			<el-button type="primary" @click="getBounds">获取边界</el-button>
			<el-button type="primary" @click="getMinZoom">获取最小缩放</el-button>
			<el-button type="primary" @click="getMaxZoom">获取最大缩放</el-button>
			<el-button type="primary" @click="getBoundsZoom">获取吻合缩放</el-button>
			<el-button type="primary" @click="getSize">容器大小</el-button>
			<el-button type="primary" @click="layerPointToLatLng">根据点返回像素坐标</el-button>
			<el-button type="primary" @click="latLngToLayerPoint">根据坐标返回点</el-button>
			<el-button type="primary" @click="distance">两点间距离</el-button>
		</div>
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import * as L from "leaflet"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map", {
		preferCanvas: false, //是否使用 Canvas 来渲染 Path（路径）.默认情况下，所有 Path 都是使用 SVG 进行渲染。
		// 控件选项
		attributionControl: true, //默认情况下，是否将 attribution 版权控件添加到地图中。
		zoomControl: true, //默认情况下，是否将 zoom 缩放控件添加到地图中。
		// 交互选项
		closePopupOnClick: true, //如果你不希望用户点击地图时 popups（弹出窗口）自动关闭，则可以将其设置为 false。
		zoomSnap: 1, //强制让地图的缩放级别始终为这个值的倍数
		zoomDelta: 1, //控件在进行 zoomIn()、 zoomOut() 以及按 + - 键或者使用 zoom 进行缩放之后，地图缩放级别改变的值。小于 1 的值（例如 0.5）允许更大的颗粒度。
		trackResize: true, //地图是否会自动根据浏览器窗口的大小来更新自己。
		boxZoom: true, //是否可以在按住 shift 键的同时拖动鼠标将地图缩放到指定的矩形区域。
		doubleClickZoom: true, //地图是否可以通过双击来放大，以及在按住 shift 的同时双击来缩小。如果设置为 'center'，不管鼠标在哪里，双击缩放都将缩放到视图的中心。
		dragging: true, //地图是否可以通过 mouse/touch 进行拖动。
		// 地图状态选项
		crs: L.CRS.EPSG3857, //该地图使用的坐标系。
		center: [24.522422570142833, 118.11471659369913], //地图初始化时的中心点位置
		zoom: 12, //地图初始化时的缩放等级
		minZoom: 1, //地图的最小缩放级别。
		maxZoom: 20, //地图的最大缩放级别。
		layers: [], //默认添加到地图上的图层组
		// maxBounds: null, //当这个选项被设置后，地图将被限制在指定的地理边界内， 当用户平移将地图拖动到视图以外的范围时会出现弹回的效果， 并且也不允许缩小视图到指定范围以外的区域（这取决于地图的尺寸）. 要动态设置此限制，请使用 setMaxBounds 方法。
		// 动画选项
		zoomAnimation: true, //是否启用地图缩放动画。
		zoomAnimationThreshold: 4, //如果缩放差异超过此值，则不会为缩放设置动画。
		fadeAnimation: true, //是否启用淡出淡出动画。
		markerZoomAnimation: true, //Marker 标记是否使用缩放动画进行缩放。
		// Panning Inertia 选项
		inertia: true, //地图的平移会有一种惯性效应，即地图在拖动时形成动力，并在一段时间内继续向同一方向移动。
		inertiaDeceleration: 3000, //惯性运动减速的速度, 以像素/秒²单位。
		inertiaMaxSpeed: 3000, //惯性运动的最大速度，以像素/秒为单位。
		easeLinearity: 0.2,
		worldCopyJump: false, //启用该选项后，当你平移到世界的另一个 "copy" 时，地图会跟踪并无缝跳转到原来的副本，这样所有的覆盖物如 markers（标记）和 vector layers（矢量图层）都仍然可见。
		maxBoundsViscosity: 0.0, //如果设置了 maxBounds，这个选项将控制拖动地图时边界的稳固程度。默认值为 0.0，允许用户以正常速度在界外拖动，更高的值会减慢地图在界外的拖动速度，而 1.0 使界外完全稳固，防止用户在界外拖动。
		// 按键导航选项
		keyboard: true, //地图是否获得焦点，并且允许用户通过键盘和 +/- 来进行浏览地图。
		keyboardPanDelta: 80, //按下方向键时，平移的像素数量。
		// 鼠标选项
		scrollWheelZoom: true, //地图是否允许通过使用鼠标滚轮进行缩放。如果通过'center'，不管鼠标在哪里，都将会放大到视图的中心。
		wheelDebounceTime: 40, //限制滚轮的触发速度（以毫秒为单位）。默认情况下，用户通过滚轮缩放的次数不能超过每 40 毫秒一次。
		wheelPxPerZoomLevel: 60, //多少滚动像素（由 L.DomEvent.getWheelDelta 报告）意味着一个完整缩放级别的更改。 较小的值将使滚轮变焦更快（反之亦然）
		// 触摸交互选项
		tapTolerance: 15, //用户在触摸时，移动手指的像素数超过此值时被认为是有效的 tap。
		touchZoom: true, //地图是否允许通过两根手指的触摸拖动进行缩放。
		bounceAtZoomLimits: true //如果您不希望在地图缩放超过最小/最大缩放范围时反弹，请将其设置为 false。
	})
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	// 当地图上的缩放级别数因添加或移除图层而更改时触发。
	map.on("zoomlevelschange", e => {
		console.log(e, "zoomlevelschange")
	})
	// 调整地图大小时触发。
	map.on("resize", e => {
		console.log(e, "resize")
	})
	// 当使用 remove 方法销毁地图时触发。
	map.on("unload", e => {
		console.log(e, "unload")
	})
	// 当地图需要重绘其内容时触发
	map.on("viewreset", e => {
		console.log(e, "viewreset")
	})
	// 地图初始化时触发（首次设置其中心和缩放比例时）。
	map.on("load", e => {
		console.log(e, "lod")
	})
	// 地图缩放即将更改时（例如在缩放动画之前）触发。
	map.on("zoomstart", e => {
		console.log(e, "zoomstart")
	})
	// 当地图视图开始更改时触发（例如，用户开始拖动地图）。
	map.on("movestart", e => {
		console.log(e, "movestart")
	})
	// 在缩放级别的任何更改（包括缩放和飞行动画）期间反复触发。
	map.on("zoom", e => {
		console.log(e, "zoom")
	})
	// 在地图的任何移动过程中反复触发，包括平移和飞行动画。
	map.on("move", e => {
		console.log(e, "move")
	})
	// 在任何动画执行完毕地图更新后都会触发。
	map.on("zoomend", e => {
		console.log(e, "zoomend")
	})
	// 地图中心停止更改时触发（例如，用户停止拖动地图）。
	map.on("moveend", e => {
		console.log(e, "moveend")
	})
	// 当用户点击地图时触发。
	map.on("click", e => {
		console.log(e, "click")
	})
	// 当用户双击地图时触发。
	map.on("dblclick", e => {
		console.log(e, "dblclick")
	})
	// 当用户在地图上按下鼠标按钮时触发。
	map.on("mousedown", e => {
		console.log(e, "mousedown")
	})
	// 当用户释放地图上的鼠标按钮时触发。
	map.on("mouseup", e => {
		console.log(e, "mouseup")
	})
	// 当鼠标进入地图时触发。
	map.on("mouseover", e => {
		console.log(e, "mouseover")
	})
	// 当鼠标离开地图时触发。
	map.on("mouseout", e => {
		console.log(e, "mouseout")
	})
	// 当鼠标在地图上移动时触发。
	// map.on("mousemove", e => {
	// 	console.log(e, "mousemove")
	// })
	// 当用户在地图上按下鼠标右键时触发，从而阻止默认浏览器上下文菜单显示，如果此事件上有侦听器。 当用户长按时，也会在移动设备上触发。
	map.on("contextmenu", e => {
		console.log(e, "contextmenu")
	})
	// 当用户在聚焦地图时按下键盘上输入字符时触发。
	map.on("keypress", e => {
		console.log(e, "keypress")
	})
	// 当地图聚焦时用户按下键盘上的键时触发。 与keypress事件不同，对于产生字符值的键和不产生字符值的键都会触发keydown事件。
	map.on("keydown", e => {
		console.log(e, "keydown")
	})
	// 当用户在地图被聚焦时从键盘上释放一个按键时触发。
	map.on("keyup", e => {
		console.log(e, "keyup")
	})
	// 在鼠标点击地图之前触发（当你希望在点击事件触发之前执行某些操作时可以使用）。
	map.on("preclick", e => {
		console.log(e, "preclick")
	})
})

const remove = () => {
	map?.remove()
}
// 用指定的动画选项设置地图的视图（地理中心和缩放）。
const setView = () => {
	map?.setView([39.54, 116.23], 12)
}
// 设置地图的缩放级别。
const setZoom = () => {
	map?.setZoom(5)
}
// 放大地图级别
const zoomIn = () => {
	map?.zoomIn(5)
}
// 缩小地图级别
const zoomOut = () => {
	map?.zoomOut(5)
}
// 缩放地图，同时保持地图上的指定地理位置不变（例如内部用于滚动缩放和双击缩放）。
const setZoomAround = () => {
	map?.setZoomAround([39.54, 116.23], 5)
}
// 将地图的视图设置在给定的矩形地理范围内,地图会自动计算最大缩放级别和中心点。
const fitBounds = () => {
	map?.fitBounds(
		[
			[39.54, 116.23],
			[39.525, 114.32]
		],
		{
			padding: [0, 0],
			paddingTopLeft: [0, 0],
			paddingBottomRight: [0, 0]
		}
	)
}
// 设置一个包含整个世界的地图视图，其缩放级别为最大。
const fitWorld = () => {
	map?.fitWorld()
}
// 将地图平移到一个指定的中心点。
const panTo = () => {
	map?.panTo([39.525, 114.32])
}
// 执行一个平滑的平移-缩放动画，移动缩放地图范围至指定的地理中心和级别。
const panBy = () => {
	map?.panBy([100, 100])
}
// 设置地图的视图，并且它具有像 flyTo 一样的平滑动画，但需要一个像 fitBounds 一样的边界参数。
const flyToBounds = () => {
	map?.flyToBounds([
		[39.54, 116.23],
		[39.525, 114.32]
	])
}
// 将地图视图限制在给定的范围内
const setMaxBounds = () => {
	map?.setMaxBounds([
		[39.54, 116.23],
		[39.525, 114.32]
	])
}
// 设置地图最小缩放级别
const setMinZoom = () => {
	map?.setMinZoom(10)
}
// 设置地图最大缩放级别
const setMaxZoom = () => {
	map?.setMaxZoom(15)
}
// 停止动画
const stop = () => {
	map?.stop()
}
// 定位
const locate = () => {
	map?.locate()
}
// 返回地图中心点的经纬度
const getCenter = () => {
	console.log(map?.getCenter())
}
// 返回地图此时的缩放级别
const getZoom = () => {
	console.log(map?.getZoom())
}
// 返回当前地图的矩形边界
const getBounds = () => {
	console.log(map?.getBounds())
}
// 返回地图的最小缩放级别
const getMinZoom = () => {
	console.log(map?.getMinZoom())
}
// 返回地图的最大缩放级别
const getMaxZoom = () => {
	console.log(map?.getMaxZoom())
}
// 返回给定边界与地图视图完全吻合的最大缩放级别。如果 inside（可选）被设置为 true，该方法反而会返回地图视图完全适合给定边界的最小缩放级别。
const getBoundsZoom = () => {
	console.log(
		map?.getBoundsZoom([
			[39.54, 116.23],
			[39.525, 114.32]
		])
	)
}
// 返回地图容器的当前大小（以像素为单位）。
const getSize = () => {
	console.log(map?.getSize())
}
// 给定相对于origin pixel的相应像素坐标，转换为相应的地理坐标（对于当前缩放级别）。
const layerPointToLatLng = () => {
	console.log(map?.layerPointToLatLng(L.point(200, 300)))
}
// 给定地理坐标，转换为相对于origin pixel的相应像素坐标。（在地图上进行位置叠加时比较有用）
const latLngToLayerPoint = () => {
	console.log(map?.latLngToLayerPoint([24.521512523686432, 117.89772033691408]))
}
// 根据地图的参考系来返回两个地理位置之间的距离，默认为米。
const distance = () => {
	console.log(map?.distance([39.54, 116.23], [39.525, 114.32]))
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
