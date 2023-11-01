<template>
	<div class="main">
		<div class="btnList">
			<el-button @click="setCenter">设置中心点</el-button>
			<el-button @click="getCenter">获取中心点</el-button>
			<el-button @click="setZoom">设置缩放</el-button>
			<el-button @click="getZoom">获取缩放</el-button>
			<el-button @click="setZoomAndCenter">设置中心点和缩放</el-button>
			<el-button @click="setBounds">设置显示范围</el-button>
			<el-button @click="getBounds">获取可视范围</el-button>
			<el-button @click="zoomIn">放大</el-button>
			<el-button @click="zoomOut">缩小</el-button>
			<el-button @click="setPitch">设置俯仰角</el-button>
			<el-button @click="getPitch">获取俯仰角</el-button>
			<el-button @click="setRotation">设置旋转角</el-button>
			<el-button @click="getRotation">获取旋转角</el-button>
			<el-button @click="panTo">平移中心点</el-button>
			<el-button @click="panBy">平移像素</el-button>
			<el-button @click="getContainer">获取地图容器</el-button>
			<el-button @click="getSize">获取容器尺寸</el-button>
			<el-button @click="addLayer">添加图层</el-button>
			<el-button @click="removeLayer">删除图层</el-button>
			<el-button @click="setLayers">设置图层</el-button>
			<el-button @click="getLayers">获取图层</el-button>
			<el-button @click="add">添加覆盖物/图层</el-button>
			<el-button @click="remove">删除覆盖物/图层</el-button>
			<el-button @click="getStatus">获取地图状态</el-button>
			<el-button @click="setStatus">设置地图状态</el-button>
			<el-button @click="lngLatToCoords">经纬度转莫卡托坐标</el-button>
			<el-button @click="coordsToLngLat">莫卡托坐标转经纬度</el-button>
			<el-button @click="lngLatToContainer">经纬度转为地图容器像素坐标</el-button>
			<el-button @click="containerToLngLat">地图容器坐标转换成经纬度</el-button>
			<el-button @click="setDefaultCursor">设置指针样式</el-button>
			<el-button @click="getDefaultCursor">获取指针样式</el-button>
			<el-button @click="destroy">注销地图</el-button>
			<el-button @click="setLimitBounds">区域限制</el-button>
			<el-button @click="clearLimitBounds">清除区域限制</el-button>
			<el-button @click="setZooms">设置缩放范围</el-button>
			<el-button @click="getZooms">获取缩放范围</el-button>
			<el-button @click="getResolution">获取分辨率</el-button>
			<el-button @click="getScale">获取比例尺</el-button>
			<el-button @click="setFitView">自适应缩放</el-button>
			<el-button @click="getFitZoomAndCenterByOverlays">计算缩放</el-button>
			<el-button @click="addControl">添加控件</el-button>
			<el-button @click="removeControl">移除控件</el-button>
			<el-select v-model="value" class="m-2" placeholder="Select" size="large" @change="setMapStyle">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<el-button @click="getMapStyle">获取样式</el-button>
			<el-button @click="getAllOverlays">获取所有覆盖物</el-button>
			<el-button @click="clearMap">清空地图</el-button>
			<el-button @click="setFeatures">设置地图显示元素种类</el-button>
			<el-button @click="getFeatures">获取地图显示元素种类</el-button>
		</div>
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"
import "@amap/amap-jsapi-types"

const map = shallowRef<AMap.Map>()
let satelliteLayer: AMap.TileLayer
let marker: AMap.Marker
let markers = [
	{
		icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-1.png",
		position: [116.205467, 39.907761]
	},
	{
		icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-2.png",
		position: [116.368904, 39.913423]
	},
	{
		icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-3.png",
		position: [116.305467, 39.807761]
	}
]
let hawkEye: AMap.Control

onMounted(() => {
	initMap()
})

