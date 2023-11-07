import * as THREE from "three"
import gsap from "gsap"

export interface ISpriteIcon {
	position: {
		x: number
		y: number
		z: number
	}
	url: string
	scale: number
	max: number
	camera?: THREE.PerspectiveCamera
}

export default class SpriteIcon {
	config: ISpriteIcon
	material: THREE.SpriteMaterial
	mesh: THREE.Sprite
	fns: Array<Function> = []
	raycaster: THREE.Raycaster
	mouse: THREE.Vector2
	camera: THREE.Camera

	constructor(config: ISpriteIcon) {
		this.config = config
		const textureLoader = new THREE.TextureLoader()
		const map = textureLoader.load(this.config.url)
		this.material = new THREE.SpriteMaterial({ map: map })

		this.mesh = new THREE.Sprite(this.material)
		this.mesh.position.set(this.config.position.x, this.config.position.y, this.config.position.z)
		this.mesh.scale.set(this.config.scale, this.config.scale, this.config.scale)

		gsap.to(this.mesh.scale, {
			x: this.config.scale + this.config.max,
			z: this.config.scale + this.config.max,
			y: this.config.scale + this.config.max,
			duration: 1,
			repeat: -1,
			ease: "none"
		})

		this.config.camera && this.addEventListener(config.camera)
	}

	addEventListener(camera) {
		this.camera = camera
		// 封装点击事件
		this.fns = []
		// 创建射线
		this.raycaster = new THREE.Raycaster()
		this.mouse = new THREE.Vector2()
		window.addEventListener("click", event => {
			this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
			this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
			this.raycaster.setFromCamera(this.mouse, this.camera)
			const intersects = this.raycaster.intersectObject(this.mesh)

			;(event as any).mesh = this.mesh
			;(event as any).alarm = this

			if (intersects.length > 0) {
				this.fns.forEach(fn => {
					fn(event)
				})
			}
		})
	}

	onClick(fn) {
		this.fns.push(fn)
	}
}
