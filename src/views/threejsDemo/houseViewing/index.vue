<template>
	<div class="page" v-loading="loading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 1.0)">
		<div ref="webgl" class="webgl"></div>
		<div class="map">
			<div ref="tagDiv" class="tag"></div>
			<img src="../../../assets/img/threejsDemo/houseViewing/map.gif" alt="" />
		</div>
		<div class="title">VR全景看房</div>
	</div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import gsap from "gsap"

const webgl = ref()
let tagDiv = ref()
const loading = ref(true)
const loadingText = ref("加载中")
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 0)

const moveTag = (name: string) => {
	let positions = {
		客厅: [100, 110],
		厨房: [180, 190],
		阳台: [50, 50],
		卧室: [160, 40],
		走廊: [150, 90]
	}
	if (positions[name as keyof typeof positions]) {
		gsap.to(tagDiv.value, {
			duration: 1,
			x: positions[name as keyof typeof positions][0],
			y: positions[name as keyof typeof positions][1],
			ease: "power3.inOut"
		})
	}
}

class SpriteCanvas {
	fns: any[]
	context
	mesh
	raycaster
	mouse
	constructor(camera: THREE.Camera, text = "helloworld", position = new THREE.Vector3(0, 0, 0)) {
		this.fns = []
		// 创建canvas对象
		const canvas = document.createElement("canvas")
		canvas.width = 1024
		canvas.height = 1024
		const context: any = canvas.getContext("2d")
		this.context = context
		context.fillStyle = "rgba(100,100,100,1)"
		context.fillRect(0, 256, 1024, 512)
		context.textAlign = "center"
		context.textBaseline = "middle"
		context.font = "bold 200px Arial"
		context.fillStyle = "rgba(255,255,255,1)"
		context.fillText(text, canvas.width / 2, canvas.height / 2)

		let texture = new THREE.CanvasTexture(canvas)

		const material = new THREE.SpriteMaterial({
			map: texture,
			color: 0xffffff,
			alphaMap: texture,
			side: THREE.DoubleSide,
			transparent: true
		})
		this.mesh = new THREE.Sprite(material)
		this.mesh.scale.set(0.5, 0.5, 0.5)
		this.mesh.position.copy(position)

		// 创建射线
		this.raycaster = new THREE.Raycaster()
		this.mouse = new THREE.Vector2()

		// 事件的监听
		window.addEventListener("click", (event: any) => {
			this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
			this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)

			this.raycaster.setFromCamera(this.mouse, camera)

			event.mesh = this.mesh
			event.spriteCanvas = this

			const intersects = this.raycaster.intersectObject(this.mesh)
			if (intersects.length > 0) {
				this.fns.forEach(fn => {
					fn(event)
				})
			}
		})
	}

	onClick(fn: () => void) {
		this.fns.push(fn)
	}
}

class Room {
	name

	constructor(
		name: string,
		roomIndex: number,
		textureUrl: string,
		position = new THREE.Vector3(0, 0, 0),
		eular = new THREE.Euler(0, 0, 0)
	) {
		this.name = name
		// 添加立方体
		const geometry = new THREE.BoxGeometry(10, 10, 10)
		geometry.scale(1, 1, -1)

		const arr = [`${roomIndex}_l`, `${roomIndex}_r`, `${roomIndex}_u`, `${roomIndex}_d`, `${roomIndex}_b`, `${roomIndex}_f`]
		const boxMaterials: Array<THREE.MeshBasicMaterial> = []
		arr.forEach(item => {
			// 纹理加载
			let texture = new THREE.TextureLoader().load(`${textureUrl}/${item}.jpg`)
			if (item === `${roomIndex}_u` || item === `${roomIndex}_d`) {
				texture.rotation = Math.PI
				texture.center = new THREE.Vector2(0.5, 0.5)
				boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
			} else {
				boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
			}
		})
		const cube = new THREE.Mesh(geometry, boxMaterials)
		cube.position.copy(position)
		cube.rotation.copy(eular)
		scene.add(cube)
	}
}

