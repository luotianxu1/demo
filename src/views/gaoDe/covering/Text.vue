<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="addMarker">添加marker</el-button>
			<el-button type="primary" @click="getText">获取内容</el-button>
			<el-button type="primary" @click="setText">设置内容</el-button>
			<el-button type="primary" @click="setStyle">设置样式</el-button>
			<el-button type="primary" @click="getTitle">获取提示</el-button>
			<el-button type="primary" @click="setTitle">设置提示</el-button>
			<el-button type="primary" @click="getClickable">获取是否支持鼠标单击</el-button>
			<el-button type="primary" @click="setClickable">设置是否支持鼠标单击</el-button>
			<el-button type="primary" @click="getDraggable">获取是否可拖动</el-button>
			<el-button type="primary" @click="setDraggable">设置是否可拖动</el-button>
			<el-button type="primary" @click="getMap">获取地图</el-button>
			<el-button type="primary" @click="setMap">设置地图</el-button>
			<el-button type="primary" @click="show">显示</el-button>
			<el-button type="primary" @click="hide">隐藏</el-button>
			<el-button type="primary" @click="getPosition">获取位置</el-button>
			<el-button type="primary" @click="setPosition">设置位置</el-button>
			<el-button type="primary" @click="getAnchor">获取锚点</el-button>
			<el-button type="primary" @click="setAnchor">设置锚点</el-button>
			<el-button type="primary" @click="getOffset">获取偏移量</el-button>
			<el-button type="primary" @click="setOffset">设置偏移量</el-button>
			<el-button type="primary" @click="getAngle">获取旋转角度</el-button>
			<el-button type="primary" @click="setAngle">设置旋转角度</el-button>
			<el-button type="primary" @click="getzIndex">获取叠加顺序</el-button>
			<el-button type="primary" @click="setzIndex">设置叠加顺序</el-button>
			<el-button type="primary" @click="getOptions">获取属性</el-button>
			<el-button type="primary" @click="getBounds">获取范围</el-button>
			<el-button type="primary" @click="moveTo">移动</el-button>
			<el-button type="primary" @click="moveAlong">移动路径</el-button>
			<el-button type="primary" @click="stopMove">停止移动</el-button>
			<el-button type="primary" @click="pauseMove">暂停移动</el-button>
			<el-button type="primary" @click="resumeMove">重启移动</el-button>
			<el-button type="primary" @click="getTop">获取是否置顶</el-button>
			<el-button type="primary" @click="setTop">置顶</el-button>
			<el-button type="primary" @click="getCursor">获取鼠标悬停光标</el-button>
			<el-button type="primary" @click="setCursor">设置鼠标悬停光标</el-button>
			<el-button type="primary" @click="getExtData">获取自定义数据</el-button>
			<el-button type="primary" @click="setExtData">设置自定义数据</el-button>
			<el-button type="primary" @click="remove">删除</el-button>
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
let marker: AMap.Text
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.MoveAnimation"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.4, 39.92],
				zoom: 13
			})
		})
		.catch(e => {
			console.log(e)
		})
}

const addMarker = () => {
	marker = new AMap.Text({
		position: [116.396923, 39.918203], //点标记在地图上显示的位置
		text: "纯文本标记",
		title: "text", //鼠标滑过点标记时的文字提示
		visible: true, //点标记是否可见
		zIndex: 10, //点标记的叠加顺序
		offset: new AMap.Pixel(-13, -30), //点标记显示位置偏移量
		anchor: "top-center", //设置点标记锚点
		angle: 0, //点标记的旋转角度
		clickable: true, //点标记是否可点击
		draggable: true, //设置点标记是否可拖拽移动
		bubble: true, //事件是否冒泡
		zooms: [2, 20], //点标记显示的层级范围
		cursor: "pointer", //	指定鼠标悬停时的鼠
		topWhenClick: false, //鼠标点击时marker是否置顶
		// 自定义属性
		extData: {
			id: 1
		},
		style: {
			padding: ".75rem 1.25rem",
			"margin-bottom": "1rem",
			"border-radius": ".25rem",
			"background-color": "white",
			width: "15rem",
			"border-width": 0,
			"box-shadow": "0 2px 6px 0 rgba(114, 124, 245, .5)",
			"text-align": "center",
			"font-size": "20px",
			color: "blue"
		}
	})
	marker.setMap(map)

	// 鼠标左键单击事件
	marker.on("click", e => {
		console.log(e, "click")
	})

	// 鼠标左键双击事件
	marker.on("dblclick", e => {
		console.log(e, "dblclick")
	})

	// 鼠标右键单击事件
	marker.on("rightclick", e => {
		console.log(e, "rightclick")
	})

	// 鼠标移动
	marker.on("mousemove", e => {
		console.log(e, "mousemove")
	})

	// 鼠标移近点标记时触发事件
	marker.on("mouseover", e => {
		console.log(e, "mouseover")
	})

	// 鼠标移出点标记时触发事件
	marker.on("mouseout", e => {
		console.log(e, "mouseout")
	})

	// 鼠标在点标记上按下时触发事件
	marker.on("mousedown", e => {
		console.log(e, "mousedown")
	})

	// 鼠标在点标记上按下后抬起时触发事件
	marker.on("mouseup", e => {
		console.log(e, "mouseup")
	})

	// 开始拖拽点标记时触发事件
	marker.on("dragstart", e => {
		console.log(e, "dragstart")
	})

	// 鼠标拖拽移动点标记时触发事件
	marker.on("dragging", e => {
		console.log(e, "dragging")
	})

	// 点标记拖拽移动结束触发事件
	marker.on("dragend", e => {
		console.log(e, "dragend")
	})

	// 点标记执行moveTo动画结束时触发事件，也可以由moveAlong方法触发
	marker.on("moveend", e => {
		console.log(e, "moveend")
	})

	// 触摸开始时触发事件，仅适用移动设备
	marker.on("touchstart", e => {
		console.log(e, "touchstart")
	})

	// 触摸移动进行中时触发事件，仅适用移动设备
	marker.on("touchmove", e => {
		console.log(e, "touchmove")
	})

	// 触摸结束时触发事件，仅适用移动设备
	marker.on("touchend", e => {
		console.log(e, "touchend")
	})
}

