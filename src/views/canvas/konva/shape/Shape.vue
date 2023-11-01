<template>
	<div class="rect">
		<div id="canvas"></div>
	</div>
</template>
<script setup lang="ts">
import Konva from "konva"

onMounted(() => {
	init()
})

const init = () => {
	const el = document.getElementById("canvas")
	if (!el) return

	const { clientWidth, clientHeight } = el
	const stage = new Konva.Stage({
		container: "canvas",
		width: clientWidth,
		height: clientHeight
	})

	const layer = new Konva.Layer()

	// 矩形
	const react = new Konva.Rect({
		x: 10,
		y: 10,
		width: 100,
		height: 50,
		fill: "#ff8800",
		stroke: "black",
		strokeWidth: 1
	})
	layer.add(react)

	// 圆
	const circle = new Konva.Circle({
		x: 200,
		y: 80,
		radius: 50,
		stroke: "#ff8800",
		strokeWidth: 1
	})
	layer.add(circle)

	// 椭圆
	const ellipse = new Konva.Ellipse({
		x: 300,
		y: 80,
		radiusX: 50,
		radiusY: 25,
		fill: "red",
		stroke: "black",
		strokeWidth: 1,
		draggable: true
	})
	layer.add(ellipse)

	// 楔形
	const wedge = new Konva.Wedge({
		x: 400,
		y: 80,
		radius: 50,
		angle: 45,
		fill: "#ff0000",
		stroke: "black",
		strokeWidth: 1,
		draggable: true
	})
	layer.add(wedge)

	// 线
	const line = new Konva.Line({
		points: [100, 100, 200, 300, 400, 500],
		stroke: "red",
		strokeWidth: 1,
		closed: true,
		fill: "red",
		tension: 0.5 //值越大，拉伸越大
	})
	layer.add(line)

	// 文本
	const text = new Konva.Text({
		x: 450,
		y: 80,
		text: "Hello Word",
		fontSize: 40,
		fill: "black"
	})
	layer.add(text)

	// 星星
	const star = new Konva.Star({
		x: 750,
		y: 80,
		numPoints: 5,
		innerRadius: 50,
		outerRadius: 100,
		fill: "#ff8800",
		stroke: "black",
		strokeWidth: 1
	})
	layer.add(star)

	// 环形
	const ring = new Konva.Ring({
		x: 950,
		y: 80,
		innerRadius: 50,
		outerRadius: 100,
		fill: "#ff8800",
		stroke: "black",
		strokeWidth: 1
	})
	layer.add(ring)

	// 弧形
	const arc = new Konva.Arc({
		x: 1100,
		y: 80,
		innerRadius: 40,
		outerRadius: 70,
		angle: 60,
		fill: "#ff8800",
		stroke: "black",
		rotation: 60
	})
	layer.add(arc)

	// 标签
	const tooltip = new Konva.Label({
		x: 1200,
		y: 80,
		draggable: true
	})
	const tag = new Konva.Tag({
		fill: "#ff8800",
		pointerDirection: "down",
		stroke: "black",
		strokeWidth: 1,
		pointerWidth: 10,
		pointerHeight: 10,
		shadowBlur: 10,
		shadowOffsetX: 10,
		shadowOpacity: 0.5
	})
	const tagText = new Konva.Text({
		text: "Hello World!",
		fontSize: 18,
		padding: 15,
		fill: "#fff"
	})
	tooltip.add(tag)
	tooltip.add(tagText)
	layer.add(tooltip)

	// 多边形
	const regularPolygon = new Konva.RegularPolygon({
		x: 1500,
		y: 80,
		sides: 6,
		radius: 100,
		fill: "#ff8800",
		stroke: "black",
		strokeWidth: 1
	})
	layer.add(regularPolygon)

	// 箭头
	const arrow = new Konva.Arrow({
		x: 1600,
		y: 80,
		points: [0, 0, 50, 50],
		pointerLength: 10,
		pointerWidth: 10,
		stroke: "black",
		strokeWidth: 5
	})
	layer.add(arrow)

	// 图片
	Konva.Image.fromURL("./textures/map/0.jpg", (image: Konva.Image) => {
		image.setAttrs({
			x: 1750,
			y: 80,
			height: 50,
			width: 50,
			scaleY: 1,
			scaleX: 1
		})
		layer.add(image)

		// 动画
		const amplitude = 10
		const period = 1000
		const y = image.y() - 10
		const animation = new Konva.Animation(frame => {
			if (!frame) {
				return
			}
			image.y(amplitude * Math.sin((frame.time * 2 * Math.PI) / period) + y)
		}, layer)
		animation.start()
	})

	stage.add(layer)
}
</script>

<style scoped lang="scss">
.rect {
	width: 100%;
	height: 100%;
	padding: 20px;

	#canvas {
		height: 100%;
		background-color: #eee;
		border: 1px solid #666;
	}
}
</style>
