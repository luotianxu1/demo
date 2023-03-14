import * as THREE from "three"

export const gosper = (a: any, b: any) => {
	const turtle = [0, 0, 0]
	const points: any = []
	const count = 0
	rg(a, b, turtle)
	return points

	function rt(x: number) {
		turtle[2] += x
	}

	function lt(x: number) {
		turtle[2] -= x
	}

	function fd(dist: number) {
		points.push({
			x: turtle[0],
			y: turtle[1],
			z: Math.sin(count) * 5
		})

		const dir = turtle[2] * (Math.PI / 180)
		turtle[0] += Math.cos(dir) * dist
		turtle[1] += Math.sin(dir) * dist

		points.push({
			x: turtle[0],
			y: turtle[1],
			z: Math.sin(count) * 5
		})
	}

	function rg(st: number, ln: number, turtle: number[]) {
		st--
		ln = ln / 2.6457
		if (st > 0) {
			//                    ctx.strokeStyle = '#111';
			rg(st, ln, turtle)
			rt(60)
			gl(st, ln, turtle)
			rt(120)
			gl(st, ln, turtle)
			lt(60)
			rg(st, ln, turtle)
			lt(120)
			rg(st, ln, turtle)
			rg(st, ln, turtle)
			lt(60)
			gl(st, ln, turtle)
			rt(60)
		}
		if (st === 0) {
			fd(ln)
			rt(60)
			fd(ln)
			rt(120)
			fd(ln)
			lt(60)
			fd(ln)
			lt(120)
			fd(ln)
			fd(ln)
			lt(60)
			fd(ln)
			rt(60)
		}
	}

	function gl(st: number, ln: number, turtle: any) {
		st--
		ln = ln / 2.6457
		if (st > 0) {
			//                    ctx.strokeStyle = '#555';
			lt(60)
			rg(st, ln, turtle)
			rt(60)
			gl(st, ln, turtle)
			gl(st, ln, turtle)
			rt(120)
			gl(st, ln, turtle)
			rt(60)
			rg(st, ln, turtle)
			lt(120)
			rg(st, ln, turtle)
			lt(60)
			gl(st, ln, turtle)
		}
		if (st === 0) {
			lt(60)
			fd(ln)
			rt(60)
			fd(ln)
			fd(ln)
			rt(120)
			fd(ln)
			rt(60)
			fd(ln)
			lt(120)
			fd(ln)
			lt(60)
			fd(ln)
		}
	}
}

export const addLargeGroundPlane = (scene: any, useTexture?: any) => {
	const withTexture = useTexture !== null ? useTexture : false

	const planeGeometry = new THREE.PlaneGeometry(10000, 10000)
	const planeMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffff
	})
	if (withTexture) {
		const textureLoader = new THREE.TextureLoader()
		planeMaterial.map = textureLoader.load("./textures/map/floor-wood.jpg")
		planeMaterial.map.wrapS = THREE.RepeatWrapping
		planeMaterial.map.wrapT = THREE.RepeatWrapping
		planeMaterial.map.repeat.set(80, 80)
	}
	const plane = new THREE.Mesh(planeGeometry, planeMaterial)
	plane.receiveShadow = true

	plane.rotation.x = -0.5 * Math.PI
	plane.position.x = 0
	plane.position.y = 0
	plane.position.z = 0
	scene.add(plane)
	return plane
}

