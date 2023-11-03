import * as THREE from "three"
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer"
import gsap from "gsap"
import WebGl, { type IConfig } from "@utils/three/webGl"
import eventHub from "@utils/eventHub"
import vertexShader from "@/utils/three/shader/fighter/vertexShader.glsl?raw"
import fragmentShader from "@/utils/three/shader/fighter/fragmentShader.glsl?raw"

export default class SmartFactory extends WebGl {
	floor1Group: THREE.Group | undefined
	floor2Group: THREE.Group | undefined
	wallGroup: THREE.Group | undefined
	floor2Tags: CSS3DObject[] | undefined = []
	fighterGroup: THREE.Group | undefined
	mouse: THREE.Vector2 | undefined
	raycaster: THREE.Raycaster | undefined
	fighterPointsGroup: THREE.Group | undefined

	constructor(domElement: HTMLDivElement, config: IConfig = {}) {
		super(domElement, config)

		this.camera.position.set(300, 200, 500)
		this.addDirectionalLight(10, 100, 10, 0xffffff)
		this.webGlRender.toneMapping = THREE.ACESFilmicToneMapping
		this.webGlRender.toneMappingExposure = 0.8
		this.setBgHdr("./textures/hdr/2k.hdr")

		// 添加外墙
		this.addGltf("./threejsDemo/smartFactory/wall.glb").then(gltf => {
			this.wallGroup = gltf.scene
			this.scene.add(gltf.scene)
		})

		// 添加第一层
		this.addGltf("./threejsDemo/smartFactory/floor1.glb").then(gltf => {
			this.floor1Group = gltf.scene
			gltf.scene.traverse(child => {
				if (child instanceof THREE.Mesh) {
					child.material.emissiveIntensity = 5
				}
			})
			this.floor1Group.visible = false
			this.scene.add(this.floor1Group)
		})

		// 添加第二层
		this.addGltf("./threejsDemo/smartFactory/floor2.glb").then(gltf => {
			this.floor2Group = gltf.scene
			gltf.scene.traverse(child => {
				if (child instanceof THREE.Mesh) {
					child.material.emissiveIntensity = 10
				}
				if (child.type === "Object3D" && child.children.length === 0) {
					const css3dObject = this.createTag(child)
					css3dObject.visible = false
					this.floor2Tags?.push(css3dObject)
					this.floor2Group?.add(css3dObject)
				}
			})
			this.floor2Group.visible = false
			this.scene.add(this.floor2Group)

			// 添加飞机
			this.addGltf("./threejsDemo/smartFactory/Fighter.glb").then(gltf => {
				this.fighterGroup = gltf.scene
				this.fighterGroup.visible = false
				this.scene.add(this.fighterGroup)
				this.fighterGroup.position.set(5, 42, 68)
				this.fighterGroup.traverse(child => {
					if (child instanceof THREE.Mesh) {
						child.material.emissiveIntensity = 15
					}
				})
				this.mouse = new THREE.Vector2()
				this.raycaster = new THREE.Raycaster()
				// 事件监听
				window.addEventListener("click", event => {
					//   对时间对象进行加工
					// 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
					if (!this.mouse || !this.fighterGroup || !this.floor2Group || !this.floor2Tags) return
					this.mouse.x = (event.clientX / this.domElement.offsetWidth) * 2 - 1
					this.mouse.y = -((event.clientY / this.domElement.offsetHeight) * 2 - 1)

					//通过摄像机和鼠标位置更新射线
					this.raycaster?.setFromCamera(this.mouse, this.camera)

					//进行检测
					const intersects = this.raycaster?.intersectObject(this.fighterGroup)
					if (intersects && intersects.length > 0) {
						if (this.floor2Group.visible) {
							this.floor2Group.visible = false
							this.floor2Tags.forEach(tag => {
								tag.visible = false
							})
						} else {
							this.floor2Group.visible = true
							this.floor2Tags.forEach(tag => {
								tag.visible = true
							})
						}
					}
				})
			})
		})

		this.initEvent()
	}

	/**
	 * 创建标签
	 * @param Object3D
	 * @returns CSS3DObject
	 */
	createTag(object3d: THREE.Object3D) {
		// 创建各个区域的元素
		const element = document.createElement("div")
		element.className = "elementTag"
		element.innerHTML = `
          <div class="elementContent">
            <h3>${object3d.name}</h3>
            <p>温度:26℃</p>
            <p>湿度:50%</p>
          </div>
        `
		const objectCSS3D = new CSS3DObject(element)
		objectCSS3D.position.copy(object3d.position)
		objectCSS3D.scale.set(0.2, 0.2, 0.2)
		return objectCSS3D
	}

	showFloor1() {
		if (!this.floor1Group) return
		this.floor1Group.visible = true
	}

	hideFloor1() {
		if (!this.floor1Group) return
		this.floor1Group.visible = false
	}

	showFloor2() {
		if (!this.floor2Group || !this.fighterGroup) return
		this.floor2Group.visible = true
		this.fighterGroup.visible = true
		this.floor2Tags?.forEach(tag => {
			tag.visible = true
		})
	}

	hideFloor2() {
		if (!this.floor2Group || !this.fighterGroup) return
		this.floor2Group.visible = false
		this.fighterGroup.visible = false
		this.floor2Tags?.forEach(tag => {
			tag.visible = false
		})
	}

