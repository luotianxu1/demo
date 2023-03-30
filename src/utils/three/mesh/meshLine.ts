import * as THREE from "three"

/**
 * 边缘发光
 */
export default class MeshLine {
	mesh
	geometry: THREE.EdgesGeometry
	material: THREE.LineBasicMaterial

	constructor(geometry: THREE.BufferGeometry) {
		const edges = new THREE.EdgesGeometry(geometry)
		this.material = new THREE.LineBasicMaterial({ color: 0xffffff })
		const line = new THREE.LineSegments(edges, this.material)
		this.geometry = edges
		this.mesh = line
	}
}
