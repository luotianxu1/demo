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

	web = new WebGl(webgl.value, {
		loading: {
			show: true,
			html: true
		}
	})
	web.scene.background = new THREE.Color(0xe0e0e0)
	web.scene.fog = new THREE.Fog(0xe0e0e0, 20, 100)
	web.camera.position.set(-5, 6, 15)
	web.camera.lookAt(0, 2, 0)
	web.webGlRender.outputColorSpace = THREE.SRGBColorSpace

	const hemiLight = web.addHemisphereLight(0xffffff, 0x444444)
	hemiLight.position.set(0, 20, 0)
	web.addDirectionalLight(0, 20, 10, 0xffffff)

	// 地面
	const mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(2000, 2000),
		new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
	)
	mesh.rotation.x = -Math.PI / 2
	web.scene.add(mesh)

	// 网格
	const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000)
	;(grid.material as THREE.Material).opacity = 0.2
	;(grid.material as THREE.Material).transparent = true
	web.scene.add(grid)

	web.addGltf("./threejsDemo/metaverse/RobotExpressive.glb").then(glft => {
		web.scene.add(glft.scene)
		addGui(glft.scene, glft.animations)
	})

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

	// 动画混合器
	mixer = new THREE.AnimationMixer(model)
	actions = {}
	for (let i = 0; i < animations.length; i++) {
		// 获取动作片段
		const clip = animations[i]
		const action = mixer.clipAction(clip)
		actions[clip.name] = action
		if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
			action.clampWhenFinished = true
			action.loop = THREE.LoopOnce
		}
	}
	activeAction = actions["Walking"]
	activeAction.play()

	const gui = web.addGUI()
	// 状态
	const statesFolder = gui.addFolder("状态")
	const clipCtrl = statesFolder.add(api, "state").options(states)
	clipCtrl.onChange(function () {
		fadeToAction(api.state, 0.5)
	})
	statesFolder.open()

	// 动作
	const emoteFolder = gui.addFolder("动作")
	for (let i = 0; i < emotes.length; i++) {
		api[emotes[i]] = function () {
			fadeToAction(emotes[i], 0.2)
			mixer.addEventListener("finished", restoreState)
		}
		emoteFolder.add(api, emotes[i])
	}
	emoteFolder.open()

	// 表情
	face = model.getObjectByName("Head_4")
	if (!face) {
		return
	}
	const expressions = Object.keys((face as any).morphTargetDictionary)
	const expressionFolder = gui.addFolder("表情")
	for (let i = 0; i < expressions.length; i++) {
		expressionFolder.add((face as any).morphTargetInfluences, i.toString(), 0, 1, 0.01).name(expressions[i])
	}
	expressionFolder.open()
}

// 恢复上一次状态
function restoreState() {
	mixer.removeEventListener("finished", restoreState)
	fadeToAction(api.state, 0.2)
}

// 更换状态
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
