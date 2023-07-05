<template>
	<div class="main">
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import Map from "ol/Map"
import TileLayer from "ol/layer/Tile"
import View from "ol/View"
import OSM from "ol/source/OSM"
import ImageLayer from "ol/layer/Image"
import Projection from "ol/proj/Projection"
import Static from "ol/source/ImageStatic"
import { getCenter } from "ol/extent"

onMounted(() => {
	initMap()
})

let map
let view
const extent = [0, 0, 1024, 968]
const projection = new Projection({
	code: "xkcd-image",
	units: "pixels",
	extent: extent
})

const initMap = () => {
	view = new View({
		center: getCenter(extent),
		zoom: 2,
		maxZoom: 8,
		projection: projection
	})
	map = new Map({
		target: "map",
		layers: [
			// new TileLayer({
			// 	source: new OSM()
			// }),
			new ImageLayer({
				source: new Static({
					attributions: '© <a href="https://xkcd.com/license.html">xkcd</a>',
					url: "https://imgs.xkcd.com/comics/online_communities.png",
					projection: projection,
					imageExtent: extent
				})
			})
		],
		view: view
	})
}
</script>

<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100vh;
	display: flex;

	.map {
		flex: 1;
	}
}
</style>
