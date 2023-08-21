<template>
	<div class="main">
		<div class="btnList">
			<el-select v-model="type" placeholder="Select">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
		</div>
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import Draw from "ol/interaction/Draw.js"
import GeoJSON from "ol/format/GeoJSON.js"
import Map from "ol/Map.js"
import Snap from "ol/interaction/Snap.js"
import TileLayer from "ol/layer/WebGLTile.js"
import VectorLayer from "ol/layer/Vector.js"
import VectorSource from "ol/source/Vector.js"
import View from "ol/View.js"
import { OSM } from "ol/source.js"

const options = [
	{
		value: "Polygon",
		label: "Polygon"
	},
	{
		value: "LineString",
		label: "LineString"
	},
	{
		value: "None",
		label: "None"
	}
]
const type = ref("Polygon")

const raster = new TileLayer({
	source: new OSM()
})

const baseVector = new VectorLayer({
	source: new VectorSource({
		format: new GeoJSON(),
		url: "./json/fire.json"
	}),
	style: {
		"fill-color": "rgba(255, 0, 0, 0.3)",
		"stroke-color": "rgba(255, 0, 0, 0.9)",
		"stroke-width": 0.5
	}
})

const drawVector = new VectorLayer({
	source: new VectorSource(),
	style: {
		"stroke-color": "rgba(100, 255, 0, 1)",
		"stroke-width": 2,
		"fill-color": "rgba(100, 255, 0, 0.3)"
	}
})

const snapInteraction = new Snap({
	source: baseVector.getSource()
})

let drawInteraction
let map
onMounted(() => {
	map = new Map({
		layers: [raster, baseVector, drawVector],
		target: "map",
		view: new View({
			center: [-13378949, 5943751],
			zoom: 11
		})
	})
	addInteraction()
})

watch(
	() => type.value,
	() => {
		map.removeInteraction(drawInteraction)
		map.removeInteraction(snapInteraction)
		addInteraction()
	}
)

function addInteraction() {
	if (type.value !== "None") {
		drawInteraction = new Draw({
			type: type.value as any,
			source: drawVector.getSource(),
			trace: true,
			traceSource: baseVector.getSource(),
			style: {
				"stroke-color": "rgba(255, 255, 100, 0.5)",
				"stroke-width": 1.5,
				"fill-color": "rgba(255, 255, 100, 0.25)",
				"circle-radius": 6,
				"circle-fill-color": "rgba(255, 255, 100, 0.5)"
			}
		})
		map.addInteraction(drawInteraction)
		map.addInteraction(snapInteraction)
	}
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

.el-button {
	margin: 5px;
}
</style>
