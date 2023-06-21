<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="getName">获取标注名称</el-button>
			<el-button type="primary" @click="setName">设置标注名称</el-button>
			<el-button type="primary" @click="getPosition">获取位置</el-button>
			<el-button type="primary" @click="setPosition">设置位置</el-button>
			<el-button type="primary" @click="getZooms">获取缩放级别</el-button>
			<el-button type="primary" @click="setZooms">设置缩放级别</el-button>
			<el-button type="primary" @click="getOpacity">获取透明度</el-button>
			<el-button type="primary" @click="setOpacity">设置透明度</el-button>
			<el-button type="primary" @click="getzIndex">获取顺序</el-button>
			<el-button type="primary" @click="setzIndex">设置顺序</el-button>
			<el-button type="primary" @click="getRank">获取优先级</el-button>
			<el-button type="primary" @click="setRank">设置优先级</el-button>
			<el-button type="primary" @click="getText">获取文本</el-button>
			<el-button type="primary" @click="setText">设置文本</el-button>
			<el-button type="primary" @click="getIcon">获取图标</el-button>
			<el-button type="primary" @click="setIcon">设置图标</el-button>
			<el-button type="primary" @click="getOptions">获取全部属性</el-button>
			<el-button type="primary" @click="getExtData">获取自定义属性</el-button>
			<el-button type="primary" @click="setExtData">设置自定义属性</el-button>
			<el-button type="primary" @click="setTop">设置置顶</el-button>
			<el-button type="primary" @click="getVisible">是否可见</el-button>
			<el-button type="primary" @click="getCollision">是否避让</el-button>
			<el-button type="primary" @click="show">显示</el-button>
			<el-button type="primary" @click="hide">隐藏</el-button>
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
let labelMarker: AMap.LabelMarker
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.MoveAnimation"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				zoom: 13,
				center: [116.468599, 39.995847],
				resizeEnable: true
			})

			addMarker()
		})
		.catch(e => {
			console.log(e)
		})
}

const addMarker = () => {
	// 创建一个 LabelMarker 实例
	labelMarker = new AMap.LabelMarker({
		name: "name", // 标注名称，作为标注标识，并非最终在地图上显示的文字内容，显示文字内容请设置 opts.text.content
		position: [116.468599, 39.995847], // 标注位置
		zooms: [2, 20], // 标注显示级别范围， 可选值： [2,20]
		opacity: 1, // 标注透明度
		rank: 1, // 避让优先级
		zIndex: 2, // 同一 LabelsLayer 内标注显示层级
		visible: true, // 标注是否可见
		// 用户自定义类型数据
		extData: {
			id: 1
		},
		// 标注图标设置
		icon: {
			image: "https://a.amap.com/jsapi_demos/static/images/poi-marker.png", // 图标 url
			anchor: "bottom-center", // 图标锚点
			size: [25, 34], // 图标大小
			clipOrigin: [459, 92], // 图标所在图片偏移位置
			clipSize: [50, 68], // 图标所在图片裁剪大小
			offset: [0, 0] // 图标所在图片偏移量
		},
		// 标注文本设置
		text: {
			content: "香猪坊", // 文本标注的内容
			direction: "right", // 文本标注方位
			offset: [0, 0], // 偏移量
			zooms: [2, 20], // 文本显示级别范围
			// 文本样式设置
			style: {
				fontSize: 15, // 文字大小
				fillColor: "#fff", // 文字颜色
				strokeColor: "rgba(255,0,0,0.5)", // 文字描边颜色
				strokeWidth: 2, // 文字背景描边粗细
				padding: [3, 10], // 文字 padding
				backgroundColor: "yellow", // 文字背景颜色
				borderColor: "#ccc", // 文字背景描边颜色
				borderWidth: 3, // 文字背景描边粗细
				fold: true // 文字是否折行（6个字一折行）
			}
		}
	})

	// 创建一个 LabelsLayer 实例来承载 LabelMarker
	let labelsLayer: any = new AMap.LabelsLayer({
		collision: true
	})
	// 将 LabelMarker 实例添加到 LabelsLayer 上
	labelsLayer.add(labelMarker)
	// 将 LabelsLayer 添加到地图上
	map.add(labelsLayer)

	// 鼠标左键单击标注触发的事件
	labelsLayer.on("click", (e: any) => {
		console.log(e, "click")
	})

	// 鼠标在标注上移动触发的事件
	labelsLayer.on("mousemove", (e: any) => {
		console.log(e, "mousemove")
	})

	// 鼠标移进标注时触发事件
	labelsLayer.on("mouseover", (e: any) => {
		console.log(e, "mouseover")
	})

	// 鼠标移出标注时触发事件
	labelsLayer.on("mouseout", (e: any) => {
		console.log(e, "mouseout")
	})

	// 鼠标在标注上按下时触发事件
	labelsLayer.on("mousedown", (e: any) => {
		console.log(e, "mousedown")
	})

	// 鼠标在标注上按下后抬起时触发事件
	labelsLayer.on("mouseup", (e: any) => {
		console.log(e, "mouseup")
	})

	// 触摸开始时触发事件，仅适用移动设备
	labelsLayer.on("touchstart", (e: any) => {
		console.log(e, "touchstart")
	})

	// 触摸移动进行中时触发事件，仅适用移动设备
	labelsLayer.on("touchmove", (e: any) => {
		console.log(e, "touchmove")
	})

	// 触摸结束时触发事件，仅适用移动设备
	labelsLayer.on("touchend", (e: any) => {
		console.log(e, "touchend")
	})
}

