<template>
	<div class="main">
		<div class="btnList">
			<el-slider v-model="value" @change="change" />
		</div>
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import Map from "ol/Map.js"
import OSM from "ol/source/OSM.js"
import TileLayer from "ol/layer/Tile.js"
import View from "ol/View.js"
import WMTS from "ol/source/WMTS.js"
import WMTSTileGrid from "ol/tilegrid/WMTS.js"
import { get as getProjection } from "ol/proj.js"
import { getTopLeft, getWidth } from "ol/extent.js"

onMounted(() => {
	initMap()
})

let map
const value = ref(0)

const scalgoToken = "CC5BF28A7D96B320C7DFBFD1236B5BEB"
const projection: any = getProjection("EPSG:3857")
const tileSizePixels = 256
const tileSizeMtrs = getWidth(projection.getExtent()) / tileSizePixels
const matrixIds: any = []
const resolutions: any = []
for (let i = 0; i <= 14; i++) {
	matrixIds[i] = i
	resolutions[i] = tileSizeMtrs / Math.pow(2, i)
}
const tileGrid = new WMTSTileGrid({
	origin: getTopLeft(projection.getExtent()),
	resolutions: resolutions,
	matrixIds: matrixIds
})
const wmtsSource = new WMTS({
	url: "https://ts2.scalgo.com/olpatch/wmts?token=" + scalgoToken,
	layer: "SRTM_4_1:SRTM_4_1_flooded_sealevels",
	format: "image/png",
	matrixSet: "EPSG:3857",
	attributions: [
		'<a href="https://scalgo.com" target="_blank">SCALGO</a>',
		'<a href="https://cgiarcsi.community/data/' +
			'srtm-90m-digital-elevation-database-v4-1"' +
			' target="_blank">CGIAR-CSI SRTM</a>'
	],
	tileGrid: tileGrid,
	style: "default",
	dimensions: {
		threshold: 100
	}
})

const initMap = () => {
	map = new Map({
		target: "map",
		view: new View({
			projection: projection,
			center: [-9871995, 3566245],
			zoom: 6
		}),
		layers: [
			new TileLayer({
				source: new OSM()
			}),
			new TileLayer({
				opacity: 0.5,
				source: wmtsSource
			})
		]
	})
	wmtsSource.updateDimensions({ threshold: 10 })
}

const change = value => {
	wmtsSource.updateDimensions({ threshold: value })
}
</script>

<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100vh;
	display: flex;

	.btnList {
		width: 150px;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		overflow: auto;
		padding: 10px;
	}

	.map {
		flex: 1;
	}
}
</style>
