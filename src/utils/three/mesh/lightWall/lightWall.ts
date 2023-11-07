import * as THREE from "three"
import vertex from "./shader/vertex.glsl?raw"
import fragment from "./shader/fragment.glsl?raw"
import gsap from "gsap"

export interface ILightWall {
	position: {
		x: number
		y: number
		z: number
	}
	height: number
	radius: number
	maxRadius: number
	color?: string
	name?: string
}

/**
 * 光墙
 */
export default class LightWall {
	config: ILightWall
	geometry: THREE.TubeGeometry
	material: THREE.ShaderMaterial
	mesh: THREE.Mesh<THREE.TubeGeometry, THREE.ShaderMaterial>
	gsap

	constructor(config: ILightWall) {
		this.config = config

		const point1 = new THREE.Vector3()
		const point2 = point1.clone().setY(point1.y + this.config.height)
		const curve = new THREE.LineCurve3(point1, point2)
		this.geometry = new THREE.TubeGeometry(curve, 20, this.config.radius, 220, false)
		this.geometry.computeBoundingBox()
		const max = this.geometry.boundingBox.max
		const min = this.geometry.boundingBox.min
		const uHeight = max.y - min.y

		this.material = new THREE.ShaderMaterial({
			vertexShader: vertex,
			fragmentShader: fragment,
			transparent: true,
			side: THREE.DoubleSide,
			depthTest: false,
			uniforms: {
				uHeight: {
					value: uHeight
				},
				uColor: {
					value: new THREE.Color(this.config.color || "#efad35")
				}
			}
		})

		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.mesh.position.set(config.position.x, config.position.y, config.position.z)
		this.mesh.name = config.name || "lightWall"

		this.setScale(this.config.maxRadius)
	}

	setScale(maxRadius) {
		this.config.maxRadius = maxRadius
		if (this.gsap) {
			this.gsap.kill()
		}
		this.gsap = gsap.to(this.mesh.scale, {
			x: this.config.maxRadius / this.config.radius,
			z: this.config.maxRadius / this.config.radius,
			duration: 1,
			repeat: -1,
			yoyo: true
		})
	}

	setPosition(x, y, z) {
		this.config.position.x = x
		this.config.position.y = y
		this.config.position.z = z
		this.mesh.position.set(this.config.position.x, this.config.position.y, this.config.position.z)
	}
}
