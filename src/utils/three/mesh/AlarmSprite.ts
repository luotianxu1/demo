import * as THREE from "three"

interface IMyFn extends Function {
	mesh: THREE.Sprite
	alarm: AlarmSprite
}

export default class AlarmSprite {
	camera: THREE.PerspectiveCamera
	material: THREE.SpriteMaterial
	mesh: THREE.Sprite
	fns: Array<Function> = []
	raycaster: THREE.Raycaster
	mouse: THREE.Vector2

	constructor(camera: THREE.PerspectiveCamera) {
		this.camera = camera
		const textureLoader = new THREE.TextureLoader()
		const map = textureLoader.load("./textures/alarm/warning.png")
		this.material = new THREE.SpriteMaterial({ map: map })

		this.mesh = new THREE.Sprite(this.material)
		this.mesh.position.set(-4.2, 3.5, -1)

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

	onClick(fn: (e?: IMyFn) => void) {
		this.fns.push(fn)
	}
}