const getName = () => {
	console.log(labelMarker.getName())
}

const setName = () => {
	labelMarker.setName("label")
}

const getPosition = () => {
	console.log(labelMarker.getPosition())
}

const setPosition = () => {
	labelMarker.setPosition([117.468599, 39.995847])
}

const getZooms = () => {
	console.log(labelMarker.getZooms())
}

const setZooms = () => {
	labelMarker.setZooms([10, 20])
}

const getOpacity = () => {
	console.log(labelMarker.getOpacity())
}

const setOpacity = () => {
	labelMarker.setOpacity(0.5)
}

const getzIndex = () => {
	console.log(labelMarker.getzIndex())
}

const setzIndex = () => {
	labelMarker.setzIndex(99)
}

const getRank = () => {
	console.log(labelMarker.getRank())
}

const setRank = () => {
	labelMarker.setRank(99)
}

const getText = () => {
	console.log(labelMarker.getText())
}

const setText = () => {
	labelMarker.setText({
		content: "123"
	})
}

const getIcon = () => {
	console.log(labelMarker.getIcon())
}

const setIcon = () => {
	labelMarker.setIcon({
		image: "https://a.amap.com/jsapi_demos/static/images/poi-marker.png", // 图标 url
		anchor: "bottom-center", // 图标锚点
		size: [25, 34], // 图标大小
		clipOrigin: [259, 88], // 图标所在图片偏移位置
		clipSize: [50, 68], // 图标所在图片裁剪大小
		offset: [0, 0] // 图标所在图片偏移量
	})
}

const getOptions = () => {
	console.log(labelMarker.getOptions())
}

const getExtData = () => {
	console.log(labelMarker.getExtData())
}

const setExtData = () => {
	labelMarker.setExtData({
		extData: "123"
	})
}

const setTop = () => {
	console.log(labelMarker.setTop())
}

const getVisible = () => {
	console.log(labelMarker.getVisible())
}

const getCollision = () => {
	console.log(labelMarker.getCollision())
}

const show = () => {
	console.log(labelMarker.show())
}

const hide = () => {
	labelMarker.hide()
}

const remove = () => {
	labelMarker.remove()
}
</script>
<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100vh;
	display: flex;

	.btnList {
		width: 250px;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		overflow: auto;
	}

	.map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
