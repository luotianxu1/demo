<template>
	<div class="main">
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import Map from "ol/Map"
import Tile from "ol/layer/Tile" // 瓦片加载器
import XYZ from "ol/source/XYZ" // 引入XYZ地图格式
import View from "ol/View"
import CircleStyle from "ol/style/Circle"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"
import Fill from "ol/style/Fill"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"

onMounted(() => {
	initMap()
})

let map
let view
let vectorLayer
const Map_vec = new Tile({
	source: new XYZ({
		url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
		wrapX: false
	})
})

const initMap = () => {
	view = new View({
		center: [12950000, 4860000], // 中心点坐标
		zoom: 6
	})
	map = new Map({
		target: "map",
		layers: [Map_vec],
		view: view
	})

	loadVectData()
}

const image = new CircleStyle({
	radius: 5,
	stroke: new Stroke({ color: "red", width: 1 })
})
const styles = {
	Point: [
		new Style({
			//点样式
			image: image
		})
	],
	LineString: [
		new Style({
			stroke: new Stroke({
				//线的边界样式
				color: "green",
				width: 1
			})
		})
	],
	MultiLineString: [
		new Style({
			stroke: new Stroke({
				//多线的边界样式
				color: "green",
				width: 1
			})
		})
	],
	MultiPoint: [
		new Style({
			//多点的点样式
			image: image
		})
	],
	MultiPolygon: [
		new Style({
			stroke: new Stroke({
				//多区的边界样式
				color: "yellow",
				width: 1
			}),
			fill: new Fill({
				//多区的填充样式
				color: "rgba(255, 255, 0, 0.1)"
			})
		})
	],
	Polygon: [
		new Style({
			stroke: new Stroke({
				//区的边界样式
				color: "blue",
				lineDash: [4],
				width: 3
			}),
			fill: new Fill({
				//区的填充样式
				color: "rgba(0, 0, 255, 0.1)"
			})
		})
	],
	GeometryCollection: [
		new Style({
			stroke: new Stroke({
				//集合要素的边界样式
				color: "magenta",
				width: 2
			}),
			fill: new Fill({
				//集合要素的填充样式
				color: "magenta"
			}),
			image: new CircleStyle({
				//集合要素的点样式
				radius: 10,
				stroke: new Stroke({
					color: "magenta"
				})
			})
		})
	],
	Circle: [
		new Style({
			stroke: new Stroke({
				//圆的边界样式
				color: "red",
				width: 2
			}),
			fill: new Fill({
				//圆的填充样式
				color: "rgba(255,0,0,0.2)"
			})
		})
	]
}

const styleFunction = (feature, resolution) => {
	//根据要素类型设置几何要素的样式
	return styles[feature.getGeometry().getType()]
}

const loadVectData = () => {
	if (vectorLayer !== null || vectorLayer === "undefined") {
		//移除已有矢量图层
		map.removeLayer(vectorLayer)
	}
	//实例化矢量数据源，用GeoJSON格式的类解析
	let vectorSource = new VectorSource({
		url: "./geojson/hubei.geojson",
		format: new GeoJSON()
	})
	vectorLayer = new VectorLayer({
		//矢量数据源
		source: vectorSource,
		//样式设置
		style: styleFunction
	})
	//将矢量图层加载到地图中
	map.addLayer(vectorLayer)
	//获取地图视图
	let view = map.getView()
	//平移地图
	view.setCenter([12536865.056410152, 3635008.742201894])
	//地图缩放
	view.setZoom(6)
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
