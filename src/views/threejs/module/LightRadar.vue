import type { add } from 'ol/coordinate'; import type { threejsDemoList } from '@/views/home/data/threejsDemo';
<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import LightRadar from "@/utils/three/mesh/lightRadar/lightRadar"

const webgl = ref<HTMLDivElement>()
let web: WebGl

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
		loading: {
			show: true,
			html: true
		}
	})
	web.webGlRender.setClearColor(new THREE.Color("#32373E"), 1)
	web.addAmbientLight(0xadadad)
	web.addDirectionalLight(100, 100, 0, 0xffffff, 0.5)
	web.camera.position.set(400, 550, -1021)

	addCity()
	addRadar()

	renderScene()
}

const addCity = () => {
	web.addFbx("./threejs/module/shanghai.FBX").then(group => {
		group.traverse((child: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>) => {
			if (child.name === "CITY_UNTRIANGULATED") {
				const materials = Array.isArray(child.material) ? child.material : [child.material]
				materials.forEach(material => {
					material.color.setStyle("#9370DB")
				})
			}

			if (child.name === "LANDMASS") {
				const materials = Array.isArray(child.material) ? child.material : [child.material]
				materials.forEach(material => {
					material.color.setStyle("#040912")
				})
			}
		})
		web.scene.add(group)
	})
}

const addRadar = () => {
	const radar = new LightRadar({ position: { x: 0, y: 0, z: 0 }, radius: 300, color: "#efad35" })
	web.scene.add(radar.mesh)
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	web.update()
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
