<template>
	<div
		ref="webgl"
		class="webgl"
		v-loading="loading"
		:element-loading-text="loadingText"
		element-loading-background="rgba(0, 0, 0, 1.0)"
	></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import * as YUKA from "yuka"
import WebGl from "@utils/three/webGl"

const loading = ref(true)
const loadingText = ref("加载中")
THREE.DefaultLoadingManager.onLoad = function () {
	loading.value = false
}

class CustomVechicle extends YUKA.Vehicle {
	navMesh

	constructor(navMesh: any) {
		super()
		this.navMesh = navMesh
	}
	update(delta: number): any {
		super.update(delta)
		const currentRegion = this.navMesh.getRegionForPoint(this.position)
		if (currentRegion) {
			const distance = currentRegion.distanceToPoint(this.position)
			this.position.y -= distance * 0.2
		}
	}
}

// 创建目标小球
const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32)
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.receiveShadow = true
sphere.castShadow = true

// 创建线
let line: any
function showPathLine(path: any) {
	if (line) {
		web.scene.remove(line)
		line.geometry.dispose()
		line.material.dispose()
	}
	const positions = []
	for (let i = 0; i < path._waypoints.length; i++) {
		positions.push(path._waypoints[i].x, path._waypoints[i].y, path._waypoints[i].z)
	}
	const geometry = new THREE.BufferGeometry()
	geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
	const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
	line = new THREE.Line(geometry, material)
	web.scene.add(line)
}

// 创建目标
const target = new YUKA.GameEntity()
target.setRenderComponent(sphere, callback)
function callback(entity: any, renderComponent: any) {
	renderComponent.position.copy(entity.position)
	renderComponent.quaternion.copy(entity.rotation)
}
target.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10)

const entityManager = new YUKA.EntityManager()
entityManager.add(target)

// 网格加载器
const navMeshLoader = new YUKA.NavMeshLoader()
// 加载网格
let navMesh: YUKA.NavMesh
let vehicle: CustomVechicle

let webgl = ref()
let web: WebGl
let plane: THREE.Group
onMounted(() => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value, {
		render: {
			logarithmicDepthBuffer: true
		}
	})
	web.webGlRender.outputColorSpace = THREE.SRGBColorSpace
	web.webGlRender.toneMapping = THREE.ACESFilmicToneMapping
	web.webGlRender.toneMappingExposure = 1
	web.camera.position.set(0, 10, 20)
	web.camera.lookAt(0, 0, 0)

	web.scene.add(sphere)

	web.addGltf("./threejsDemo/patrol/city2.glb").then(gltf => {
		let city = gltf.scene
		plane = city
		web.scene.add(city)
	})

	web.setBgHdr("./threejsDemo/patrol/013.hdr")

	navMeshLoader.load("./threejsDemo/patrol/citymap1.gltf").then(function (navigationMesh) {
		navMesh = navigationMesh

		vehicle = new CustomVechicle(navMesh)
		vehicle.maxSpeed = 5
		vehicle.smoother = new YUKA.Smoother(30)
		entityManager.add(vehicle as any)

		web.addGltf("./threejsDemo/patrol/robot.glb").then(gltf => {
			const car = gltf.scene
			car.children[0].scale.set(0.6, 0.6, 0.6)
			web.scene.add(car)
			vehicle.setRenderComponent(car, callback)
		})
	})

	// 点击将目标移动到点击的位置
	const ndc = new THREE.Vector2()
	const raycaster = new THREE.Raycaster()
	window.addEventListener("pointerdown", event => {
		ndc.x = (event.clientX / window.innerWidth) * 2 - 1
		ndc.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(ndc, web.camera)
		const intersects = raycaster.intersectObject(plane)
		if (intersects.length > 0) {
			const point = intersects[0].point
			target.position.set(point.x, 0, point.z)
			let from = vehicle.position
			let to = point

			// 根据导航网格获取路径
			const path = navMesh.findPath(from, to as any)
			const path1 = new YUKA.Path()
			for (let item of path) {
				path1.add(new YUKA.Vector3(item.x, item.y, item.z))
			}
			showPathLine(path1)
			vehicle.steering.clear()

			const onPathBehavior = new YUKA.OnPathBehavior(path1, 0.1, 0.1)
			vehicle.steering.add(onPathBehavior)

			const arriveBehavior = new YUKA.ArriveBehavior(to as any, 3, 3)
			arriveBehavior.weight = 1
			vehicle.steering.add(arriveBehavior)
		}
	})

	render()
})

onUnmounted(() => {
	web.destroy()
})

const time = new YUKA.Time()
const render = () => {
	const delta = time.update().getDelta()
	web.update()
	entityManager.update(delta)
	requestAnimationFrame(render)
}
</script>

<style lang="scss" scoped>
.webgl {
	top: 0;
	left: 0;
	z-index: 100;
	display: flex;
	width: 100vw;
	height: 100vh;
}
</style>
