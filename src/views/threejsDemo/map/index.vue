<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js"
import gsap from "gsap"

const webgl = ref<HTMLDivElement>()
let web: WebGl
const cameraDefaultPos = { x: 103, y: 0.5, z: 48 }
const provActHeight = 300
let prev = null //标记鼠标拾取到的mesh
let objList = []

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value, {
		render: {
			antialias: true,
			logarithmicDepthBuffer: true
		},
		controls: {
			type: false
		},
		css2DRender: true
	})

	const { x, y, z } = cameraDefaultPos
	web.camera.position.set(x, y, z)
	web.camera.lookAt(104, 35, 0)

	web.addAmbientLight(0xffffff, 0.5)
	web.addDirectionalLight(0, 10, 10, 0xffffff, 1)

	const mapGroup = new THREE.Group()
	web.scene.add(mapGroup)

	web.addJSON("./threejsDemo/map/ChinaLight.json").then(json => {
		;(json as any).features.forEach(function (area) {
			const newGroup = new THREE.Group()
			if (area.geometry.type === "Polygon") {
				area.geometry.coordinates = [area.geometry.coordinates]
			}
			let line = createLine(area.geometry.coordinates, false)
			line.position.z = 2.01
			newGroup.add(line)
			let province = ExtrudeMeshTest(area.geometry.coordinates, 2) as any
			province.payload = { key: "province" }
			calcGeomCenter(province)
			newGroup.add(province) //拉伸
			objList.push(province)
			let center = area?.properties
			center?.cp?.length && newGroup.add(tag(center?.name, center?.cp[0], center?.cp[1], 2))
			mapGroup.add(newGroup)
		})
	})

	window.addEventListener("click", click)

	renderScene()
}

const mouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
const click = event => {
	if (prev) {
		const { x, y, z } = cameraDefaultPos
		cameraMoveTo(x, y, z)
		prev.material.color.set(0x1479b1) //恢复原来颜色
		provinceMove(prev.parent, "down")
	}
	mouse.x = (event.clientX / web.domElement.offsetWidth) * 2 - 1
	mouse.y = -(event.clientY / web.domElement.offsetHeight) * 2 + 1
	raycaster.setFromCamera(mouse, web.camera)
	const intersects = raycaster.intersectObjects(objList, true)

	if (intersects && intersects.length > 0) {
		const mesh = intersects[0].object
		if (!(mesh instanceof THREE.Mesh)) return
		const { key } = (mesh as any).payload
		if (key === "province") {
			mesh.material.setValues({ color: 0x00a5d1 })
			provinceMove(mesh.parent, "up")
			prev = mesh
			// 相机移动
			const { geomCenter, diffX } = (mesh as any).payload
			if (!geomCenter) return
			const { x, y } = geomCenter
			const cameraOffset = Math.max(diffX * 0.85, 10)
			cameraMoveTo(x, y - cameraOffset, provActHeight + cameraOffset + 10)
		}
	}
}

// 拉伸材质
const ExtrudeMeshTest = (pointsArrs, height) => {
	const shapeArr = []
	pointsArrs.forEach(pointsArr => {
		const vector2Arr = []
		pointsArr[0].forEach(elem => {
			vector2Arr.push(new THREE.Vector2(elem[0], elem[1]))
		})
		const shape = new THREE.Shape(vector2Arr)
		shapeArr.push(shape)
	})
	const material = new THREE.MeshPhongMaterial({
		color: 0x1479b1
	})
	const geometry = new THREE.ExtrudeGeometry(shapeArr, {
		depth: height, //拉伸高度
		bevelEnabled: false //无倒角
	})
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}

// 计算几何中心
const calcGeomCenter = mesh => {
	mesh.geometry.computeBoundingBox()
	const { max, min } = mesh.geometry.boundingBox
	const { x: maxX, y: maxY } = max
	const { x: minX, y: minY } = min
	const geomCenter = {
		x: (maxX + minX) / 2,
		y: (maxY + minY) / 2
	}
	mesh.payload.geomCenter = geomCenter
	mesh.payload.diffX = maxX - minX
	mesh.payload.diffY = maxY - minY
}

const tag = (name, x, y, z) => {
	// 创建div元素(作为标签)
	const div = document.createElement("div")
	div.innerHTML = name
	div.style.padding = "5px 10px"
	div.style.color = "#fff"
	div.style.fontSize = "12px"
	div.style.position = "absolute"
	div.style.backgroundColor = "rgba(25,25,25,0.5)"
	div.style.borderRadius = "5px"
	const label = new CSS2DObject(div)
	div.style.pointerEvents = "none"
	label.position.set(x, y, z)
	return label
}

const createLine = (pointsArrs, isMercator) => {
	const group = new THREE.Group()
	pointsArrs.forEach(polygon => {
		const pointArr = []
		polygon[0].forEach(elem => {
			if (isMercator) {
				// 经纬度转墨卡托坐标
				const coord = lonLat2Mercator(elem[0], elem[1])
				pointArr.push(coord.x, coord.y, 0)
			} else {
				pointArr.push(elem[0], elem[1], 0)
			}
		})
		const geometry = new THREE.BufferGeometry()
		const vertices = new Float32Array(pointArr)
		const attribue = new THREE.BufferAttribute(vertices, 3)
		geometry.attributes.position = attribue
		const material = new THREE.LineBasicMaterial({
			color: 0x00a5d1
		})
		const line = new THREE.Line(geometry, material) //线条模型对象
		group.add(line)
	})
	return group
}

// 经纬度转墨卡托坐标公式
const lonLat2Mercator = (E, N) => {
	let x = (E * 20037508.34) / 180
	let y = Math.log(Math.tan(((90 + N) * Math.PI) / 360)) / (Math.PI / 180)
	y = (y * 20037508.34) / 180
	return {
		x: x, //墨卡托x坐标——对应经度
		y: y //墨卡托y坐标——对应维度
	}
}

const provinceMove = (mesh, type) => {
	let target = type === "up" ? provActHeight : 0
	gsap.to(mesh.position, {
		z: target,
		duration: 1
	})
}

const cameraMoveTo = (x, y, z) => {
	gsap.to(web.camera.position, {
		x: x,
		y: y,
		z: z,
		duration: 1
	})
}

const renderScene = () => {
	web.updateMap()
	web.update()
	requestAnimationFrame(renderScene)
}

onUnmounted(() => {
	window.removeEventListener("click", click)
	web.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