// 创建客厅
let livingIndex = 0
let livingUrl = "./textures/room/livingroom"
let livingPosition = new THREE.Vector3(0, 0, 0)
new Room("客厅", livingIndex, livingUrl, livingPosition)
// 创建客厅文字精灵
const textLiving = new SpriteCanvas(camera, "客厅", new THREE.Vector3(-4, 0, -6))
scene.add(textLiving.mesh)
textLiving.onClick(() => {
	console.log("客厅")
	gsap.to(camera.position, {
		x: livingPosition.x,
		y: livingPosition.y,
		z: livingPosition.z,
		duration: 1
	})
	moveTag("客厅")
})

// 创建厨房
let kitIndex = 3
let textureUrl = "./textures/room/kitchen"
let kitPosition = new THREE.Vector3(-5, 0, -10)
let kitEuler = new THREE.Euler(0, -Math.PI / 2, 0)
new Room("厨房", kitIndex, textureUrl, kitPosition, kitEuler)
// 创建厨房精灵文字
const text = new SpriteCanvas(camera, "厨房", new THREE.Vector3(-1, 0, -3))
scene.add(text.mesh)
text.onClick(() => {
	console.log("厨房")
	gsap.to(camera.position, {
		duration: 1,
		x: kitPosition.x,
		y: kitPosition.y,
		z: kitPosition.z
	})
	moveTag("厨房")
})

// 创建阳台
let balconyPosition = new THREE.Vector3(0, 0, 15)
let balconyIndex = 8
let balconyUrl = "./textures/room/balcony"
let balconyEuler = new THREE.Euler(0, Math.PI / 16, 0)
new Room("阳台", balconyIndex, balconyUrl, balconyPosition, balconyEuler)
// 创建阳台文字精灵
const textBalcony = new SpriteCanvas(camera, "阳台", new THREE.Vector3(0, 0, 3))
scene.add(textBalcony.mesh)
textBalcony.onClick(() => {
	console.log("阳台")
	gsap.to(camera.position, {
		x: balconyPosition.x,
		y: balconyPosition.y,
		z: balconyPosition.z,
		duration: 1
	})
	moveTag("阳台")
})
// 创建阳台回客厅文字精灵
const textBalconyToLiving = new SpriteCanvas(camera, "客厅", new THREE.Vector3(-1, 0, 11))
scene.add(textBalconyToLiving.mesh)
textBalconyToLiving.onClick(() => {
	console.log("客厅")
	gsap.to(camera.position, {
		x: livingPosition.x,
		y: livingPosition.y,
		z: livingPosition.z,
		duration: 1
	})
	moveTag("客厅")
})

// 创建走廊
let hallwayPosition = new THREE.Vector3(-15, 0, 0)
let hallwayIndex = 9
let hallwayUrl = "./textures/room/corridor"
let hallwayEuler = new THREE.Euler(0, -Math.PI + Math.PI / 16, 0)
new Room("走廊", hallwayIndex, hallwayUrl, hallwayPosition, hallwayEuler)
// 走廊文字精灵
const textCorridor = new SpriteCanvas(camera, "走廊", new THREE.Vector3(-4, 0, 0.5))
scene.add(textCorridor.mesh)
textCorridor.onClick(() => {
	console.log("走廊")
	gsap.to(camera.position, {
		x: hallwayPosition.x,
		y: hallwayPosition.y,
		z: hallwayPosition.z,
		duration: 1
	})
	moveTag("走廊")
})
// 创建走廊回客厅文字精灵
const textCorridorToLiving = new SpriteCanvas(camera, "客厅", new THREE.Vector3(-11, 0, 0))
scene.add(textCorridorToLiving.mesh)
textCorridorToLiving.onClick(() => {
	console.log("客厅")
	gsap.to(camera.position, {
		x: livingPosition.x,
		y: livingPosition.y,
		z: livingPosition.z,
		duration: 1
	})
	moveTag("客厅")
})

