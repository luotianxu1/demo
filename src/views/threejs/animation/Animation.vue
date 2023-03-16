<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { ElMessage } from "element-plus"
import * as dat from "dat.gui"

const webgl = ref()
let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let loading = ref(true)
let robot: GLTF
let gui: dat.GUI

let event = {
	onLoad: () => {
		init()
		loading.value = false
	},
	onProgress: (url: any, num: number, total: number) => {
		console.log(Number((num / total).toFixed(2)) * 100 + "%")
	},
	onError: (e: any) => {
		console.log(e)
		ElMessage.error("加载出现错误")
	}
}
const loadingManager = new THREE.LoadingManager(event.onLoad, event.onProgress, event.onError)
const gltfLoader = new GLTFLoader(loadingManager)
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("./draco/gltf/")
dracoLoader.setDecoderConfig({ type: "js" })
dracoLoader.preload()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load("./model/glb/RobotExpressive.glb", glb => {
	robot = glb
})

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0xe0e0e0)
	scene.fog = new THREE.Fog(0xe0e0e0, 20, 100)
	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(-5, 3, 10)
	camera.lookAt(0, 2, 0)
	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	renderer.outputEncoding = THREE.sRGBEncoding
	renderer.shadowMap.enabled = true
	// 灯光
	const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
	hemiLight.position.set(0, 20, 0)
	scene.add(hemiLight)
	const dirLight = new THREE.DirectionalLight(0xffffff)
	dirLight.position.set(0, 20, 10)
	scene.add(dirLight)
	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)
	// 地面
	const mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(2000, 2000),
		new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
	)
	mesh.rotation.x = -Math.PI / 2
	scene.add(mesh)
	// 网格
	const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000)
	;(grid.material as THREE.Material).opacity = 0.2
	;(grid.material as THREE.Material).transparent = true
	scene.add(grid)

	scene.add(robot.scene)

	addGui(robot.scene, robot.animations)

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

let mixer: THREE.AnimationMixer
let actions: any
const api: any = { state: "Walking" }
let previousAction: THREE.AnimationAction
let activeAction: THREE.AnimationAction
let face

const addGui = (model: THREE.Object3D, animations: any) => {
	const states = ["Idle", "Walking", "Running", "Dance", "Death", "Sitting", "Standing"]
	const emotes = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"]

	mixer = new THREE.AnimationMixer(model)
	actions = {}
	for (let i = 0; i < animations.length; i++) {
		const clip = animations[i]
		const action = mixer.clipAction(clip)
		actions[clip.name] = action
		if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
			action.clampWhenFinished = true
			action.loop = THREE.LoopOnce
		}
	}

	gui = new dat.GUI()
	// 状态
	const statesFolder = gui.addFolder("States")
	const clipCtrl = statesFolder.add(api, "state").options(states)
	clipCtrl.onChange(function () {
		fadeToAction(api.state, 0.5)
	})
	statesFolder.open()

	// 动作
	const emoteFolder = gui.addFolder("Emotes")
	function createEmoteCallback(name: any) {
		api[name] = function () {
			fadeToAction(name, 0.2)
			mixer.addEventListener("finished", restoreState)
		}
		emoteFolder.add(api, name)
	}
	function restoreState() {
		mixer.removeEventListener("finished", restoreState)
		fadeToAction(api.state, 0.2)
	}
	for (let i = 0; i < emotes.length; i++) {
		createEmoteCallback(emotes[i])
	}
	emoteFolder.open()

	// 表情
	face = model.getObjectByName("Head_4")
	if (!face) {
		return
	}
	const expressions = Object.keys((face as any).morphTargetDictionary)
	const expressionFolder = gui.addFolder("Expressions")
	for (let i = 0; i < expressions.length; i++) {
		expressionFolder.add((face as any).morphTargetInfluences, i.toString(), 0, 1, 0.01).name(expressions[i])
	}
	activeAction = actions["Walking"]
	activeAction.play()
	expressionFolder.open()
}

function fadeToAction(name: string, duration: number) {
	previousAction = activeAction
	activeAction = actions[name]
	if (previousAction !== activeAction) {
		previousAction.fadeOut(duration)
	}
	activeAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play()
}

const clock = new THREE.Clock()
const renderScene = () => {
	const dt = clock.getDelta()
	if (mixer) mixer.update(dt)
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

onUnmounted(() => {
	gui.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
