import * as THREE from "three"

export default function GridHelper(size: number = 50, divisions: number = 50): THREE.GridHelper {
	return new THREE.GridHelper(size, divisions)
}
