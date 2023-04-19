import * as THREE from "three"
import WebGl, { type IConfig } from "@utils/three/webGl"
import Clouds from "@/utils/three/mesh/clouds"
import Ocean from "@/utils/three/mesh/ocean"
import { Octree } from "three/examples/jsm/math/Octree"
import { Capsule } from "three/examples/jsm/math/Capsule"

export default class Metaverse extends WebGl {
	playerCollider: Capsule | undefined
	robot: THREE.Group | undefined
	capsule: THREE.Object3D<THREE.Event> | undefined
	mixer: THREE.AnimationMixer | undefined
	activeAction: THREE.AnimationAction | undefined
	// 设置动作混合器
	actions: any = {}
	// 设置重力
	gravity = -9.8
	// 玩家的速度
	playerVelocity = new THREE.Vector3(0, 0, 0)
	// 方向向量
	playerDirection = new THREE.Vector3(0, 0, 0)
	// 键盘按下事件
	keyStates = {
		KeyW: false,
		KeyA: false,
		KeyS: false,
		KeyD: false,
		Space: false,
		isDown: false
	}
	// 玩家是否在地面上
	playerOnFloor = false
	capsuleBodyControl: THREE.Object3D<THREE.Event> | undefined
	worldOctree: Octree | undefined
	prevAction: THREE.AnimationAction | undefined

	constructor(
		domElement: HTMLDivElement,
		controls: boolean = false,
		css3dRednerer: boolean = false,
		effect: boolean = false,
		config: IConfig = {}
	) {
		super(domElement, controls, css3dRednerer, effect, config)
		this.webGlRender.outputEncoding = THREE.sRGBEncoding
		this.webGlRender.physicallyCorrectLights = true
		this.webGlRender.toneMapping = THREE.ACESFilmicToneMapping
		this.webGlRender.toneMappingExposure = 0.75

		this.activeCamera.position.set(0, 2, 10)
		this.setBgHdr("./textures/hdr/sky11.hdr")
		this.addStats()
		this.addLight()
		this.addCloud()
		this.addOcean()
		this.addModel()
	}

	// 添加灯光
	addLight() {
		this.addAmbientLight(0xffffff, 0.2)
		const light1 = this.addDirectionalLight(0, 10, 10, 0xffffff, 0.1)
		light1.shadow.mapSize.width = 10240
		light1.shadow.mapSize.height = 10240
		const light2 = this.addDirectionalLight(0, 10, -10, 0xffffff, 0.1)
		light2.shadow.mapSize.width = 10240
		light2.shadow.mapSize.height = 10240
		const light3 = this.addDirectionalLight(10, 10, 10, 0xffffff, 0.6)
		light3.shadow.mapSize.width = 10240
		light3.shadow.mapSize.height = 10240
	}

	// 添加云
	addCloud() {
		const clouds = new Clouds()
		this.scene.add(clouds.mesh)
	}

	// 添加海洋
	addOcean() {
		const ocean = new Ocean()
		this.scene.add(ocean.mesh)
	}

	// 加载模型
	addModel() {
		this.addGltf("./model/glb/metaScene03.glb").then(gltf => {
			const planeGroup = new THREE.Group()
			planeGroup.position.copy(gltf.scene.children[0].position)
			gltf.scene.add(planeGroup)
			gltf.scene.traverse(child => {
				if (child instanceof THREE.Mesh && child.material && child.material.name.indexOf("KB3D_DLA_ConcreteRiverRock") !== -1) {
					planeGroup.add(child.clone())
					child.visible = false
				}
				if (child instanceof THREE.Mesh && child.material && child.material.name.indexOf("KB3D_DLA_ConcreteScreedTan") !== -1) {
					planeGroup.add(child.clone())
					child.visible = false
				}
				if (
					child instanceof THREE.Mesh &&
					child.material &&
					child.material.name.indexOf("KB3D_DLA_ConcretePittedGrayLight") !== -1
				) {
					planeGroup.add(child.clone())
					child.visible = false
				}
			})

			this.scene.add(gltf.scene)

			this.worldOctree = new Octree()
			this.worldOctree.fromGraphNode(planeGroup)

			this.addPhysics()
		})
	}

