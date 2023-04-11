import * as THREE from "three"
import gsap from "gsap"

export default class Clouds {
	mesh
	height
	num
	scale
	autoRotate

	constructor(height = 20, num = 100, size = 400, scale = 100, autoRotate = true) {
		this.height = height
		this.num = num
		this.scale = scale
		this.autoRotate = autoRotate
		const textureLoader = new THREE.TextureLoader()
		const map1 = textureLoader.load("./textures/cloud/cloud1.jfif")
		const map2 = textureLoader.load("./textures/cloud/cloud2.jfif")
		const map3 = textureLoader.load("./textures/cloud/cloud3.jpg")

		const materials: Array<THREE.PointsMaterial> = []
		const material1 = new THREE.PointsMaterial({
			color: 0xffffff,
			map: map1,
			alphaMap: map2,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
			depthTest: false,
			size: 0.5 * size
		})
		const material2 = new THREE.PointsMaterial({
			color: 0xffffff,
			map: map2,
			alphaMap: map3,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
			depthTest: false,
			size: 0.5 * size
		})
		const material3 = new THREE.PointsMaterial({
			color: 0xffffff,
			map: map3,
			alphaMap: map1,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
			depthTest: false,
			size: 0.5 * size
		})
		const material4 = new THREE.PointsMaterial({
			color: 0xffffff,
			map: map2,
			alphaMap: map1,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
			depthTest: false,
			size: size
		})
		materials.push(material1, material2, material3, material4)
		this.mesh = new THREE.Group()
		for (let i = 0; i < materials.length; i++) {
			const material = materials[i]
			const geometry = this.generateGeometry(this.num)
			const points = new THREE.Points(geometry, material)
			this.mesh.add(points)
		}

		if (this.autoRotate) {
			this.animate()
		}
	}

	generateGeometry(num = 300) {
		const vertices: Array<number> = []
		for (let i = 0; i < num; i++) {
			const randomX = (Math.random() - 0.5) * 2 * this.scale
			const randomY = Math.random() * (this.height / 2) + this.height
			const randomZ = (Math.random() - 0.5) * 2 * this.scale
			vertices.push(randomX, randomY, randomZ)
		}
		const geometry = new THREE.BufferGeometry()
		geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))
		return geometry
	}

	animate() {
		let i = 1
		this.mesh.traverse(item => {
			const speed = 40 * i

			if (item instanceof THREE.Points) {
				gsap.to(item.rotation, {
					duration: speed,
					repeat: -1,
					y: Math.PI * 2
				})
			}
			i++
		})
	}
}
