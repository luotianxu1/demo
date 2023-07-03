<template>
	<div class="container">
		<div id="map" class="map"></div>
	</div>
</template>

<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"

let map
let loca

onMounted(() => {
	initMap()
})

onUnmounted(() => {
	loca.destroy()
	map.destroy()
})

const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		AMapUI: {
			// 是否加载 AMapUI，缺省不加载
			version: "1.1", // AMapUI 缺省 1.1
			plugins: ["overlay/SimpleMarker"] // 需要加载的 AMapUI ui插件
		},
		Loca: {
			version: "2.0.0" // Loca 版本，缺省 1.3.2
		}
	})
		.then(AMap => {
			map = new AMap.Map("map", {
				zoom: 11.7,
				center: [120.19660949707033, 30.234747338474293],
				pitch: 45,
				showLabel: false,
				viewMode: "3D",
				mapStyle: "amap://styles/dark"
			})
			loca = new Loca.Container({
				map: map
			})
			let geo = new Loca.GeoJSONSource({
				url: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/hz_house_order.json"
			})
			let heatmap = new Loca.HeatMapLayer({
				// loca,
				zIndex: 10,
				opacity: 1,
				visible: true,
				zooms: [2, 22]
			})
			heatmap.setSource(geo, {
				radius: 20,
				unit: "px",
				height: 90,
				gradient: {
					0.1: "rgba(50,48,118,1)",
					0.2: "rgba(127,60,255,1)",
					0.4: "rgba(166,53,219,1)",
					0.6: "rgba(254,64,95,1)",
					0.8: "rgba(255,98,4,1)",
					1: "rgba(236,220,79,1)"
				},
				value: function (index, feature) {
					return feature.properties.count
				},
				min: 0,
				max: 10,
				heightBezier: [0, 0.53, 0.37, 0.98]
			})
			loca.add(heatmap)

			let pointColors = ["#F4A49E", "#EE7B91", "#E85285", "#BE408C", "#942D93", "#6A1B9A", "#56167D", "#42105F"].reverse()
			let scatter = new Loca.ScatterLayer({
				loca: loca,
				zIndex: 9,
				zooms: [14, 22],
				opacity: 1
			})
			scatter.setSource(geo)
			scatter.setStyle({
				unit: "meter",
				size: [80, 80],
				color: function (index, feat) {
					const count = parseInt((feat.properties.count * 10).toString(), 10)
					return pointColors[count % pointColors.length]
				}
			})
			// 淡入淡出
			map.on("viewchange", function () {
				let z = map.getZoom()
				let outZ = 18
				// 14 - 16 级别淡出
				heatmap.setOpacity(1 - (z - 14) / (outZ - 14))
				// 圆点
				scatter.setOpacity((z - 14) / (14.3 - 14))
			})

			let text = new AMap.Text({
				text: "纯文本标记",
				anchor: "center", // 设置文本标记锚点
				draggable: true,
				cursor: "pointer",
				angle: 0,
				visible: false,
				offset: [0, -25],
				style: {
					padding: ".45rem 0.15rem",
					"margin-bottom": "1rem",
					"border-radius": ".25rem",
					"background-color": "rgba(0,0,0,0.5)",
					width: "15rem",
					"border-width": 0,
					"box-shadow": "0 2px 6px 0 rgba(255, 255, 255, .3)",
					"text-align": "center",
					"font-size": "15px",
					color: "#fff"
				}
			})
			text.setMap(map)
			map.on("mousemove", function (e) {
				let selectPoint = scatter.queryFeature(e.pixel.toArray())
				if (selectPoint) {
					text.show()
					let count = selectPoint.properties.count
					text.setText("Housing sales volume：" + parseInt((count * 10).toString(), 10) + " sets")
					text.setPosition(e.lnglat)
				} else {
					text.hide()
				}
			})
			map.on("click", function () {
				heatmap.addAnimate({
					key: "radius",
					value: [0, 1],
					duration: 2000,
					easing: "BackOut",
					// 开启随机动画
					transform: 1000,
					random: true,
					delay: 5000
				})
			})
		})
		.catch(e => {
			console.log(e)
		})
}
</script>

<style lang="scss" scoped>
.container {
	height: 100%;
	width: 100%;
	display: flex;

	.map {
		height: 100%;
		width: 100%;
	}

	.btn {
		width: 320px;
		padding: 10px;
		display: flex;
		flex-direction: column;

		.el-button {
			margin: 0 0 5px 0;
		}
	}
}
</style>
