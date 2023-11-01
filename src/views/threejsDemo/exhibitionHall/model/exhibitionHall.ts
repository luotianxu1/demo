import * as THREE from "three"
import * as CANNON from "cannon-es"
import WebGl, { type IConfig } from "@utils/three/webGl"
import { PointerLockControlsCannon } from "@/utils/three/mesh/PointerLockControlsCannon"
import { color, float, texture, normalMap, uv, MeshPhysicalNodeMaterial, mx_noise_vec3 } from "three/nodes"
import { Reflector } from "@/utils/three/mesh/Reflector"
import { FlakesTexture } from "three/addons/textures/FlakesTexture.js"

export default class ExhibitionHall extends WebGl {
	control: PointerLockControlsCannon | undefined
	world
	sphereMesh
	sphereBody
	robot: THREE.Group | undefined

	constructor(
		domElement: HTMLDivElement,
		controls: boolean = true,
		css3dRednerer: boolean = false,
		effect: boolean = false,
		config: IConfig = {}
	) {
		super(domElement, controls, css3dRednerer, effect, config)
		this.webGlRender.shadowMap.type = THREE.PCFSoftShadowMap
		this.webGlRender.toneMapping = THREE.ACESFilmicToneMapping
		this.webGlRender.toneMappingExposure = 1

		this.activeCamera.position.set(0, 2, 8)
		this.activeCamera.lookAt(0, 0, -2)

		this.loaderMap("./textures/map/0006_4k.jpg").then(envMap => {
			envMap.mapping = THREE.EquirectangularReflectionMapping
			// 设置为环境纹理
			this.scene.background = envMap
			this.scene.environment = envMap
		})

		this.addAmbientLight(0xffffff, 1)

		this.world = new CANNON.World()
		this.world.gravity.set(0, -9.82, 0)

		// 初始化物理材质
		this.world.defaultContactMaterial.contactEquationStiffness = 1e9
		this.world.defaultContactMaterial.contactEquationRelaxation = 4

		const solver = new CANNON.GSSolver()
		solver.iterations = 7
		solver.tolerance = 0.1

		this.world.solver = new CANNON.SplitSolver(solver)

		// 创建物理材质
		const physicsMaterial = new CANNON.Material("physics")
		const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
			// 当摩擦力为0时，物体不会滑动
			friction: 0,
			// 弹性系数
			restitution: 0.3
		})
		// 将物理材质添加到世界中
		this.world.addContactMaterial(physics_physics)

		// 创建一个平面
		const groundShape = new CANNON.Plane()
		const groundBody = new CANNON.Body({
			mass: 0,
			material: physicsMaterial
		})
		groundBody.addShape(groundShape)
		groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
		this.world.addBody(groundBody)

		// 创建一个球体
		const radius = 0.8
		const sphereShape = new CANNON.Sphere(radius)
		this.sphereBody = new CANNON.Body({
			mass: 5,
			material: physicsMaterial
		})
		this.sphereBody.addShape(sphereShape)
		this.sphereBody.linearDamping = 0.9
		this.sphereBody.position.set(0, 5, 10)
		this.world.addBody(this.sphereBody)

		// 创建threejs的球体
		const sphereGeometry = new THREE.SphereGeometry(radius, 8, 8)
		const sphereMaterial = new THREE.MeshStandardMaterial({
			color: 0xff0000,
			wireframe: true
		})
		this.sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
		this.scene.add(this.sphereMesh)

		this.initPointerLock()

		// 机器人
		this.addGltf("./model/glb/robot.glb").then(gltf => {
			this.robot = gltf.scene
			this.robot.children[0].position.set(0, -0.8, 0)
			this.robot.children[0].rotation.set(0, Math.PI, 0)
			this.sphereMesh.add(this.robot)
			// this.robot.add(this.activeCamera)
		})

		this.addGltf("./model/glb/roomModel/ground03.glb").then(gltf => {
			// 镜面反射的地面
			const mirrorGeometry = new THREE.PlaneGeometry(100, 100)
			const groundMirror = new Reflector(mirrorGeometry, {
				clipBias: 0.003,
				textureWidth: window.innerWidth * window.devicePixelRatio,
				textureHeight: window.innerHeight * window.devicePixelRatio,
				color: 0x777777
			})
			groundMirror.position.y = 0.1
			groundMirror.rotateX(-Math.PI / 2)
			this.scene.add(groundMirror)

			const model = gltf.scene

			const nodeMaterial = new MeshPhysicalNodeMaterial()
			this.loaderMap("./textures/map/Marble_White_006_basecolor.jpg").then(groundTexture => {
				groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
				const groundUv = uv().mul(10)
				nodeMaterial.colorNode = texture(groundTexture, groundUv)
				nodeMaterial.normalNode = normalMap(mx_noise_vec3(groundUv))
				nodeMaterial.clearcoatNode = float(1)
				nodeMaterial.clearcoatRoughnessNode = float(0.01)
				nodeMaterial.roughnessNode = mx_noise_vec3(groundUv)

				model.traverse(child => {
					if (child instanceof THREE.Mesh && child.name === "平面") {
						child.material = nodeMaterial
					}
				})
				this.scene.add(model)
			})
		})

		// 根据载入的立方体模型，创建一个物理立方体
		this.addGltf("./model/glb/roomModel/collisions.glb").then(gltf => {
			const model = gltf.scene
			model.traverse(child => {
				if (child instanceof THREE.Mesh) {
					// 根据缩放比例，修改shape的大小
					const shape = new CANNON.Box(new CANNON.Vec3(child.scale.x, child.scale.y, child.scale.z))
					const body = new CANNON.Body({
						mass: 0,
						material: physicsMaterial
					})
					body.addShape(shape)
					body.position.copy(child.position as any as CANNON.Vec3)
					body.quaternion.copy(child.quaternion as any as CANNON.Quaternion)
					this.world.addBody(body)
				}
			})
		})

		// 柱子
		this.addGltf("./model/glb/roomModel/ground.glb").then(gltf => {
			// 珠光漆材质
			const nodeMaterial = new MeshPhysicalNodeMaterial()
			const flakesTexture = new FlakesTexture()
			const canvasTexture = new THREE.CanvasTexture(flakesTexture)
			canvasTexture.anisotropy = 16
			canvasTexture.wrapS = THREE.RepeatWrapping
			canvasTexture.wrapT = THREE.RepeatWrapping

			nodeMaterial.colorNode = color(0xeeeeff)
			nodeMaterial.normalNode = normalMap(texture(canvasTexture, uv().mul(2.5, 1.5)), 0.15)
			nodeMaterial.metalnessNode = float(0.9)
			nodeMaterial.roughnessNode = float(0.5)
			nodeMaterial.clearcoatNode = float(1)
			nodeMaterial.clearcoatRoughnessNode = float(0.01)

			const model = gltf.scene
			model.traverse(child => {
				if (child instanceof THREE.Mesh) {
					child.material = nodeMaterial
				}
			})
			this.scene.add(model)
		})

		const textureLoader = new THREE.TextureLoader()
		// 主舞台
		const video = document.createElement("video")
		video.src = "./video/DigitalTwin.mp4"
		video.loop = true
		video.muted = true
		video.play()
		const videoTexture = new THREE.VideoTexture(video)
		this.addGltf("./model/glb/roomModel/stage.glb").then(gltf => {
			const model = gltf.scene

			const carbonTexture = textureLoader.load("./textures/map/Carbon.png")
			carbonTexture.encoding = THREE.sRGBEncoding
			carbonTexture.wrapS = THREE.RepeatWrapping
			carbonTexture.wrapT = THREE.RepeatWrapping
			const carbonNormal = textureLoader.load("./textures/map/Carbon_Normal.png")
			carbonNormal.wrapS = THREE.RepeatWrapping
			carbonNormal.wrapT = THREE.RepeatWrapping

			const carbonUv = uv().mul(5)
			const nodeMaterial = new MeshPhysicalNodeMaterial()
			nodeMaterial.colorNode = texture(carbonTexture, carbonUv)
			nodeMaterial.normalNode = normalMap(texture(carbonNormal, carbonUv)).mul(mx_noise_vec3(carbonUv))
			nodeMaterial.clearcoatNode = float(1)
			nodeMaterial.clearcoatRoughnessNode = float(0.01)
			nodeMaterial.roughnessNode = float(0.5)

			model.traverse(child => {
				if (child instanceof THREE.Mesh && child.material.name === "Material_579") {
					// 碳纤维材质
					child.material = nodeMaterial
				}
				if (child instanceof THREE.Mesh && child.material.name === "Material_593") {
					child.material.map = videoTexture
					child.material.emssiveMap = videoTexture
				}
			})
			this.scene.add(model)
		})

		// 副舞台
		this.addGltf("./model/glb/roomModel/stage02.glb").then(gltf => {
			const model = gltf.scene
			this.scene.add(model)
		})

		// 展板
		this.addGltf("./model/glb/roomModel/board.glb").then(gltf => {
			const model = gltf.scene
			this.scene.add(model)
		})

		// 添加灯光
		this.addGltf("./model/glb/roomModel/light.glb").then(gltf => {
			const model = gltf.scene
			model.traverse(child => {
				;(child as THREE.Light).intensity = 0.1
			})
			this.scene.add(model)
		})
	}

	initPointerLock() {
		this.control = new PointerLockControlsCannon(this.activeCamera, this.sphereBody)
		this.scene.add(this.control.getObject())
		this.webGlRender.domElement.addEventListener("click", () => {
			this.control!.lock()
		})
		this.control.addEventListener("lock", () => {
			this.control!.enabled = true
		})
		this.control.addEventListener("unlock", () => {
			this.control!.enabled = false
		})
	}

	// 更新场景
	updateExhibitionHall() {
		const delta = this.clock.getDelta()
		this.sphereMesh.position.copy(this.sphereBody.position as any as THREE.Vector3)
		this.world.step(1 / 60, delta, 3)
		this.control && this.robot && this.robot.quaternion.copy(this.control.getObject().quaternion)
		this.control && this.control.update(delta)
		this.webGlRender.render(this.scene, this.activeCamera)
	}
}