	addPhysics() {
		// 创建一个人的碰撞体
		this.playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1.35, 0), 0.35)

		// 设置激活动作
		this.addGltf("./model/glb/RobotExpressive.glb").then(gltf => {
			this.robot = gltf.scene
			this.robot.scale.set(0.5, 0.5, 0.5)
			this.robot.position.set(0, -0.88, 0)
			this.capsule?.add(this.robot)

			this.mixer = new THREE.AnimationMixer(this.robot)
			for (let i = 0; i < gltf.animations.length; i++) {
				const name = gltf.animations[i].name
				this.actions[name] = this.mixer.clipAction(gltf.animations[i])
				if (name === "Idle" || name === "Walking" || name === "Running") {
					this.actions[name].clampWhenFinished = false
					this.actions[name].loop = THREE.LoopRepeat
				} else {
					this.actions[name].clampWhenFinished = true
					this.actions[name].loop = THREE.LoopOnce
				}
			}
			this.activeAction = this.actions["Idle"]
			this.activeAction?.play()
		})

		// 创建胶囊对象
		this.capsule = new THREE.Object3D()
		this.capsule.position.set(0, 0.85, 0)

		// 将相机作为胶囊的子元素，就可以实现跟随
		const backCamera = this.addPerspectiveCamera(0, 2, 5, 45, "backCamera")

		this.activeCamera.position.set(0, 2, -5)
		this.activeCamera.lookAt(this.capsule.position)
		backCamera.lookAt(this.capsule.position)

		// 控制旋转上下的空3d对象
		this.capsuleBodyControl = new THREE.Object3D()
		this.capsuleBodyControl.add(this.activeCamera)
		this.capsuleBodyControl.add(backCamera)
		this.capsule.add(this.capsuleBodyControl)

		this.scene.add(this.capsule)

		// 根据键盘按下的键来更新键盘的状态
		document.addEventListener(
			"keydown",
			event => {
				this.keyStates[event.code as keyof typeof this.keyStates] = true
				this.keyStates.isDown = true
			},
			false
		)

		document.addEventListener(
			"keyup",
			event => {
				this.keyStates[event.code as keyof typeof this.keyStates] = false
				this.keyStates.isDown = false
				if (event.code === "KeyV") {
					this.activeCamera = this.activeCamera.name === "backCamera" ? this.cameraList["1"] : this.cameraList["backCamera"]
				}
				if (event.code === "KeyT") {
					// 打招呼
					this.fadeToAction("Wave")
				}
			},
			false
		)
		document.addEventListener(
			"mousedown",
			() => {
				// 锁定鼠标指针
				document.body.requestPointerLock()
			},
			false
		)
		// 根据鼠标在屏幕移动，来旋转胶囊
		window.addEventListener(
			"mousemove",
			event => {
				if (!this.capsule || !this.capsuleBodyControl) return
				this.capsule.rotation.y -= event.movementX * 0.003

				this.capsuleBodyControl.rotation.x += event.movementY * 0.003
				if (this.capsuleBodyControl.rotation.x > Math.PI / 8) {
					this.capsuleBodyControl.rotation.x = Math.PI / 8
				} else if (this.capsuleBodyControl.rotation.x < -Math.PI / 8) {
					this.capsuleBodyControl.rotation.x = -Math.PI / 8
				}
			},
			false
		)
	}

	updatePlayer(deltaTime: number) {
		const damping = -0.25
		if (this.playerOnFloor) {
			this.playerVelocity.y = 0

			this.keyStates.isDown || this.playerVelocity.addScaledVector(this.playerVelocity, damping)
		} else {
			this.playerVelocity.y += this.gravity * deltaTime
		}

		// 计算玩家移动的距离
		const playerMoveDistance = this.playerVelocity.clone().multiplyScalar(deltaTime)
		this.playerCollider?.translate(playerMoveDistance)
		// 将胶囊的位置进行设置
		this.playerCollider?.getCenter(this.capsule!.position)

		// 进行碰撞检测
		this.playerCollisions()

		// 如果有水平的运动，则设置运动的动作
		if (
			Math.abs(this.playerVelocity.x) + Math.abs(this.playerVelocity.z) > 0.1 &&
			Math.abs(this.playerVelocity.x) + Math.abs(this.playerVelocity.z) <= 3
		) {
			this.fadeToAction("Walking")
		} else if (Math.abs(this.playerVelocity.x) + Math.abs(this.playerVelocity.z) > 3) {
			this.fadeToAction("Running")
		} else {
			this.fadeToAction("Idle")
		}
	}

	playerCollisions() {
		// 人物碰撞检测
		const result = this.worldOctree?.capsuleIntersect(this.playerCollider!)
		this.playerOnFloor = false
		if (result) {
			this.playerOnFloor = result.normal.y > 0
			this.playerCollider?.translate(result.normal.multiplyScalar(result.depth))
		}
	}

	controlPlayer(deltaTime: number) {
		if (this.keyStates["KeyW"]) {
			this.playerDirection.z = 1
			//获取胶囊的正前面方向
			const capsuleFront = new THREE.Vector3(0, 0, 0)
			this.capsule?.getWorldDirection(capsuleFront)
			// 计算玩家的速度
			// 当速度超过最大速度时，不操作
			if (this.playerVelocity.x * this.playerVelocity.x + this.playerVelocity.z * this.playerVelocity.z <= 200) {
				this.playerVelocity.add(capsuleFront.multiplyScalar(deltaTime * 5))
			}
		}
		if (this.keyStates["KeyS"]) {
			this.playerDirection.z = 1
			//获取胶囊的正前面方向
			const capsuleFront = new THREE.Vector3(0, 0, 0)
			this.capsule?.getWorldDirection(capsuleFront)
			// 计算玩家的速度
			this.playerVelocity.add(capsuleFront.multiplyScalar(-deltaTime))
		}
		if (this.keyStates["KeyA"]) {
			this.playerDirection.x = 1
			//获取胶囊的正前面方向
			const capsuleFront = new THREE.Vector3(0, 0, 0)
			this.capsule?.getWorldDirection(capsuleFront)

			// 侧方的方向，正前面的方向和胶囊的正上方求叉积，求出侧方的方向
			capsuleFront.cross(this.capsule!.up)
			// 计算玩家的速度
			this.playerVelocity.add(capsuleFront.multiplyScalar(-deltaTime))
		}
		if (this.keyStates["KeyD"]) {
			this.playerDirection.x = 1
			//获取胶囊的正前面方向
			const capsuleFront = new THREE.Vector3(0, 0, 0)
			this.capsule?.getWorldDirection(capsuleFront)

			// 侧方的方向，正前面的方向和胶囊的正上方求叉积，求出侧方的方向
			capsuleFront.cross(this.capsule!.up)
			// 计算玩家的速度
			this.playerVelocity.add(capsuleFront.multiplyScalar(deltaTime))
		}
		if (this.keyStates["Space"]) {
			this.playerVelocity.y = 5
		}
	}

	fadeToAction(actionName: string) {
		this.prevAction = this.activeAction

		this.activeAction = this.actions[actionName]
		if (this.prevAction !== this.activeAction) {
			this.prevAction?.fadeOut(0.3)
			this.activeAction?.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.3).play()

			this.mixer?.addEventListener("finished", () => {
				this.prevAction = this.activeAction
				this.activeAction = this.actions["Idle"]
				this.prevAction?.fadeOut(0.3)
				this.activeAction?.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.3).play()
			})
		}
	}

	resetPlayer() {
		if (this.capsule && this.capsule.position.y < -20) {
			this.playerCollider?.start.set(0, 2.35, 0)
			this.playerCollider?.end.set(0, 3.35, 0)
			this.playerCollider!.radius = 0.35
			this.playerVelocity.set(0, 0, 0)
			this.playerDirection.set(0, 0, 0)
		}
	}

	// 更新场景
	updateMetaverse() {
		const delta = this.clock.getDelta()
		this.controlPlayer(delta)
		this.updatePlayer(delta)
		this.resetPlayer()
		if (this.mixer) {
			this.mixer.update(delta)
		}
		this.update()
	}
}
