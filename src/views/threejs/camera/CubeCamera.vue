<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let cubeCamera: THREE.CubeCamera
let cube: THREE.Mesh
let torus: THREE.Mesh
let material: THREE.MeshStandardMaterial

onMounted(() => {
	init()
})

const init = () => {
	web = new WebGl(webgl.value)
	web.scene.background = new THREE.Color(0x444444)
	web.camera.position.z = 75
	web.addAxesHelper()

	material = new THREE.MeshStandardMaterial({
		roughness: 0.05,
		metalness: 1
	})
	const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(15, 8), material)
	web.scene.add(sphere)

	const material2 = new THREE.MeshStandardMaterial({
		roughness: 0.1,
		metalness: 0
	})
	cube = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 15), material2)
	web.scene.add(cube)

	torus = new THREE.Mesh(new THREE.TorusKnotGeometry(8, 3, 128, 16), material2)
	web.scene.add(torus)

	const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256)
	cubeRenderTarget.texture.type = THREE.HalfFloatType

	cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget)

	web.hdrLoader("./textures/hdr/050.hdr").then(texture => {
		texture.mapping = THREE.EquirectangularReflectionMapping
		texture.format = THREE.RGBAFormat
		web.scene.background = texture
		web.scene.environment = texture
		material.envMap = cubeRenderTarget.texture
	})

	addGui()

	web.webGlRender.setAnimationLoop(animation)
}

const animation = msTime => {
	const time = msTime / 1000
	cube.position.x = Math.cos(time) * 30
	cube.position.y = Math.sin(time) * 30
	cube.position.z = Math.sin(time) * 30
	cube.rotation.x += 0.02
	cube.rotation.y += 0.03
	torus.position.x = Math.cos(time + 10) * 30
	torus.position.y = Math.sin(time + 10) * 30
	torus.position.z = Math.sin(time + 10) * 30
	torus.rotation.x += 0.02
	torus.rotation.y += 0.03
	web.update()
	cubeCamera.update(web.webGlRender, web.scene)
}

const addGui = () => {
	const gui = web.addGUI()
	gui.add(material, "roughness", 0, 1)
	gui.add(material, "metalness", 0, 1)
	gui.add(web.webGlRender, "toneMappingExposure", 0, 2).name("exposure")
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
