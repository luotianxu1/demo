<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"

const webgl = ref<HTMLDivElement>()
let web: WebGl
const lineGroup = new THREE.Group()
let model
let hull_turbine, hull_turbine_line, blades_turbine_003, blades_turbine_003_line
let bloomPass

const errColor = new THREE.Color(0xe98575)
let color = new THREE.Color("#0fb1fb")
let errorMeshMaterila = new THREE.MeshBasicMaterial({
	color: errColor,
	transparent: true,
	opacity: 0.6,
	side: THREE.DoubleSide
})
const meshMaterial = new THREE.MeshBasicMaterial({
	color: color,
	transparent: true,
	opacity: 0.3,
	side: THREE.DoubleSide
})
const lineMaterial = new THREE.LineBasicMaterial({
	color: new THREE.Color(color),
	depthTest: true,
	transparent: true,
	opacity: 0.6,
	side: THREE.DoubleSide
})

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
		effect: true,
		loading: {
			show: true,
			html: true
		}
	})
	web.addStats()
	web.camera.position.set(4, 1, -3)
	web.camera.updateMatrixWorld()

	web.addAmbientLight(0xffffff, 40)
	web.addDirectionalLight(web.camera.position.x, web.camera.position.y, web.camera.position.z, 0xffffff, 40)

	addModel()
	unreal()
	gui()

	renderScene()
}

const addModel = () => {
	web.addGltf("./threejsDemo/model/scene.gltf").then(gltf => {
		const model = gltf.scene.getObjectByName("Sketchfab_model")
		model.traverse(mesh => changeModelMaterial(mesh, lineGroup))
		web.scene.add(model)
		web.scene.add(lineGroup)

		// 涡轮
		hull_turbine = web.scene.getObjectByName("hull_turbine")
		hull_turbine_line = lineGroup.getObjectByName("hull_turbine_line")
		// 涡轮的线
		blades_turbine_003 = web.scene.getObjectByName("blades_turbine_003")
		blades_turbine_003_line = web.scene.getObjectByName("blades_turbine_003_line")

		let right_pbr = model.getObjectByName("canister_turbine_011_Nickel-Light-PBR_0") as any
		// 错误材质
		let oldMeshMaterila = right_pbr.material.clone()

		let errorFlag = false
		setInterval(() => {
			if (errorFlag) {
				right_pbr.material = errorMeshMaterila
			} else {
				right_pbr.material = oldMeshMaterila
			}
			errorFlag = !errorFlag
		}, 1000 * 1)
	})
}

const params = {
	threshold: 0.35,
	strength: 0.3, // 强度
	radius: 0.8 // 半径
}
const unreal = () => {
	// 添加虚幻发光通道
	bloomPass = new UnrealBloomPass(new THREE.Vector2(web.domElement.offsetWidth, web.domElement.offsetHeight), 1.5, 0.4, 0.85)
	bloomPass.threshold = params.threshold
	bloomPass.strength = params.strength
	bloomPass.radius = params.radius

	web.composer.addPass(bloomPass)
}

const gui = () => {
	const gui = web.addGUI()
	const bloomFolder = gui.addFolder("bloom")
	bloomFolder.add(params, "threshold", 0.0, 1.0).onChange((value: number) => {
		bloomPass.threshold = Number(value)
	})
	bloomFolder.add(params, "strength", 0.0, 3.0).onChange((value: number) => {
		bloomPass.strength = Number(value)
	})
	gui
		.add(params, "radius", 0.0, 1.0)
		.step(0.01)
		.onChange((value: number) => {
			bloomPass.radius = Number(value)
		})
}

const changeModelMaterial = (object: THREE.Object3D, lineGroup: THREE.Group): any => {
	const group = object as THREE.Group
	const lg = new THREE.Group()
	lineGroup.add(lg)
	lg.name = group.name + "_line"
	group.traverse((mesh: THREE.Mesh) => {
		if (mesh.isMesh) {
			const quaternion = new THREE.Quaternion()
			const worldPos = new THREE.Vector3()
			const worldScale = new THREE.Vector3()
			// 获取四元数
			mesh.getWorldQuaternion(quaternion)
			// 获取位置信息
			mesh.getWorldPosition(worldPos)
			// 获取缩放比例
			mesh.getWorldScale(worldScale)
			mesh.material = meshMaterial
			// 以模型顶点信息创建线条
			const line = getLine(mesh)
			const name = mesh.name + "_line"
			line.name = name
			// 给线段赋予模型相同的坐标信息
			line.quaternion.copy(quaternion)
			line.position.copy(worldPos)
			line.scale.copy(worldScale)
			lg.add(line)
		}
	})
}

const getLine = (object: THREE.Mesh, thresholdAngle = 1): THREE.LineSegments => {
	// 创建线条，参数为 几何体模型，相邻面的法线之间的角度，
	const edges = new THREE.EdgesGeometry(object.geometry, thresholdAngle)
	const line = new THREE.LineSegments(edges, lineMaterial)
	return line
}

let rotationX = 0.03
const renderScene = () => {
	// 旋转涡轮
	if (hull_turbine && hull_turbine_line) {
		hull_turbine.rotation.x += rotationX
		hull_turbine_line.rotation.x += rotationX
	}
	if (blades_turbine_003) {
		blades_turbine_003.rotation.x += rotationX
	}
	blades_turbine_003_line && (blades_turbine_003_line.rotation.x += rotationX)
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