const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
		version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
		plugins: ["AMap.HawkEye"] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
	})
		.then(AMap => {
			const mapOptions: AMap.MapOptions = {
				viewMode: "3D", //是否为3D地图模式
				zoom: 5, //初始化地图级别
				zooms: [2, 20], //地图显示的缩放级别范围
				rotation: 0, //地图顺时针旋转角度
				rotateEnable: true, //地图是否可旋转
				pitch: 0, //俯仰角度
				pitchEnable: true, //是否允许设置俯仰角度
				features: ["bg", "point", "road", "building"], //设置地图上显示的元素种类, 支持'bg'（地图背景）、'point'（POI点）、'road'（道路）、'building'（建筑物）
				center: [105.602725, 37.076636], //初始化地图中心点位置
				dragEnable: true, //地图是否可通过鼠标拖拽平移
				zoomEnable: true, //地图是否可缩放
				jogEnable: true, //地图是否使用缓动效果
				animateEnable: true, //地图平移过程中是否使用动画
				keyboardEnable: true, //地图是否可通过键盘控制
				doubleClickZoom: true, //地图是否可通过双击鼠标放大地图
				scrollWheel: true, //地图是否可通过鼠标滚轮缩放浏览
				touchZoom: true, // 地图在移动终端上是否可通过多点触控缩放浏览地图
				touchZoomCenter: 1, // 当touchZoomCenter=1的时候，手机端双指缩放的以地图中心为中心，否则默认以双指中间点为中心。
				showLabel: true, //是否展示地图文字和 POI 信息。
				defaultCursor: "cursor", //地图默认鼠标样式
				isHotspot: true, //是否开启地图热点和标注的 hover 效果。
				// wallColor: "", //地图楼块的侧面颜色
				// roofColor: "", //地图楼块的顶面颜色
				showBuildingBlock: true, //是否展示地图 3D 楼块
				showIndoorMap: true, //是否自动展示室内地图
				skyColor: "", //天空颜色
				labelRejectMask: false, //文字是否拒绝掩模图层进行掩模
				// mask: [], //为 Map 实例指定掩模的路径，各图层将只显示路径范围内图像，3D视图下有效。
				WebGLParams: {} //额外配置的WebGL参数
			}
			//设置地图容器id
			map.value = new AMap.Map("map", mapOptions)

			satelliteLayer = new AMap.TileLayer.Satellite()

			marker = new AMap.Marker({
				icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
				position: [116.405467, 39.907761],
				anchor: "bottom-center"
			})

			hawkEye = new AMap.HawkEye({
				visible: true
			})

			// 地图容器尺寸改变事件
			map.value?.on("resize", e => {
				console.log("resize", e)
			})
			// 地图资源加载完成后触发事件
			map.value?.on("complete", e => {
				console.log("complete", e)
			})
			// 鼠标左键单击事件
			map.value?.on("click", e => {
				console.log("click", e)
			})
			// 鼠标左键双击事件
			map.value?.on("dblclick", e => {
				console.log("dblclick", e)
			})
			// 地图平移时触发事件
			map.value?.on("mapmove", e => {
				console.log("mapmove", e)
			})
			// 鼠标点击热点时触发
			map.value?.on("hotspotclick", e => {
				console.log("hotspotclick", e)
			})
			// 鼠标滑过热点时触发
			map.value?.on("hotspotover", e => {
				console.log("hotspotover", e)
			})
			// 鼠标移出热点时触发
			map.value?.on("movestart", e => {
				console.log("movestart", e)
			})
			// 地图平移开始时触发
			map.value?.on("moveend", e => {
				console.log("moveend", e)
			})
			// 缩放开始时触发
			map.value?.on("zoomstart", e => {
				console.log("zoomstart", e)
			})
			// 缩放结束时触发
			map.value?.on("zoomend", e => {
				console.log("zoomend", e)
			})
			// 地图旋转 rotation 更改后触发
			map.value?.on("rotatechange", e => {
				console.log("rotatechange", e)
			})
			// 地图旋转 rotation 开始时触发
			map.value?.on("rotatestart", e => {
				console.log("rotatestart", e)
			})
			// 地图旋转 rotation 结束时触发
			map.value?.on("rotatestart", e => {
				console.log("rotatestart", e)
			})
			// 鼠标在地图上移动时触发
			map.value?.on("mousemove", e => {
				console.log("mousemove", e)
			})
			// 鼠标滚轮开始缩放地图时触发
			map.value?.on("mousewheel", e => {
				console.log("mousewheel", e)
			})
			// 鼠标移入地图容器内时触发
			map.value?.on("mouseover", e => {
				console.log("mouseover", e)
			})
			// 鼠标移出地图容器时触发
			map.value?.on("mouseout", e => {
				console.log("mouseout", e)
			})
			// 鼠标在地图上单击抬起时触发
			map.value?.on("mouseup", e => {
				console.log("mouseup", e)
			})
			// 鼠标在地图上单击按下时触发
			map.value?.on("mousedown", e => {
				console.log("mousedown", e)
			})
			// 鼠标右键单击事件
			map.value?.on("rightclick", e => {
				console.log("rightclick", e)
			})
			// 开始拖拽地图时触发
			map.value?.on("dragstart", e => {
				console.log("dragstart", e)
			})
			// 拖拽地图过程中触发
			map.value?.on("dragging", e => {
				console.log("dragging", e)
			})
			// 停止拖拽地图时触发。如地图有拖拽缓动效果，则在拽停止，缓动开始前触发
			map.value?.on("dragend", e => {
				console.log("dragend", e)
			})
			// 触摸开始时触发事件，仅适用移动设备
			map.value?.on("touchstart", e => {
				console.log("touchstart", e)
			})
			// 拖拽地图过程中触发，仅适用移动设备
			map.value?.on("touchmove", e => {
				console.log("touchmove", e)
			})
			// 触摸结束时触发事件，仅适用移动设备
			map.value?.on("touchend", e => {
				console.log("touchend", e)
			})
		})
		.catch(e => {
			console.log(e)
		})
}

