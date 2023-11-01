<template>
	<div class="page" v-loading="loading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 1.0)">
		<div ref="container" class="webgl"></div>
		<div class="map" v-show="!loading">
			<div ref="tagDiv" class="tag"></div>
			<img src="../../../assets/img/threejsDemo/houseViewing/map.gif" alt="" />
		</div>
		<div class="title">VR全景看房</div>
	</div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import gsap from "gsap"

const container = ref()
let tagDiv = ref()
const loading = ref(true)
const loadingText = ref("加载中")

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

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 0)
camera.updateProjectionMatrix()
scene.add(camera)

// 创建渲染器
const webGLRenderer = new THREE.WebGLRenderer()
webGLRenderer.setSize(window.innerWidth, window.innerHeight)

class SpriteCanvas {
	fns: any[]
	context
	mesh
	raycaster
	mouse
	constructor(camera: THREE.PerspectiveCamera | THREE.Camera, text = "helloworld", position = new THREE.Vector3(0, 0, 0)) {
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

	onClick(fn: any) {
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

const roomsList = [
	{
		index: 0,
		name: "客厅",
		url: "./threejsDemo/houseViewing/livingroom",
		position: new THREE.Vector3(0, 0, 0)
	},
	{
		index: 3,
		name: "厨房",
		url: "./threejsDemo/houseViewing/kitchen",
		position: new THREE.Vector3(-5, 0, -10),
		euler: new THREE.Euler(0, -Math.PI / 2, 0)
	},
	{
		index: 8,
		name: "阳台",
		url: "./threejsDemo/houseViewing/balcony",
		position: new THREE.Vector3(0, 0, 15),
		euler: new THREE.Euler(0, Math.PI / 16, 0)
	},
	{
		index: 9,
		name: "走廊",
		url: "./threejsDemo/houseViewing/corridor",
		position: new THREE.Vector3(-15, 0, 0),
		euler: new THREE.Euler(0, -Math.PI + Math.PI / 16, 0)
	},
	{
		index: 18,
		name: "主卧",
		url: "./threejsDemo/houseViewing/bedroom",
		position: new THREE.Vector3(-25, 0, 2)
	}
]

roomsList.forEach(item => {
	new Room(item.name, item.index, item.url, item.position, item.euler)
})

// 创建厨房
let kitPosition = new THREE.Vector3(-5, 0, -10)
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

// 创建客厅
let livingPosition = new THREE.Vector3(0, 0, 0)
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

// 创建阳台
let balconyPosition = new THREE.Vector3(0, 0, 15)
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

onMounted(() => {
	init()
	if (tagDiv.value) {
		tagDiv.value.style.cssText = `
                transform: translate(100px,110px);
            `
	}
})

THREE.DefaultLoadingManager.onLoad = () => {
	loading.value = false
}

const init = () => {
	if (!container.value) {
		return
	}
	container.value.appendChild(webGLRenderer.domElement)

	renderScene()
}

const renderScene = () => {
	webGLRenderer.render(scene, camera)
	requestAnimationFrame(renderScene)
}

// 监听鼠标按下事件
window.addEventListener(
	"mousedown",
	() => {
		isMouseDown = true
	},
	false
)
// 监听鼠标抬起事件
window.addEventListener(
	"mouseup",
	() => {
		isMouseDown = false
	},
	false
)
// 监听鼠标移动事件
window.addEventListener(
	"mousemove",
	e => {
		if (isMouseDown) {
			camera.rotation.y += (e.movementX / window.innerWidth) * Math.PI
			// camera.rotation.x += (e.movementY / window.innerHeight) * Math.PI;
		}
	},
	false
)

onUnmounted(() => {
	window.removeEventListener("mousedown", mouseDown)
	window.removeEventListener("mouseup", mouseUp)
	window.removeEventListener("mousemove", mouseMove)
})

let isMouseDown = false
const mouseDown = () => {
	isMouseDown = true
}

const mouseUp = () => {
	isMouseDown = false
}

const mouseMove = (e: MouseEvent) => {
	if (isMouseDown) {
		camera.rotation.y += (e.movementX / window.innerWidth) * Math.PI
		// camera.rotation.x += (e.movementY / window.innerHeight) * Math.PI;
	}
}
</script>

<style scoped lang="scss">
.page {
	display: flex;
	width: 100%;
	height: 100%;

	.webgl {
		position: relative;
		flex: 1;
	}

	.map {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 300px;
		height: 260px;
		overflow: hidden;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}

	.map > img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.map > .tag {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		width: 30px;
		height: 30px;
		background-image: url("../../../assets/img/threejsDemo/houseViewing/location.png");
		background-size: cover;
	}

	.loading {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 100vw;
		height: 100vh;
		background-image: url("../../../assets/img/threejsDemo/houseViewing/loading.png");
		background-size: cover;
		filter: blur(50px);
	}

	.progress {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 101;
		display: flex;
		width: 100vw;
		height: 100vh;
		font-size: 20px;
		color: #fff;
		justify-content: center;
		align-items: center;
	}

	.progress > img {
		padding: 0 15px;
	}

	.title {
		position: fixed;
		top: 50px;
		right: 100px;
		z-index: 110;
		width: 180px;
		height: 40px;
		line-height: 40px;
		color: #fff;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 5px;
	}
}
</style>
