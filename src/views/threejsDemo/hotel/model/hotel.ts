import * as THREE from "three"
import WebGl, { type IConfig } from "@utils/three/webGl"
import Ocean from "@/utils/three/mesh/ocean"
import SphereSky from "@/utils/three/mesh/sphereSky"
import gsap from "gsap"

export default class SmartFactory extends WebGl {
	isDay: boolean = true
	vetroMaterial: any
	videoTexture

	constructor(
		domElement: HTMLDivElement,
		controls: boolean = true,
		css3dRednerer: boolean = false,
		effect: boolean = false,
		config: IConfig = {}
	) {
		super(domElement, controls, css3dRednerer, effect, config)

		this.webGlRender.toneMappingExposure = 0.1
		this.webGlRender.outputEncoding = THREE.sRGBEncoding
		this.webGlRender.toneMapping = THREE.ACESFilmicToneMapping
		this.webGlRender.sortObjects = true
		this.activeCamera.position.set(-117, 17, -140)
		this.addStats()

		this.setBgHdr("./textures/hdr/023.hdr").then(() => {
			this.addSphereSky()
		})

		// 添加水
		const ocean = new Ocean()
		this.scene.add(ocean.mesh)

		this.addGltf("./threejsDemo/hotel/building-min02.glb").then(gltf => {
			gltf.scene.traverse(child => {
				if (child instanceof THREE.Mesh) {
					child.castShadow = true
					child.receiveShadow = true
					child.material.shadowSide = THREE.BackSide
				}
				if (child instanceof THREE.Mesh && child.name === "Plane") {
					child.visible = false
				}
				if (child instanceof THREE.Mesh && child.material.name === "Vetro") {
					this.vetroMaterial = child.material
				}
			})
			this.scene.add(gltf.scene)
		})

		const video = document.createElement("video")
		video.src = "./threejsDemo/hotel/sucai01.mp4"
		video.autoplay = true
		video.loop = true
		video.muted = true
		video.play()
		this.videoTexture = new THREE.VideoTexture(video)
	}
	addSphereSky() {
		const uTime = {
			value: 0
		}
		this.isDay = true
		const sphereSky = new SphereSky(10000, uTime, this.scene.environment)
		this.scene.add(sphereSky.mesh, sphereSky.sun)

		// 动态修改时间
		gsap.to(uTime, {
			value: 24,
			duration: 24,
			repeat: -1,
			ease: "linear",
			onUpdate: () => {
				sphereSky.updateSun(uTime.value)
				if (uTime.value > 6 && uTime.value <= 18 && this.isDay === false) {
					sphereSky.sun.visible = true
					this.isDay = true
					this.day()
				}
				if ((uTime.value > 18 || uTime.value <= 6) && this.isDay === true) {
					this.isDay = false
					sphereSky.sun.visible = false
					this.night()
				}
				if (Math.abs(uTime.value - 12) < 4) {
					this.webGlRender.toneMappingExposure = 1
				}
				if (Math.abs(uTime.value - 12) > 6) {
					this.webGlRender.toneMappingExposure = 0.3
				}
				if (Math.abs(uTime.value - 12) >= 4 && Math.abs(uTime.value - 12) <= 6) {
					let strength = 1 - (Math.abs(uTime.value - 12) - 4) / 2
					strength < 0.3 || (strength = 0.3)
					this.webGlRender.toneMappingExposure = strength
				}
			}
		})
		return sphereSky
	}

	day() {
		this.vetroMaterial.emissive = new THREE.Color(0x000000)
	}

	night() {
		this.vetroMaterial.emissive = new THREE.Color(0x99cc99)
		this.vetroMaterial.emissiveMap = this.videoTexture
		this.vetroMaterial.emissiveIntensity = 1
	}
}
