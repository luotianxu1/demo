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
				zoom: 13.12,
				showLabel: false,
				viewMode: "3D",
				center: [116.316348, 39.992875],
				mapStyle: "amap://styles/dark"
			})
			loca = new Loca.Container({
				map: map
			})

			let labelsLayer = new Loca.LabelsLayer({
				zooms: [10, 20]
			})
			let geo = new Loca.GeoJSONSource({
				url: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/charging_pile.json"
			})
			labelsLayer.setSource(geo)

			// labelsLayer.setStyle的配置项即AMap.LabelMarker的配置项
			labelsLayer.setStyle({
				icon: {
					type: "image",
					image: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/charging_pile.png",
					size: [48, 75],
					anchor: "center"
				},
				text: {
					// 每项配置都可使用回调函数来动态配置
					content: (index, feat) => {
						return feat.properties.name
					},
					style: {
						fontSize: 12,
						fontWeight: "normal",
						fillColor: "#5CDE8E",
						strokeColor: "#000",
						strokeWidth: 2
					},
					direction: "bottom"
				},
				extData: (index, feat) => {
					return feat.properties
				}
			})
			loca.add(labelsLayer)

			labelsLayer.on("complete", () => {
				let normalMarker = new AMap.Marker({
					offset: [70, -15]
				})
				let labelMarkers = labelsLayer.getLabelsLayer().getAllOverlays()
				for (let marker of labelMarkers) {
					marker.on("mouseover", e => {
						let position = e.data.data && e.data.data.position

						if (position) {
							normalMarker.setContent('<div class="amap-info-window">地址：' + marker.getExtData().address + "</div>")
							normalMarker.setPosition(position)
							map.add(normalMarker)
						}
					})
					marker.on("mouseout", () => {
						map.remove(normalMarker)
					})
				}
			})
		})
		.catch(e => {
			console.log(e)
		})
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
}

:deep(.amap-info-window) {
	position: relative;
	width: 150px;
	padding: 3px 7px;
	font-size: 12px;
	background: #fff;
	border-radius: 3px;
	box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
}
</style>
