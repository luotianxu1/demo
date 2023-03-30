import * as THREE from "three"
import vertex from "@utils/three/shader/lightWall/vertex.glsl?raw"
import fragment from "@utils/three/shader/lightWall/fragment.glsl?raw"
import type { Box3 } from "three"
import gsap from "gsap"

/**
 * 光墙
 */
export default class LightWall {
	geometry: THREE.CylinderGeometry
	material: THREE.ShaderMaterial
	mesh: THREE.Mesh<THREE.CylinderGeometry, THREE.ShaderMaterial>

	constructor() {
		this.geometry = new THREE.CylinderGeometry(5, 5, 2, 32, 1, true)
		this.material = new THREE.ShaderMaterial({
			vertexShader: vertex,
			fragmentShader: fragment,
			transparent: true,
			side: THREE.DoubleSide
		})
		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.mesh.position.set(0, 1, 0)

		this.mesh.geometry.computeBoundingBox()
		const { min, max } = this.mesh.geometry.boundingBox as Box3
		const uHeight = max.y - min.y
		this.material.uniforms.uHeight = {
			value: uHeight
		}

		gsap.to(this.mesh.scale, {
			x: 2,
			z: 2,
			duration: 1,
			repeat: -1,
			yoyo: true
		})
	}
}
