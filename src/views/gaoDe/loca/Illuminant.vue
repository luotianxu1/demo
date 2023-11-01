<template>
	<div class="container">
		<div id="map" class="map"></div>
	</div>
</template>

<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"
import * as turf from "@turf/turf"

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
				zoom: 16,
				viewMode: "3D",
				pitch: 62.489,
				rotation: 300.3,
				mapStyle: "amap://styles/dark",
				center: [116.45916, 39.917359],
				showBuildingBlock: false
			})

			loca = new Loca.Container({
				map: map
			})

			// 建筑物
			let geo = new Loca.GeoJSONSource({
				url: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/guomao.geojson"
			})
			let pl = new Loca.PolygonLayer({
				zIndex: 120,
				shininess: 10,
				hasSide: true
			})
			pl.setSource(geo)
			pl.setStyle({
				// 顶面
				topColor: "rgba(16,128,165,1)",
				// 侧顶面
				sideTopColor: "rgba(13,43,90,1)",
				// 侧底面
				sideBottomColor: "rgba(24,212,255,1)",

				unit: "meter",
				height: function (index, feature) {
					let v = feature.properties.h
					return v
				},
				altitude: 0
			})
			pl.setCustomCenter([116.458657, 39.914862])
			loca.add(pl)

			// 环境光1
			let ambLight = new Loca.AmbientLight({
				intensity: 0.5,
				color: "#fff"
			})
			// 点光源
			let pointLight1 = new Loca.PointLight({
				color: "rgb(11,255,241)",
				position: [116.455825, 39.916603, 0],
				intensity: 5,
				distance: 500
			})
			let pointLight2 = new Loca.PointLight({
				color: "rgb(255,75,0)",
				position: [116.456598, 39.923482, 400],
				intensity: 10,
				distance: 1500
			})
			let pointLight3 = new Loca.PointLight({
				color: "#f21da7",
				position: [116.455546, 39.90867, 400],
				intensity: 10,
				distance: 1500
			})
			// 平行光1
			let dirLight1 = new Loca.DirectionalLight({
				intensity: 0.6,
				color: "#abffc8",
				target: [0, 0, 0],
				position: [0, 3, 6]
			})
			let dirLight2 = new Loca.DirectionalLight({
				intensity: 0.6,
				color: "#5d8cff",
				target: [0, 0, 0],
				position: [0, 13, 13]
			})
			loca.addLight(ambLight)
			loca.addLight(dirLight1)
			loca.addLight(dirLight2)
			loca.addLight(pointLight1)
			loca.addLight(pointLight2)
			loca.addLight(pointLight3)

			// 展示光源位置
			let lightIcon = new AMap.Icon({
				image: "https://a.amap.com/Loca/static/loca-v2/demos/images/light.png",
				imageSize: new AMap.Size(40, 40)
			})
			let pointLight1Marker = new AMap.Marker({
				position: [116.455825, 39.916603, 10],
				icon: lightIcon,
				anchor: "bottom-center"
			})
			let pointLight2Marker = new AMap.Marker({
				position: [116.456598, 39.923482, 400],
				icon: lightIcon,
				anchor: "bottom-center"
			})
			let pointLight3Marker = new AMap.Marker({
				position: [116.455546, 39.90867, 400],
				icon: lightIcon,
				anchor: "bottom-center"
			})
			map.add(pointLight1Marker)
			map.add(pointLight2Marker)
			map.add(pointLight3Marker)

			// 点光源位置改变
			let time = 0
			let radius = 0.8
			let height = 400
			let centerPoint = turf.point([116.455825, 39.916603])
			function changeLight() {
				time++
				let pos = turf.transformTranslate(centerPoint, radius, time).geometry.coordinates
				let pos2 = turf.transformTranslate(centerPoint, radius, time + 180).geometry.coordinates
				pointLight2Marker.setPosition([pos[0], pos[1], height])
				pointLight2.position = [pos[0], pos[1], height]

				pointLight3Marker.setPosition([pos2[0], pos2[1], height])
				pointLight3.position = [pos2[0], pos2[1], height]

				// 中心点光源
				let t = (time * 4) % (height * 2)
				let point1Center = [116.455825, 39.916603, t > height ? height * 2 - t : t]
				pointLight1Marker.setPosition(point1Center)
				pointLight1.position = point1Center

				requestAnimationFrame(function () {
					changeLight()
				})
			}
			changeLight()
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
