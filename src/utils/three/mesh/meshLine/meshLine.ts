import * as THREE from "three"

/**
 * 线框
 */
export default class MeshLine {
	mesh: THREE.LineSegments

	constructor(group) {
		const geometry = new THREE.EdgesGeometry(group.geometry)
		const surroundLineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
		this.mesh = new THREE.LineSegments(geometry, surroundLineMaterial)
		this.mesh.applyMatrix4(group.matrix.clone())
	}
}