	showWall() {
		if (!this.wallGroup) return
		this.wallGroup.visible = true
	}

	hideWall() {
		if (!this.wallGroup) return
		this.wallGroup.visible = false
	}

	showAll() {
		this.showFloor1()
		this.showFloor2()
		this.showWall()
		if (!this.wallGroup || !this.floor2Group) return
		gsap.to(this.wallGroup?.position, {
			y: 200,
			duration: 1
		})
		gsap.to(this.floor2Group?.position, {
			y: 100,
			duration: 1,
			delay: 1
		})
	}

	hideAll() {
		if (!this.wallGroup || !this.floor2Group) return
		gsap.to(this.wallGroup?.position, {
			y: 0,
			duration: 1,
			delay: 1,
			onComplete: () => {
				this.hideFloor1()
				this.hideFloor2()
			}
		})
		gsap.to(this.floor2Group?.position, {
			y: 0,
			duration: 1
		})
	}

	flat() {
		// 将飞机展成立方体
		// 获取立方体点的位置
		const positions: THREE.Vector3[] = []
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				positions.push(new THREE.Vector3(i * 2 - 2, j * 2 - 2, 0))
			}
		}
		let n = 0
		this.fighterGroup?.traverse(child => {
			if (child instanceof THREE.Mesh) {
				positions[n].multiplyScalar(10)
				;(child as any).position2 = child.position.clone()
				gsap.to(child.position, {
					x: positions[n].x,
					y: positions[n].y,
					z: positions[n].y,
					duration: 1
				})
				n++
			}
		})
	}

	recoverFlat() {
		this.fighterGroup?.traverse(child => {
			if (child instanceof THREE.Mesh) {
				gsap.to(child.position, {
					x: (child as any).position2.x,
					y: (child as any).position2.y,
					z: (child as any).position2.z,
					duration: 1
				})
			}
		})
	}

	pointFighter() {
		if (!this.fighterPointsGroup) {
			console.log(345)

			this.fighterPointsGroup = this.transformPoints(this.fighterGroup)
			console.log(this.fighterPointsGroup)

			if (!this.fighterPointsGroup) return
			this.scene.add(this.fighterPointsGroup)
		}
	}

	transformPoints(object3d: THREE.Group | undefined) {
		// 创建纹理图像
		const texture = new THREE.TextureLoader().load("./threejsDemo/smartCity/1.png")
		const group = new THREE.Group()
		if (!object3d) return
		function createPoints(object: THREE.Object3D, newObject3d: THREE.Object3D) {
			if (object.children.length > 0) {
				object.children.forEach(child => {
					if (child instanceof THREE.Mesh) {
						// 随机生成颜色
						const color = new THREE.Color(Math.random(), Math.random(), Math.random())

						const material = new THREE.ShaderMaterial({
							uniforms: {
								uColor: { value: color },
								uTexture: { value: texture },
								uTime: {
									value: 0
								}
							},
							vertexShader: vertexShader,
							fragmentShader: fragmentShader,
							blending: THREE.AdditiveBlending,
							transparent: true,
							depthTest: false
						})
						const points = new THREE.Points(child.geometry, material)
						points.position.copy(child.position)
						points.rotation.copy(child.rotation)
						points.scale.copy(child.scale)
						newObject3d.add(points)
						createPoints(child, points)
					}
				})
			}
		}

		createPoints(object3d, group)

		return group
	}

	pointBlast() {
		this.fighterPointsGroup?.traverse(child => {
			if (child instanceof THREE.Points) {
				const randomPositionArray = new Float32Array(child.geometry.attributes.position.count * 3)
				for (let i = 0; i < child.geometry.attributes.position.count; i++) {
					randomPositionArray[i * 3] = (Math.random() * 2 - 1) * 10
					randomPositionArray[i * 3 + 1] = (Math.random() * 2 - 1) * 10
					randomPositionArray[i * 3 + 2] = (Math.random() * 2 - 1) * 10
				}
				child.geometry.setAttribute("aPosition", new THREE.BufferAttribute(randomPositionArray, 3))
				gsap.to(child.material.uniforms.uTime, {
					value: 10,
					duration: 10
				})
			}
		})
	}

	pointBack() {
		this.fighterPointsGroup?.traverse(child => {
			if (child instanceof THREE.Points) {
				gsap.to(child.material.uniforms.uTime, {
					value: 0,
					duration: 10
				})
			}
		})
	}

	initEvent() {
		eventHub.on("showFloor1", () => {
			this.showFloor1()
			this.hideWall()
			this.hideFloor2()
		})
		eventHub.on("showFloor2", () => {
			this.showFloor2()
			this.hideFloor1()
			this.hideWall()
		})
		eventHub.on("showWall", () => {
			this.showWall()
			this.hideFloor1()
			this.hideFloor2()
		})
		eventHub.on("showAll", () => {
			this.showAll()
		})
		eventHub.on("hideAll", () => {
			this.hideAll()
		})
		eventHub.on("flat", () => {
			this.flat()
		})
		eventHub.on("recoverFlat", () => {
			this.recoverFlat()
		})
		eventHub.on("pointBlast", () => {
			this.pointBlast()
		})
		eventHub.on("pointBack", () => {
			this.pointBack()
		})
		eventHub.on("pointFighter", () => {
			this.pointFighter()
		})
	}
}