const getText = () => {
	console.log(marker.getText())
}

const setText = () => {
	marker.setText("Hello")
}

const getTitle = () => {
	console.log(marker.getTitle())
}

const setTitle = () => {
	marker.setTitle("hello")
}

const setStyle = () => {
	marker.setStyle({
		"background-color": "red"
	})
}

const getClickable = () => {
	console.log(marker.getClickable())
}

const setClickable = () => {
	marker.setClickable(false)
}

const getDraggable = () => {
	console.log(marker.getDraggable())
}

const setDraggable = () => {
	marker.setDraggable(false)
}

const getMap = () => {
	console.log(marker.getMap())
}

const setMap = () => {
	marker.setMap(map)
}

const show = () => {
	marker.show()
}

const hide = () => {
	marker.hide()
}

const getPosition = () => {
	console.log(marker.getPosition())
}

const setPosition = () => {
	marker.setPosition([117.396923, 39.918203])
}

const getAnchor = () => {
	console.log(marker.getAnchor())
}

const setAnchor = () => {
	marker.setAnchor("top-right")
}

const getOffset = () => {
	console.log(marker.getOffset())
}

const setOffset = () => {
	marker.setOffset(new AMap.Pixel(-50, -50))
}

const getAngle = () => {
	console.log(marker.getAngle())
}

const setAngle = () => {
	marker.setAngle(50)
}

const getzIndex = () => {
	console.log(marker.getzIndex())
}

const setzIndex = () => {
	marker.setzIndex(50)
}

const getOptions = () => {
	console.log(marker.getOptions())
}

const getBounds = () => {
	console.log(marker.getBounds())
}

const moveTo = () => {
	marker.moveTo([116.397389, 39.909466], {
		duration: 1000,
		delay: 500
	})
}

const moveAlong = () => {
	const path = [
		new AMap.LngLat(116.397389, 39.909466),
		new AMap.LngLat(116.379707, 39.968168),
		new AMap.LngLat(116.434467, 39.95001),
		new AMap.LngLat(116.46365, 39.979481),
		new AMap.LngLat(116.397389, 39.909466)
	]
	// 分段设置时长
	const customData = [
		{ position: path[0], duration: 200 },
		{ position: path[1], duration: 400 },
		{ position: path[2], duration: 600 },
		{ position: path[3], duration: 800 },
		{ position: path[4], duration: 1000 }
	]
	marker.moveAlong(customData)
}

const stopMove = () => {
	marker.stopMove()
}

const pauseMove = () => {
	marker.pauseMove()
}

const resumeMove = () => {
	marker.resumeMove()
}

const getTop = () => {
	console.log(marker.getTop())
}

const setTop = () => {
	marker.setTop(true)
}

const getCursor = () => {
	console.log(marker.getCursor())
}

const setCursor = () => {
	marker.setCursor("move ")
}

const getExtData = () => {
	console.log(marker.getExtData())
}

const setExtData = () => {
	marker.setExtData({ id: 2 })
}

const remove = () => {
	marker.remove()
}
</script>
<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100vh;

	.btnList {
		display: flex;
		width: 250px;
		overflow: auto;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	.map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