export const addHouseAndTree = (scene: THREE.Scene) => {
	createBoundingWall(scene)
	createGroundPlane(scene)
	createHouse(scene)
	createTree(scene)

	function createBoundingWall(scene: THREE.Scene) {
		const wallLeft = new THREE.BoxGeometry(70, 2, 2)
		const wallRight = new THREE.BoxGeometry(70, 2, 2)
		const wallTop = new THREE.BoxGeometry(2, 2, 50)
		const wallBottom = new THREE.BoxGeometry(2, 2, 50)

		const wallMaterial = new THREE.MeshPhongMaterial({
			color: 0xa0522d
		})

		const wallLeftMesh = new THREE.Mesh(wallLeft, wallMaterial)
		const wallRightMesh = new THREE.Mesh(wallRight, wallMaterial)
		const wallTopMesh = new THREE.Mesh(wallTop, wallMaterial)
		const wallBottomMesh = new THREE.Mesh(wallBottom, wallMaterial)

		wallLeftMesh.position.set(15, 1, -25)
		wallRightMesh.position.set(15, 1, 25)
		wallTopMesh.position.set(-19, 1, 0)
		wallBottomMesh.position.set(49, 1, 0)

		scene.add(wallLeftMesh)
		scene.add(wallRightMesh)
		scene.add(wallBottomMesh)
		scene.add(wallTopMesh)
	}

	function createGroundPlane(scene: THREE.Scene) {
		// create the ground plane
		const planeGeometry = new THREE.PlaneGeometry(70, 50)
		const planeMaterial = new THREE.MeshPhongMaterial({
			color: 0x9acd32
		})
		const plane = new THREE.Mesh(planeGeometry, planeMaterial)
		plane.receiveShadow = true

		// rotate and position the plane
		plane.rotation.x = -0.5 * Math.PI
		plane.position.x = 15
		plane.position.y = 0
		plane.position.z = 0

		scene.add(plane)
	}

	function createHouse(scene: THREE.Scene) {
		const roof = new THREE.ConeGeometry(5, 4)
		const base = new THREE.CylinderGeometry(5, 5, 6)

		// create the mesh
		const roofMesh = new THREE.Mesh(
			roof,
			new THREE.MeshPhongMaterial({
				color: 0x8b7213
			})
		)
		const baseMesh = new THREE.Mesh(
			base,
			new THREE.MeshPhongMaterial({
				color: 0xffe4c4
			})
		)

		roofMesh.position.set(25, 8, 0)
		baseMesh.position.set(25, 3, 0)

		roofMesh.receiveShadow = true
		baseMesh.receiveShadow = true
		roofMesh.castShadow = true
		baseMesh.castShadow = true

		scene.add(roofMesh)
		scene.add(baseMesh)
	}

	/**
	 * Add the tree to the scene
	 * @param scene The scene to add the tree to
	 */
	function createTree(scene: THREE.Scene) {
		const trunk = new THREE.BoxGeometry(1, 8, 1)
		const leaves = new THREE.SphereGeometry(4)

		// create the mesh
		const trunkMesh = new THREE.Mesh(
			trunk,
			new THREE.MeshPhongMaterial({
				color: 0x8b4513
			})
		)
		const leavesMesh = new THREE.Mesh(
			leaves,
			new THREE.MeshPhongMaterial({
				color: 0x00ff00
			})
		)

		// position the trunk. Set y to half of height of trunk
		trunkMesh.position.set(-10, 4, 0)
		leavesMesh.position.set(-10, 12, 0)

		trunkMesh.castShadow = true
		trunkMesh.receiveShadow = true
		leavesMesh.castShadow = true
		leavesMesh.receiveShadow = true

		scene.add(trunkMesh)
		scene.add(leavesMesh)
	}
}

export const addDefaultCubeAndSphere = (scene: THREE.Scene) => {
	// create a cube
	const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
	const cubeMaterial = new THREE.MeshLambertMaterial({
		color: 0xff0000
	})
	const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
	cube.castShadow = true

	// position the cube
	cube.position.x = -4
	cube.position.y = 3
	cube.position.z = 0

	// add the cube to the scene
	scene.add(cube)

	const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
	const sphereMaterial = new THREE.MeshLambertMaterial({
		color: 0x7777ff
	})
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

	// position the sphere
	sphere.position.x = 20
	sphere.position.y = 0
	sphere.position.z = 2
	sphere.castShadow = true

	// add the sphere to the scene
	scene.add(sphere)

	return {
		cube: cube,
		sphere: sphere
	}
}

export const addGroundPlane = (scene: THREE.Scene) => {
	const planeGeometry = new THREE.PlaneGeometry(60, 20, 120, 120)
	const planeMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffff
	})
	const plane = new THREE.Mesh(planeGeometry, planeMaterial)
	plane.receiveShadow = true

	plane.rotation.x = -0.5 * Math.PI
	plane.position.x = 15
	plane.position.y = 0
	plane.position.z = 0

	scene.add(plane)
	return plane
}
