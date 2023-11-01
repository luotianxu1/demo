<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="spinHandle">旋转定位到沈阳</el-button>
			<el-button type="primary" @click="elasticHandle">弹性定位到北京</el-button>
			<el-button type="primary" @click="bounceHandle">反弹定位到上海</el-button>
			<el-button type="primary" @click="rotateHandle">围绕武汉旋转</el-button>
			<el-button type="primary" @click="flyHandle">飞行定位到广州</el-button>
		</div>
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import Map from "ol/Map"
import Tile from "ol/layer/Tile" // 瓦片加载器
import XYZ from "ol/source/XYZ" // 引入XYZ地图格式
import View from "ol/View"
import * as olEasing from "ol/easing"
import * as olProj from "ol/proj"

onMounted(() => {
	initMap()
})

let map
let view
const Map_vec = new Tile({
	source: new XYZ({
		url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
		wrapX: false
	})
})
//各定位点(中国省会城市)
const shenyang = olProj.fromLonLat([123.24, 41.5])
const beijing = olProj.fromLonLat([116.28, 39.54])
const shanghai = olProj.fromLonLat([121.29, 31.14])
const wuhan = olProj.fromLonLat([114.21, 30.37])
const guangzhou = olProj.fromLonLat([113.15, 23.08])

const initMap = () => {
	view = new View({
		center: [12950000, 4860000], // 中心点坐标
		zoom: 6
	})
	map = new Map({
		target: "map",
		layers: [Map_vec],
		view: view
	})
}

const spinHandle = () => {
	let center = view.getCenter()
	view.animate(
		//第一个过程
		{
			//动画结束时的视图中心,即当前视图中心同目标视图中心连线的中心点
			center: [center[0] + (shenyang[0] - shenyang[0]) / 2, center[1] + (shenyang[1] - shenyang[1]) / 2],
			rotation: Math.PI, //动画结束时的旋转角度，即180度
			easing: olEasing.easeIn //按每一帧动画控制的动画速度，即开始缓慢并逐渐加快速度
		},
		//第二个过程
		{
			center: shenyang, //动画结束时的视图中心
			rotation: 2 * Math.PI, //动画结束时的旋转角度，即360度回正
			easing: olEasing.easeOut //按每一帧动画控制的动画速度，即开始快速并逐渐减速
		}
	)
}

const elasticHandle = () => {
	view.animate({
		center: beijing, ///动画结束时的视图中心
		duration: 2000, //动画的持续时间（以毫秒为单位）
		easing: elastic //按每一帧动画控制的动画持续时间函数
	})
}

const bounceHandle = () => {
	view.animate({
		center: shanghai, ///动画结束时的视图中心
		duration: 2000, //动画的持续时间（以毫秒为单位）
		easing: bounce //按每一帧动画控制的动画持续时间函数
	})
}

const rotateHandle = () => {
	let rotation = view.getRotation()
	view.animate(
		//第一个过程
		{
			rotation: rotation + Math.PI, //第一次动画旋转角度
			anchor: wuhan, //自旋的中心点，即武汉
			easing: olEasing.easeIn ////按每一帧动画控制的动画速度，即开始缓慢并逐渐加快速度
		},
		//第二个过程
		{
			rotation: rotation + 2 * Math.PI, //动画结束时的旋转角度，即360度回正
			anchor: wuhan, // 旋转中心点
			easing: olEasing.easeOut ///按每一帧动画控制的动画速度，即开始快速并逐渐减速
		}
	)
}

const flyHandle = () => {
	let duration = 2000 //动画的持续时间（以毫秒为单位）
	let zoom = view.getZoom()
	let parts = 2
	let called = false
	//动画完成的回调函数
	function callback(complete) {
		--parts
		if (called) {
			return
		}
		if (parts === 0 || !complete) {
			called = true
			// done(complete)
		}
	}
	//第一个动画
	view.animate(
		{
			center: guangzhou,
			duration: duration
		},
		callback
	)
	//第二个动画
	view.animate(
		{
			zoom: zoom - 1,
			duration: duration / 2
		},
		{
			zoom: zoom,
			duration: duration / 2
		},
		callback
	)
}

// 获取反弹值
const bounce = t => {
	let s = 7.5625,
		p = 2.75,
		l
	if (t < 1 / p) {
		l = s * t * t
	} else {
		if (t < 2 / p) {
			t -= 1.5 / p
			l = s * t * t + 0.75
		} else {
			if (t < 2.5 / p) {
				t -= 2.25 / p
				l = s * t * t + 0.9375
			} else {
				t -= 2.625 / p
				l = s * t * t + 0.984375
			}
		}
	}
	return l
}
// 获取弹性伸缩值
const elastic = t => {
	return Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) + 1
}
</script>

<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100vh;

	.btnList {
		display: flex;
		width: 150px;
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
