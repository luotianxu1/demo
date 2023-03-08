<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="pause">暂停/恢复</el-button>
		</div>
		<div ref="webgl" class="webgl"></div>
	</div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import gsap from "gsap"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let animate: gsap.core.Tween

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.z = 5

	// 创建渲染器
	renderer = new THREE.WebGLRenderer()
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建几何体
	const geometry = new THREE.BoxGeometry(1, 1, 1)
	// 创建材质
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	// 根据材质和几何体创建物体
	const cube = new THREE.Mesh(geometry, material)
	// 添加物体
	scene.add(cube)

	// 设置动画
	animate = gsap.to(cube.position, {
		x: 5,
		// 时间
		duration: 5,
		ease: "power1.inOut",
		// 重复次数 无限次 -1
		repeat: -1,
		// 往返运动
		yoyo: true,
		// 延迟时间
		delay: 2,
		// 动画开始
		onStart: () => {
			console.log("动画开始")
		},
		// 动画完成
		onComplete: () => {
			console.log("动画完成")
		}
	})
	gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5 })

	webgl.value.appendChild(renderer.domElement)
	renderScene()

	// 监听页面变化，更新渲染页面
	window.addEventListener("resize", resize)
}

onUnmounted(() => {
	window.removeEventListener("resize", resize)
})

const resize = () => {
	if (!webgl.value) {
		return
	}
	// 更新摄像头
	camera.aspect = webgl.value.offsetWidth / webgl.value.offsetHeight
	// 更新摄像机投影矩阵
	camera.updateProjectionMatrix()
	// 更新渲染器
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	// 更新渲染起像素比
	renderer.setPixelRatio(window.devicePixelRatio)
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	renderer.render(scene, camera)
}

const pause = () => {
	if (animate.isActive()) {
		animate.pause()
	} else {
		animate.resume()
	}
}
</script>

<style scoped lang="scss">
.main {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;

	.btnList {
		padding: 10px 0;
	}

	.webgl {
		flex: 1;
		width: 100%;
	}
}
</style>
