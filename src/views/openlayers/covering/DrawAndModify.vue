<template>
	<div class="main">
		<div class="btnList">
			<el-select v-model="typeSelect" placeholder="Select" size="large" @change="changeType">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
		</div>
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import Map from "ol/Map.js"
import View from "ol/View.js"
import { Draw, Modify, Snap } from "ol/interaction.js"
import { OSM, Vector as VectorSource } from "ol/source.js"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js"
import { get } from "ol/proj.js"

onMounted(() => {
	initMap()
})

let map

const raster = new TileLayer({
	source: new OSM()
})

const source = new VectorSource()
const vector = new VectorLayer({
	source: source,
	style: {
		"fill-color": "rgba(255, 255, 255, 0.2)",
		"stroke-color": "#ffcc33",
		"stroke-width": 2,
		"circle-radius": 7,
		"circle-fill-color": "#ffcc33"
	}
})

const extent = get("EPSG:3857").getExtent().slice()
extent[0] += extent[0]
extent[2] += extent[2]

const modify = new Modify({ source: source })

const initMap = () => {
	map = new Map({
		target: "map",
		layers: [raster, vector],
		view: new View({
			center: [-11000000, 4600000],
			zoom: 4,
			extent
		})
	})

	map.addInteraction(modify)
	addInteractions()
}

let draw, snap
const options = [
	{
		value: "Point",
		label: "Point"
	},
	{
		value: "LineString",
		label: "LineString"
	},
	{
		value: "Polygon",
		label: "Polygon"
	},
	{
		value: "Circle",
		label: "Circle"
	}
]
const typeSelect = ref("Point")
const addInteractions = () => {
	draw = new Draw({
		source: source,
		type: typeSelect.value as any
	})
	map.addInteraction(draw)
	snap = new Snap({ source: source })
	map.addInteraction(snap)
}

const changeType = e => {
	map.removeInteraction(draw)
	map.removeInteraction(snap)
	addInteractions()
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
	}

	.map {
		flex: 1;
	}
}
</style>
