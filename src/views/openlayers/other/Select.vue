<template>
	<div class="main">
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import GeoJSON from "ol/format/GeoJSON.js"
import Map from "ol/Map.js"
import VectorLayer from "ol/layer/Vector.js"
import VectorSource from "ol/source/Vector.js"
import View from "ol/View.js"
import { DragBox, Select } from "ol/interaction.js"
import { Fill, Stroke, Style } from "ol/style.js"
import { platformModifierKeyOnly } from "ol/events/condition.js"
import { getWidth } from "ol/extent.js"

onMounted(() => {
	initMap()
})

let map

const vectorSource = new VectorSource({
	url: "https://openlayers.org/data/vector/ecoregions.json",
	format: new GeoJSON()
})

const style = new Style({
	fill: new Fill({
		color: "#eeeeee"
	})
})

const initMap = () => {
	map = new Map({
		target: "map",
		view: new View({
			center: [0, 0],
			zoom: 2,
			constrainRotation: 16
		}),
		layers: [
			new VectorLayer({
				source: vectorSource,
				background: "#1a2b39",
				style: function (feature) {
					const color = feature.get("COLOR_BIO") || "#eeeeee"
					style.getFill().setColor(color)
					return style
				}
			})
		]
	})

	map.addInteraction(select)
	map.addInteraction(dragBox)
}

const selectedStyle = new Style({
	fill: new Fill({
		color: "rgba(255, 255, 255, 0.6)"
	}),
	stroke: new Stroke({
		color: "rgba(255, 255, 255, 0.7)",
		width: 2
	})
})

const select = new Select({
	style: function (feature) {
		const color = feature.get("COLOR_BIO") || "#eeeeee"
		selectedStyle.getFill().setColor(color)
		return selectedStyle
	}
})

const selectedFeatures = select.getFeatures()
selectedFeatures.on(["add", "remove"], function () {
	const names = selectedFeatures.getArray().map(feature => {
		return feature.get("ECO_NAME")
	})
	if (names.length > 0) {
		console.log(names)
	}
})

const dragBox = new DragBox({
	condition: platformModifierKeyOnly
})
dragBox.on("boxend", function () {
	const boxExtent = dragBox.getGeometry().getExtent()

	const worldExtent = map.getView().getProjection().getExtent()
	const worldWidth = getWidth(worldExtent)
	const startWorld = Math.floor((boxExtent[0] - worldExtent[0]) / worldWidth)
	const endWorld = Math.floor((boxExtent[2] - worldExtent[0]) / worldWidth)

	for (let world = startWorld; world <= endWorld; ++world) {
		const left = Math.max(boxExtent[0] - world * worldWidth, worldExtent[0])
		const right = Math.min(boxExtent[2] - world * worldWidth, worldExtent[2])
		const extent = [left, boxExtent[1], right, boxExtent[3]]

		const boxFeatures = vectorSource
			.getFeaturesInExtent(extent)
			.filter(feature => !selectedFeatures.getArray().includes(feature) && feature!.getGeometry()!.intersectsExtent(extent))

		const rotation = map.getView().getRotation()
		const oblique = rotation % (Math.PI / 2) !== 0

		if (oblique) {
			const anchor = [0, 0]
			const geometry = dragBox.getGeometry().clone()
			geometry.translate(-world * worldWidth, 0)
			geometry.rotate(-rotation, anchor)
			const extent = geometry.getExtent()
			boxFeatures.forEach(function (feature) {
				const geometry = feature.getGeometry()!.clone()
				geometry.rotate(-rotation, anchor)
				if (geometry.intersectsExtent(extent)) {
					selectedFeatures.push(feature)
				}
			})
		} else {
			selectedFeatures.extend(boxFeatures)
		}
	}
})
dragBox.on("boxstart", function () {
	selectedFeatures.clear()
})
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
