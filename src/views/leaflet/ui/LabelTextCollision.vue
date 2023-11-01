<template>
	<div class="main">
		<div class="btnList">
			<el-switch v-model="isCollision" inline-prompt active-text="避让" inactive-text="不避让" @change="changeCollisionHandle" />
		</div>
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import "@utils/leaflet/L.LabelTextCollision.js"

const isCollision = ref(true)

let map: L.Map | null = null
let labelTextCollision: any
onMounted(() => {
	labelTextCollision = new (L as any).LabelTextCollision({
		collisionFlg: true
	})

	map = L.map("map", {
		renderer: labelTextCollision
	})

	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [39.905963, 116.390813]
	map.setView(center_point, 10)

	L.polyline(
		[
			[39.695786, 116.749213],
			[39.696786, 116.748213],
			[39.695786, 116.747213]
		],
		{
			weight: 12,
			color: "#fe57a1",
			text: "Leaflet.LabelTextCollision!!!!!!!!",
			textStyle: {
				stroke: true,
				color: "#ff0000",
				font: "16px 'Microsoft Yahei'"
			}
		} as any
	).addTo(map)
	let layers = L.featureGroup().addTo(map)

	for (let i = 0; i < 10000; i++) {
		//最高可到5万左右
		let lat = 39.905963 + (Math.random() - Math.random()) * 3
		let lng = 116.390813 + (Math.random() - Math.random()) * 3
		let latlng = L.latLng(lat, lng)
		let c = L.circleMarker(latlng, {
			radius: 5,
			text: latlng.toString(),
			textStyle: {
				stroke: true,
				color: "#3388ff",
				font: "15px 'Microsoft Yahei'",
				offsetX: -70,
				offsetY: -10
			}
		} as any)
		layers.addLayer(c)
	}
})

const changeCollisionHandle = () => {
	labelTextCollision.options.collisionFlg = isCollision.value
}
</script>
<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100%;

	.btnList {
		display: flex;
		width: 255px;
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
