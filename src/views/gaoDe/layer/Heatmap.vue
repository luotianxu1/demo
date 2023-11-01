<template>
	<div id="container"></div>
</template>
<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"
import { heatmapData } from "./data/heatmapData"

onMounted(() => {
	initMap()
})

const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.HeatMap"]
	})
		.then(AMap => {
			/**
			 * 详细的参数,可以查看heatmap.js的文档 http://www.patrick-wied.at/static/heatmapjs/docs.html
			 * 参数说明如下:
			 * visible 热力图是否显示,默认为true
			 * opacity 热力图的透明度,分别对应heatmap.js的minOpacity和maxOpacity
			 * radius 势力图的每个点的半径大小
			 * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
			 *	{
			 * .2:'rgb(0, 255, 255)',
			 * .5:'rgb(0, 110, 255)',
			 * .8:'rgb(100, 0, 255)'
			 * }
			 * 其中 key 表示插值的位置, 0-1 value 为颜色值
			 */

			const map = new AMap.Map("container", {
				resizeEnable: true,
				viewMode: "3D",
				pitch: 50,
				center: [116.418261, 39.921984],
				zoom: 11
			})

			const heatmap = new AMap.HeatMap(map, {
				radius: 25, //给定半径
				opacity: [0, 0.8],
				"3d": {
					//热度转高度的曲线控制参数，可以利用左侧的控制面板获取
					heightBezier: [0.4, 0.2, 0.4, 0.8],
					//取样精度，值越小，曲面效果越精细，但同时性能消耗越大
					gridSize: 2,
					heightScale: 1
				}
				/*,
            gradient:{
                0.5: 'blue',
                0.65: 'rgb(117,211,248)',
                0.7: 'rgb(0, 255, 0)',
                0.9: '#ffea00',
                1.0: 'red'
            }
             */
			})
			//设置数据集：该数据为北京部分“公园”数据
			heatmap.setDataSet({
				data: heatmapData,
				max: 100
			})
		})
		.catch(e => {
			console.log(e)
		})
}
</script>
<style lang="scss" scoped>
#container {
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
}
</style>