const setCenter = () => {
	let lng = 121.138398 + Math.floor(Math.random() * 589828) / 1e6 //经度范围[121.138398, 121.728226]
	let lat = 30.972688 + Math.floor(Math.random() * 514923) / 1e6 //纬度范围[30.972688, 31.487611]
	map.value?.setCenter([lng, lat])
}

const setZoomAndCenter = () => {
	let zoom = Math.floor(Math.random() * 7) + 11
	let lng = 121.138398 + Math.floor(Math.random() * 589828) / 1e6
	let lat = 30.972688 + Math.floor(Math.random() * 514923) / 1e6
	map.value?.setZoomAndCenter(zoom, [lng, lat])
}

const setZoom = () => {
	let zoom = Math.floor(Math.random() * 7) + 11 //zoom范围[11,18]
	map.value?.setZoom(zoom) //设置地图层级
}

const getBounds = () => {
	console.log(map.value?.getBounds())
}

const getCenter = () => {
	console.log(map.value?.getCenter())
}
const getZoom = () => {
	console.log(map.value?.getZoom())
}

const zoomIn = () => {
	map.value?.zoomIn()
}

const zoomOut = () => {
	map.value?.zoomOut()
}

const setPitch = () => {
	map.value?.setPitch(30)
}

const getPitch = () => {
	console.log(map.value?.getPitch())
}

const setRotation = () => {
	map.value?.setRotation(50)
}

const getRotation = () => {
	console.log(map.value?.getRotation())
}

const setBounds = () => {
	let mybounds = new AMap.Bounds([116.319665, 39.855919], [116.468324, 39.9756])
	map.value?.setBounds(mybounds)
}

const panTo = () => {
	let lng = 121.138398 + Math.floor(Math.random() * 589828) / 1e6 //经度范围[121.138398, 121.728226]
	let lat = 30.972688 + Math.floor(Math.random() * 514923) / 1e6 //纬度范围[30.972688, 31.487611]
	map.value?.panTo([lng, lat])
}

const panBy = () => {
	map.value?.panBy(50, 50)
}

const getContainer = () => {
	console.log(map.value?.getContainer())
}

const getSize = () => {
	console.log(map.value?.getSize())
}

const addLayer = () => {
	map.value?.addLayer(satelliteLayer)
}

const removeLayer = () => {
	map.value?.removeLayer(satelliteLayer)
}

const setLayers = () => {
	map.value?.setLayers([satelliteLayer])
}

const getLayers = () => {
	console.log(map.value?.getLayers())
}

const add = () => {
	map.value?.add(marker)
	map.value?.setFitView()
}

const remove = () => {
	map.value?.remove(marker)
}

const getStatus = () => {
	console.log(map.value?.getStatus())
}

