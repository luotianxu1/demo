<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="zoomtoswitzerland">缩放到瑞士</el-button>
			<el-button type="primary" @click="zoomtolausanne">缩放到洛桑</el-button>
			<el-button type="primary" @click="centerlausanne">中心点</el-button>
		</div>
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import Map from "ol/Map.js"
import View from "ol/View.js"
import { OSM, Vector as VectorSource } from "ol/source.js"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js"
import GeoJSON from "ol/format/GeoJSON.js"

onMounted(() => {
	initMap()
})

let map
const source = new VectorSource({
	url: "./geojson/switzerland.geojson",
	format: new GeoJSON()
})
const vectorLayer = new VectorLayer({
	source: source,
	style: {
		"fill-color": "rgba(255, 255, 255, 0.6)",
		"stroke-width": 1,
		"stroke-color": "#319FD3",
		"circle-radius": 5,
		"circle-fill-color": "rgba(255, 255, 255, 0.6)",
		"circle-stroke-width": 1,
		"circle-stroke-color": "#319FD3"
	}
})
const view = new View({
	center: [0, 0],
	zoom: 1
})

const initMap = () => {
	map = new Map({
		target: "map",
		view: view,
		layers: [
			new TileLayer({
				source: new OSM()
			}),
			vectorLayer
		]
	})
}

const zoomtoswitzerland = () => {
	const feature = source.getFeatures()[0]
	const polygon: any = feature.getGeometry()
	view.fit(polygon, { padding: [170, 50, 30, 150] })
}

const zoomtolausanne = () => {
	const feature = source.getFeatures()[1]
	const point: any = feature.getGeometry()
	view.fit(point, { padding: [170, 50, 30, 150], minResolution: 50 })
}

const centerlausanne = () => {
	const feature = source.getFeatures()[1]
	const point: any = feature.getGeometry()
	const size = map.getSize()
	view.centerOn(point.getCoordinates(), size, [570, 500])
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
		padding: 10px;
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
