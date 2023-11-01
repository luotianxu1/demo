<template>
	<div class="main">
		<div class="btnList">
			<el-select v-model="typeSelect" placeholder="Select">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
		</div>
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import Draw from "ol/interaction/Draw.js"
import Map from "ol/Map.js"
import Overlay from "ol/Overlay.js"
import View from "ol/View.js"
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js"
import { LineString, Polygon } from "ol/geom.js"
import { OSM, Vector as VectorSource } from "ol/source.js"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js"
import { getArea, getLength } from "ol/sphere.js"
import { unByKey } from "ol/Observable.js"

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

let map
let sketch
let helpTooltipElement
let helpTooltip
let measureTooltipElement
let measureTooltip
const continuePolygonMsg = "单击以继续绘制多边形"
const continueLineMsg = "单击以继续绘制线条"

onMounted(() => {
	map = new Map({
		layers: [raster, vector],
		target: "map",
		view: new View({
			center: [-11000000, 4600000],
			zoom: 15
		})
	})

	map.on("pointermove", pointerMoveHandler)

	map.getViewport().addEventListener("mouseout", function () {
		helpTooltipElement.classList.add("hidden")
	})

	addInteraction()
})

const options = [
	{
		value: "area",
		label: "Polygon"
	},
	{
		value: "length",
		label: "LineString"
	}
]
const typeSelect = ref("LineString")
watch(
	() => typeSelect.value,
	() => {
		map.removeInteraction(draw)
		addInteraction()
	}
)

const pointerMoveHandler = function (evt) {
	if (evt.dragging) {
		return
	}
	let helpMsg = "点击开始绘图"

	if (sketch) {
		const geom = sketch.getGeometry()
		if (geom instanceof Polygon) {
			helpMsg = continuePolygonMsg
		} else if (geom instanceof LineString) {
			helpMsg = continueLineMsg
		}
	}

	helpTooltipElement.innerHTML = helpMsg
	helpTooltip.setPosition(evt.coordinate)

	helpTooltipElement.classList.remove("hidden")
}

let draw
const formatLength = function (line) {
	const length = getLength(line)
	let output
	if (length > 100) {
		output = Math.round((length / 1000) * 100) / 100 + " " + "km"
	} else {
		output = Math.round(length * 100) / 100 + " " + "m"
	}
	return output
}

const formatArea = function (polygon) {
	const area = getArea(polygon)
	let output
	if (area > 10000) {
		output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>"
	} else {
		output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>"
	}
	return output
}

const style = new Style({
	fill: new Fill({
		color: "rgba(255, 255, 255, 0.2)"
	}),
	stroke: new Stroke({
		color: "rgba(0, 0, 0, 0.5)",
		lineDash: [10, 10],
		width: 2
	}),
	image: new CircleStyle({
		radius: 5,
		stroke: new Stroke({
			color: "rgba(0, 0, 0, 0.7)"
		}),
		fill: new Fill({
			color: "rgba(255, 255, 255, 0.2)"
		})
	})
})

function addInteraction() {
	const type = typeSelect.value === "area" ? "Polygon" : "LineString"
	draw = new Draw({
		source: source,
		type: type,
		style: function (feature) {
			const geometryType = feature.getGeometry().getType()
			if (geometryType === type || geometryType === "Point") {
				return style
			}
		}
	})
	map.addInteraction(draw)

	createMeasureTooltip()
	createHelpTooltip()

	let listener
	draw.on("drawstart", function (evt) {
		sketch = evt.feature

		let tooltipCoord = evt.coordinate

		listener = sketch.getGeometry().on("change", function (evt) {
			const geom = evt.target
			let output
			if (geom instanceof Polygon) {
				output = formatArea(geom)
				tooltipCoord = geom.getInteriorPoint().getCoordinates()
			} else if (geom instanceof LineString) {
				output = formatLength(geom)
				tooltipCoord = geom.getLastCoordinate()
			}
			measureTooltipElement.innerHTML = output
			measureTooltip.setPosition(tooltipCoord)
		})
	})

	draw.on("drawend", function () {
		measureTooltipElement.className = "ol-tooltip ol-tooltip-static"
		measureTooltip.setOffset([0, -7])
		sketch = null
		measureTooltipElement = null
		createMeasureTooltip()
		unByKey(listener)
	})
}

function createHelpTooltip() {
	if (helpTooltipElement) {
		helpTooltipElement.parentNode.removeChild(helpTooltipElement)
	}
	helpTooltipElement = document.createElement("div")
	helpTooltipElement.className = "ol-tooltip hidden"
	helpTooltip = new Overlay({
		element: helpTooltipElement,
		offset: [15, 0],
		positioning: "center-left"
	})
	map.addOverlay(helpTooltip)
}

function createMeasureTooltip() {
	if (measureTooltipElement) {
		measureTooltipElement.parentNode.removeChild(measureTooltipElement)
	}
	measureTooltipElement = document.createElement("div")
	measureTooltipElement.className = "ol-tooltip ol-tooltip-measure"
	measureTooltip = new Overlay({
		element: measureTooltipElement,
		offset: [0, -15],
		positioning: "bottom-center",
		stopEvent: false,
		insertFirst: false
	})
	map.addOverlay(measureTooltip)
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

:deep(.ol-tooltip) {
	position: relative;
	padding: 4px 8px;
	font-size: 12px;
	color: white;
	white-space: nowrap;
	cursor: default;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 4px;
	opacity: 0.7;
	user-select: none;
}

:deep(.ol-tooltip-measure) {
	font-weight: bold;
	opacity: 1;
}

:deep(.ol-tooltip-static) {
	color: black;
	background-color: #fc3;
	border: 1px solid white;
}

:deep(.ol-tooltip-measure::before, .ol-tooltip-static::before) {
	position: absolute;
	bottom: -6px;
	left: 50%;
	margin-left: -7px;
	border-top: 6px solid rgba(0, 0, 0, 0.5);
	border-right: 6px solid transparent;
	border-left: 6px solid transparent;
	content: "";
}

:deep(.ol-tooltip-static::before) {
	border-top-color: #fc3;
}
</style>