// 创建主卧
let mainPosition = new THREE.Vector3(-25, 0, 2)
let mainIndex = 18
let mainUrl = "./textures/room/bedroom"
new Room(
	"主卧",
	mainIndex,
	mainUrl,
	mainPosition
	// mainEuler
)
// 主卧文字精灵
const textMain = new SpriteCanvas(camera, "主卧", new THREE.Vector3(-19, 0, 2))
scene.add(textMain.mesh)
textMain.onClick(() => {
	console.log("主卧")
	gsap.to(camera.position, {
		x: mainPosition.x,
		y: mainPosition.y,
		z: mainPosition.z,
		duration: 1
	})
	moveTag("主卧")
})
// 创建主卧回走廊文字精灵
const textMainToCorridor = new SpriteCanvas(camera, "走廊", new THREE.Vector3(-23, 0, -2))
scene.add(textMainToCorridor.mesh)
textMainToCorridor.onClick(() => {
	console.log("走廊")
	gsap.to(camera.position, {
		x: hallwayPosition.x,
		y: hallwayPosition.y,
		z: hallwayPosition.z,
		duration: 1
	})
	moveTag("走廊")
})

THREE.DefaultLoadingManager.onLoad = () => {
	init()
	if (tagDiv.value) {
		tagDiv.value.style.cssText = `transform: translate(100px,110px);`
	}
	loading.value = false
}

// THREE.DefaultLoadingManager.onLoad = function (item, loaded, total) {
// 	 console.log(Number(((loaded / total) * 100).toFixed(2)))
// }

onUnmounted(() => {
	window.removeEventListener("mousedown", mouseDown)
	window.removeEventListener("mouseup", mouseUp)
	window.removeEventListener("mouseout", mouseOut)
	window.removeEventListener("mousemove", mouseMove)
})

let isMouseDown = false
const init = () => {
	if (!webgl.value) {
		return
	}

	window.addEventListener(
		"mousedown",
		() => {
			mouseDown()
		},
		false
	)
	window.addEventListener(
		"mouseup",
		() => {
			mouseUp()
		},
		false
	)
	window.addEventListener(
		"mouseout",
		() => {
			mouseOut()
		},
		false
	)
	// 是否按下鼠标，移动鼠标
	window.addEventListener("mousemove", (e: MouseEvent) => mouseMove(e), false)

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	renderer.render(scene, camera)
	requestAnimationFrame(renderScene)
}

const mouseDown = () => {
	isMouseDown = true
}

const mouseUp = () => {
	isMouseDown = false
}

const mouseOut = () => {
	isMouseDown = false
}

const mouseMove = (e: MouseEvent) => {
	if (isMouseDown) {
		camera.rotation.y += e.movementX * 0.001
		// camera.rotation.x += e.movementY * 0.001
		// camera.rotation.order = "XYZ"
	}
}
</script>

<style scoped lang="scss">
.page {
	width: 100%;
	height: 100%;
	display: flex;

	.webgl {
		flex: 1;
		position: relative;
	}

	.map {
		width: 300px;
		height: 260px;
		position: absolute;
		left: 0;
		bottom: 0;
		overflow: hidden;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}
	.map > img {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}
	.map > .tag {
		position: absolute;
		top: 0;
		left: 0;
		width: 30px;
		height: 30px;
		background-image: url("../../../assets/img/threejsDemo/houseViewing/location.png");
		background-size: cover;
		z-index: 1;
	}
	.loading {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-image: url("../../../assets/img/threejsDemo/houseViewing/loading.png");
		background-size: cover;
		filter: blur(50px);
		z-index: 100;
	}
	.progress {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 101;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px;
		color: #fff;
	}
	.progress > img {
		padding: 0 15px;
	}

	.title {
		width: 180px;
		height: 40px;
		position: fixed;
		right: 100px;
		top: 50px;
		background-color: rgba(0, 0, 0, 0.5);
		line-height: 40px;
		text-align: center;
		color: #fff;
		border-radius: 5px;
		z-index: 110;
	}
}
</style>
