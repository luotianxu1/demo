<template>
	<div id="map"></div>
</template>

<script lang="ts" setup>
import Feature from "ol/Feature.js"
import Map from "ol/Map.js"
import Point from "ol/geom/Point.js"
import Select from "ol/interaction/Select.js"
import Stamen from "ol/source/Stamen.js"
import VectorSource from "ol/source/Vector.js"
import View from "ol/View.js"
import { Icon, Style } from "ol/style.js"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js"

let map

onMounted(() => {
	initMap()
})

const initMap = () => {
	map = new Map({
		layers: [
			new TileLayer({
				source: new Stamen({ layer: "watercolor" })
			}),
			new VectorLayer({
				style: function (feature) {
					return feature.get("style")
				},
				source: new VectorSource({ features: [iconFeature] })
			})
		],
		target: document.getElementById("map"),
		view: new View({
			center: [0, 0],
			zoom: 3
		})
	})

	map.addInteraction(select)
	map.on("pointermove", function (evt) {
		map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? "pointer" : ""
	})
}

const createStyle = (src, img) => {
	return new Style({
		image: new Icon({
			anchor: [0.5, 0.96],
			crossOrigin: "anonymous",
			src: src,
			img: img,
			imgSize: img ? [img.width, img.height] : undefined
		})
	})
}

const iconFeature = new Feature(new Point([0, 0]))
iconFeature.set("style", createStyle("/public/img/map/icon.png", undefined))

const selectStyle = {}
const select = new Select({
	style: function (feature) {
		const image = feature.get("style").getImage().getImage()
		if (!selectStyle[image.src]) {
			const canvas = document.createElement("canvas")
			const context = canvas.getContext("2d")
			canvas.width = image.width
			canvas.height = image.height
			context.drawImage(image, 0, 0, image.width, image.height)
			const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
			const data = imageData.data
			for (let i = 0, ii = data.length; i < ii; i = i + (i % 4 === 2 ? 2 : 1)) {
				data[i] = 255 - data[i]
			}
			context.putImageData(imageData, 0, 0)
			selectStyle[image.src] = createStyle(undefined, canvas)
		}
		return selectStyle[image.src]
	}
})
</script>

<style lang="scss" scoped>
#map {
	width: 100vw;
	height: 100vh;
}
</style>
