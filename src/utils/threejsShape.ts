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
