import * as THREE from "three"
import WebGl, { type IConfig } from "@utils/three/webGl"
import eventHub from "@utils/eventHub"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default class SmartPark extends WebGl {
	gltf: GLTF | undefined
	mixer: THREE.AnimationMixer | undefined
	clip: THREE.AnimationClip | undefined
	action: THREE.AnimationAction | undefined
	curve: THREE.CatmullRomCurve3 | undefined
	curveProgress: number | undefined
	redcar: THREE.Object3D | undefined
	controls

	constructor(domElement: HTMLDivElement, config) {
		super(domElement, config)
		this.webGlRender.toneMapping = THREE.ACESFilmicToneMapping
		this.webGlRender.toneMappingExposure = 1.5

		this.camera.position.set(1000, 1000, 1000)

		if (this.controls instanceof OrbitControls) {
			this.controls!.maxPolarAngle = Math.PI / 2
			this.controls!.minPolarAngle = 0
		}

		this.setBgHdr("./textures/hdr/023.hdr")

		this.addDirectionalLight(10, 100, 10, 0xffffff, 1)

		this.addGltf("./threejsDemo/smartPark/city4.glb").then(gltf => {
			this.gltf = gltf
			this.scene.add(gltf.scene)

			gltf.scene.traverse(child => {
				if (child.name === "热气球") {
					this.mixer = new THREE.AnimationMixer(child)
					this.clip = gltf.animations[0]
					this.action = this.mixer.clipAction(this.clip)
					this.action.play()
				}
				if (child.name === "汽车园区轨迹") {
					const line = child as THREE.Mesh
					// 根据点创建曲线
					const points = []
					for (let i = line.geometry.attributes.position.count - 1; i >= 0; i--) {
						points.push(
							new THREE.Vector3(
								(line.geometry.attributes.position as THREE.BufferAttribute).getX(i),
								(line.geometry.attributes.position as THREE.BufferAttribute).getY(i),
								(line.geometry.attributes.position as THREE.BufferAttribute).getZ(i)
							)
						)
					}
					this.curve = new THREE.CatmullRomCurve3(points)
					this.curveProgress = 0
					this.carAnimation()
				}
				if (child.name === "redcar") {
					this.redcar = child
				}
			})
			gltf.cameras.forEach(camera => {
				this.cameraList[camera.name as keyof typeof this.cameraList] = camera as THREE.PerspectiveCamera
			})

			this.initEvent()
		})
	}

	// 切换相机
	toggleCamera(name: string) {
		this.camera = this.cameraList[name as keyof typeof this.cameraList]
	}

	// 汽车动画
	carAnimation() {
		gsap.to(this, {
			curveProgress: 0.999,
			duration: 10,
			repeat: -1,
			onUpdate: () => {
				if (!this.curveProgress || !this.curve || !this.redcar) return
				const point = this.curve.getPoint(this.curveProgress)
				this.redcar.position.set(point.x, point.y, point.z)
				if (this.curveProgress + 0.001 < 1) {
					const points = this.curve.getPoint(this.curveProgress + 0.001)
					this.redcar.lookAt(points)
				}
			}
		})
	}

	// 切换动画
	actionClick(i: any) {
		this.action?.reset()
		this.clip = this.gltf?.animations[i]
		if (this.clip && this.action) {
			this.action = this.mixer?.clipAction(this.clip)
			this.action?.play()
		}
	}

	setFlyControls() {
		this.controls = this.createFlyControls(this.camera, this.webGlRender)
	}

	// 更新场景
	updateSmartPark() {
		const time = this.clock.getDelta()
		this.mixer?.update(time * 2)
		this.update()
	}

	initEvent() {
		eventHub.on("actionClick", i => {
			this.actionClick(i)
		})
		eventHub.on("toggleCamera", name => {
			this.toggleCamera(name as string)
		})
		eventHub.on("toggleControls", () => {
			this.createFlyControls()
		})
	}
}