const setStatus = () => {
	map.value?.setStatus({
		dragEnable: false,
		keyboardEnable: false,
		doubleClickZoom: false,
		zoomEnable: false,
		rotateEnable: false
	})
}

const lngLatToCoords = () => {
	let lng = 121.138398 + Math.floor(Math.random() * 589828) / 1e6 //经度范围[121.138398, 121.728226]
	let lat = 30.972688 + Math.floor(Math.random() * 514923) / 1e6 //纬度范围[30.972688, 31.487611]
	console.log(map.value?.lngLatToCoords([lng, lat]))
}

const coordsToLngLat = () => {
	console.log(map.value?.coordsToLngLat([13534458.129493812, 3678270.5283773383]))
}

const lngLatToContainer = () => {
	let lng = 121.138398 + Math.floor(Math.random() * 589828) / 1e6 //经度范围[121.138398, 121.728226]
	let lat = 30.972688 + Math.floor(Math.random() * 514923) / 1e6 //纬度范围[30.972688, 31.487611]
	console.log(map.value?.lngLatToContainer([lng, lat]))
}

const containerToLngLat = () => {
	console.log(map.value?.containerToLngLat([1190.2342179555553, 525.1378306170034]))
}

const getDefaultCursor = () => {
	console.log(map.value?.getDefaultCursor())
}

const setDefaultCursor = () => {
	map.value?.setDefaultCursor("pointer")
}

const destroy = () => {
	map.value?.destroy()
}

const setLimitBounds = () => {
	let bounds = map.value?.getBounds()
	map.value?.setLimitBounds(bounds!)
}

const clearLimitBounds = () => {
	map.value?.clearLimitBounds()
}

const getZooms = () => {
	console.log(map.value?.getZooms())
}

const setZooms = () => {
	map.value?.setZooms([10, 12])
}

const getResolution = () => {
	console.log(map.value?.getResolution())
}

const getScale = () => {
	console.log(map.value?.getScale(10))
}

const setFitView = () => {
	markers.forEach(function (marker) {
		new AMap.Marker({
			map: map.value,
			icon: marker.icon,
			position: [marker.position[0], marker.position[1]],
			offset: new AMap.Pixel(-13, -30)
		})
	})
	setTimeout(() => {
		map.value?.setFitView(null as any, false, [150, 60, 100, 60])
	}, 1000)
}

const getFitZoomAndCenterByOverlays = () => {
	let markerLayers: AMap.Marker[] = []
	markers.forEach(function (marker) {
		let layer = new AMap.Marker({
			map: map.value,
			icon: marker.icon,
			position: [marker.position[0], marker.position[1]],
			offset: new AMap.Pixel(-13, -30)
		})
		markerLayers.push(layer)
	})
	console.log(map.value?.getFitZoomAndCenterByOverlays(markerLayers))
}

const addControl = () => {
	map.value?.addControl(hawkEye)
}

const removeControl = () => {
	map.value?.removeControl(hawkEye)
}

const options = [
	{
		value: "normal",
		label: "标准"
	},
	{
		value: "dark",
		label: "幻影黑"
	},
	{
		value: "light",
		label: "月光银"
	},
	{
		value: "whitesmoke",
		label: "远山黛"
	},
	{
		value: "fresh",
		label: "草色青"
	},
	{
		value: "grey",
		label: "雅士灰"
	},
	{
		value: "graffiti",
		label: "涂鸦"
	},
	{
		value: "macaron",
		label: "马卡龙"
	},
	{
		value: "blue",
		label: "靛青蓝"
	},
	{
		value: "darkblue",
		label: "极夜蓝"
	},
	{
		value: "wine",
		label: "酱籽"
	}
]
const value = ref("normal")
const setMapStyle = (val: string) => {
	let styleName = "amap://styles/" + val
	map.value?.setMapStyle(styleName)
}

const getMapStyle = () => {
	console.log(map.value?.getMapStyle())
}

const getAllOverlays = () => {
	console.log(map.value?.getAllOverlays())
}

const clearMap = () => {
	map.value?.clearMap()
}

const getFeatures = () => {
	console.log(map.value?.getFeatures())
}

const setFeatures = () => {
	map.value?.setFeatures(["bg"])
}
</script>

<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100vh;

	.btnList {
		display: flex;
		width: 255px;
		overflow: auto;
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
