import * as THREE from "three"
import vertex from "./shader/vertex.glsl?raw"
import fragment from "./shader/fragment.glsl?raw"
import gsap from "gsap"

export interface ILightRadar {
	position: {
		x: number
		y: number
		z: number
	}
	radius: number
	color?: string
}

/**
 * 雷达扫描
 */
export default class LightRadar {
	config: ILightRadar
	geometry: THREE.CircleGeometry
	material: THREE.ShaderMaterial
	mesh: THREE.Mesh<THREE.CircleGeometry, THREE.ShaderMaterial>

	constructor(config: ILightRadar) {
		this.config = config
		this.geometry = new THREE.CircleGeometry(this.config.radius, 60)
		this.material = new THREE.ShaderMaterial({
			uniforms: {
				uColor: {
					value: new THREE.Color(this.config.color || "#efad35")
				},
				uTime: {
					value: 0
				}
			},
			vertexShader: vertex,
			fragmentShader: fragment,
			transparent: true,
			side: THREE.DoubleSide,
			depthTest: false
		})
		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.mesh.position.set(this.config.position.x, this.config.position.y, this.config.position.z)
		this.mesh.rotation.x = -Math.PI / 2

		gsap.to(this.material.uniforms.uTime, {
			value: 1,
			duration: 1,
			repeat: -1,
			ease: "none"
		})
	}

	setPosition(x, y, z) {
		this.config.position.x = x
		this.config.position.y = y
		this.config.position.z = z
		this.mesh.position.set(this.config.position.x, this.config.position.y, this.config.position.z)
	}
}
