<template>
	<div class="main">
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import Map from "ol/Map"
import TileLayer from "ol/layer/Tile"
import View from "ol/View"
import { get as getProjection } from "ol/proj"
import { getTopLeft, getWidth } from "ol/extent"
import OSM from "ol/source/OSM"
import WMTS from "ol/source/WMTS"
import WMTSTileGrid from "ol/tilegrid/WMTS"

onMounted(() => {
	initMap()
})

let map
let view

const projection = getProjection("EPSG:3857")
const projectionExtent = projection.getExtent()
const size = getWidth(projectionExtent) / 256
const resolutions = new Array(19)
const matrixIds = new Array(19)
for (let z = 0; z < 19; ++z) {
	// generate resolutions and matrixIds arrays for this WMTS
	resolutions[z] = size / Math.pow(2, z)
	matrixIds[z] = z
}

const initMap = () => {
	view = new View({
		center: [-11158582, 4813697],
		zoom: 4
	})
	map = new Map({
		target: "map",
		layers: [
			new TileLayer({
				source: new OSM()
			}),
			new TileLayer({
				opacity: 0.7,
				source: new WMTS({
					attributions: 'Tiles © <a href="https://mrdata.usgs.gov/geology/state/"' + ' target="_blank">USGS</a>',
					url: "https://mrdata.usgs.gov/mapcache/wmts",
					layer: "sgmc2",
					matrixSet: "GoogleMapsCompatible",
					format: "image/png",
					projection: projection,
					tileGrid: new WMTSTileGrid({
						origin: getTopLeft(projectionExtent),
						resolutions: resolutions,
						matrixIds: matrixIds
					}),
					style: "default",
					wrapX: true
				})
			})
		],
		view: view
	})
}
</script>

<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100vh;

	.map {
		flex: 1;
	}
}
</style>
