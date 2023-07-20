<template>
	<div class="main">
		<div class="btnList">
			<el-select v-model="type" class="m-2" placeholder="Select" size="large" @change="addInteraction">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
		</div>
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import Draw from "ol/interaction/Draw.js"
import Map from "ol/Map.js"
import View from "ol/View.js"
import { OSM, Vector as VectorSource } from "ol/source.js"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js"

onMounted(() => {
	initMap()
})

let map: Map
const type = ref("LineString")
const options = [
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
	},
	{
		value: "None",
		label: "None"
	}
]

const raster = new TileLayer({
	source: new OSM()
})

const source = new VectorSource({ wrapX: false })

const vector = new VectorLayer({
	source: source
})

const initMap = () => {
	map = new Map({
		target: "map",
		view: new View({
			center: [-11000000, 4600000],
			zoom: 4
		}),
		layers: [raster, vector]
	})

	addInteraction()
}

let draw: Draw
const addInteraction = () => {
	if (draw) {
		map.removeInteraction(draw)
		draw = null
	}
	if (type.value !== "None") {
		draw = new Draw({
			source: source,
			type: type.value as any,
			freehand: true
		})
		map.addInteraction(draw)
	}
}

const changeType = e => {
	addInteraction()
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
