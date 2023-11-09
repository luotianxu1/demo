<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value)
	web.scene.background = new THREE.Color(0xe0e0e0)
	web.camera.position.set(3, 1, 3)
	web.camera.lookAt(0, 0, 0)
	web.addHemisphereLight(0xffffff, 0x444444)

	web.addGltf("./threejs/helper/Duck.glb").then(glb => {
		const duck = glb
		let duckMesh = glb.scene.getObjectByName("LOD3spShape") as THREE.Mesh
		let duckGeometry = duckMesh.geometry
		// 计算包围盒
		duckGeometry.computeBoundingBox()
		// 设置几何体居中
		duckGeometry.center()
		const duckBox = duckGeometry.boundingBox
		console.log(duckBox)
		// 更新世界矩阵
		duckMesh.updateWorldMatrix(true, true)
		// 更新包围盒
		duckBox.applyMatrix4(duckMesh.matrixWorld)
		let center = duckBox.getCenter(new THREE.Vector3())
		console.log(center)

		const boxHelper = new THREE.Box3Helper(duckBox, new THREE.Color(0xffff00))
		web.scene.add(boxHelper)
		web.scene.add(duck.scene)

		console.log(duckBox.max.x - duckBox.min.x)
		console.log(duckBox.max.y - duckBox.min.y)
		console.log(duckBox.max.z - duckBox.min.z)
	})

	renderScene()
}

const renderScene = () => {
	web.update()
	requestAnimationFrame(renderScene)
}

onUnmounted(() => {
	web.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
