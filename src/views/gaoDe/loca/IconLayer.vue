<template>
	<div class="container">
		<div id="map" class="map"></div>
	</div>
</template>

<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"
import { events } from "./data/event"

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
				zoom: 10,
				viewMode: "3D",
				center: [116.398063, 39.988207], //北京
				mapStyle: "amap://styles/dark"
			})
			loca = new Loca.Container({
				map: map
			})

			let data = getEventsCollection()
			let geo = new Loca.GeoJSONSource({
				data: data
			})

			let layer = new Loca.IconLayer({
				zIndex: 10,
				opacity: 1,
				visible: false
			})

			let trafficIcons = {
				1: "https://a.amap.com/Loca/static/loca-v2/demos/images/traffic-control.png",
				2: "https://a.amap.com/Loca/static/loca-v2/demos/images/jam.png",
				3: "https://a.amap.com/Loca/static/loca-v2/demos/images/construction.png",
				4: "https://a.amap.com/Loca/static/loca-v2/demos/images/close.png",
				5: "https://a.amap.com/Loca/static/loca-v2/demos/images/fog.png",
				0: "https://a.amap.com/Loca/static/loca-v2/demos/images/accident.png"
			}
			layer.setSource(geo)
			layer.setStyle({
				unit: "px",
				icon: (index, feature) => {
					let data = feature.properties.rawData
					let url = trafficIcons[data.type % Object.keys(trafficIcons).length]
					return url
				},
				iconSize: [40, 40],
				offset: [0, -40],
				rotation: 0
			})

			loca.add(layer)
			map.on("complete", function () {
				setTimeout(function () {
					layer.show()
					layer.addAnimate({
						key: "offset",
						value: [0, 1],
						easing: "Linear",
						transform: 500,
						random: true,
						delay: 9000
					})
					layer.addAnimate({
						key: "iconSize",
						value: [0, 1],
						easing: "Linear",
						transform: 500,
						random: true,
						delay: 9000
					})
				}, 800)
			})
			loca.animate.start()

			// 拾取测试
			map.on("click", e => {
				const feat = layer.queryFeature(e.pixel.toArray())
				if (feat) {
					layer.setStyle({
						unit: "px",
						icon: (index, feature) => {
							let data = feature.properties.rawData
							let url = trafficIcons[data.type % Object.keys(trafficIcons).length]
							return url
						},
						iconSize: (i, feature) => {
							if (feature === feat) {
								return [60, 60]
							}
							return [40, 40]
						}
					})
				}
			})
		})
		.catch(e => {
			console.log(e)
		})
}

function getEventsCollection() {
	let _events = events[0].events
	let list = _events.map(e => {
		let ll = e.lngLat.split(",")
		let arr = [parseFloat(ll[0]), parseFloat(ll[1])]
		return {
			type: "Feature",
			properties: {
				rawData: e
			},
			geometry: {
				type: "Point",
				coordinates: arr
			}
		}
	})

	let data = {
		type: "FeatureCollection",
		features: list
	}
	return data
}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	width: 100%;
	height: 100%;

	.map {
		width: 100%;
		height: 100%;
	}

	.btn {
		display: flex;
		width: 320px;
		padding: 10px;
		flex-direction: column;

		.el-button {
			margin: 0 0 5px 0;
		}
	}
}
</style>
