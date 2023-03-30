import * as THREE from "three"
import vertex from "@utils/three/shader/lightRadar/vertex.glsl?raw"
import fragment from "@utils/three/shader/lightRadar/fragment.glsl?raw"
import gsap from "gsap"

/**
 * 雷达扫描
 */
export default class LightRadar {
	geometry: THREE.PlaneGeometry
	material: THREE.ShaderMaterial
	mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>

	constructor() {
		this.geometry = new THREE.PlaneGeometry(4, 4)
		this.material = new THREE.ShaderMaterial({
			uniforms: {
				uColor: {
					value: new THREE.Color("#ff0000")
				},
				uTime: {
					value: 0
				}
			},
			vertexShader: vertex,
			fragmentShader: fragment,
			transparent: true,
			side: THREE.DoubleSide
		})
		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.mesh.position.set(-8, 1, 8)
		this.mesh.rotation.x = -Math.PI / 2

		gsap.to(this.material.uniforms.uTime, {
			value: 1,
			duration: 1,
			repeat: -1,
			ease: "none"
		})
	}
}
