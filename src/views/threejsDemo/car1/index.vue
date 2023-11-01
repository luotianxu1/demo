<template>
	<div class="car">
		<div ref="webgl" class="webgl"></div>
		<div id="ui">
			<p class="pre"></p>
			<p class="next"></p>
			<ul id="toggleColor">
				<li ad="0" @click="toggleCarColor(0)">
					<p style="background-image: url(threejsDemo/car/铂金珍珠白.png); background-size: cover;"></p>
					<div class=""></div>
					<section style="">铂金珍珠白</section>
				</li>
				<li ad="1" @click="toggleCarColor(1)">
					<p style="background-image: url(threejsDemo/car/墨晶黑.png); background-size: cover;"></p>
					<div class=""></div>
					<section>墨晶黑</section>
				</li>
				<li ad="2" @click="toggleCarColor(2)">
					<p style="background-image: url(threejsDemo/car/欧铂银.png); background-size: cover;"></p>
					<div class=""></div>
					<section>欧泊银</section>
				</li>
				<li ad="3" @click="toggleCarColor(3)">
					<p style="background-image: url(threejsDemo/car/墨玉蓝.png); background-size: cover;"></p>
					<div class=""></div>
					<section>墨玉蓝</section>
				</li>
				<li ad="4" @click="toggleCarColor(4)">
					<p style="background-image: url(threejsDemo/car/海钻蓝.png); background-size: cover;"></p>
					<div class=""></div>
					<section>海钻蓝</section>
				</li>
				<li ad="5" @click="toggleCarColor(5)">
					<p style="background-image: url(threejsDemo/car/琥珀棕.png); background-size: cover;"></p>
					<div class=""></div>
					<section>琥珀棕</section>
				</li>
				<li ad="0&1" @click="toggleCarColor(0, 1)">
					<p style="background-image: url(threejsDemo/car/铂金珍珠白黑双色.png); background-size: cover;"></p>
					<div class=""></div>
					<section>铂金珍珠白黑双色</section>
				</li>
				<li ad="1&2" @click="toggleCarColor(1, 2)">
					<p style="background-image: url(threejsDemo/car/墨晶黑银双色.png); background-size: cover;"></p>
					<div class=""></div>
					<section>墨晶黑银双色</section>
				</li>
				<li ad="2&1" @click="toggleCarColor(2, 1)">
					<p style="background-image: url(threejsDemo/car/欧铂银黑双色.png); background-size: cover;"></p>
					<div class=""></div>
					<section>欧泊银黑双色</section>
				</li>
				<li ad="3&2" @click="toggleCarColor(3, 2)">
					<p style="background-image: url(threejsDemo/car/墨玉蓝银双色.png); background-size: cover;"></p>
					<div class=""></div>
					<section>墨玉蓝银双色</section>
				</li>
				<li ad="4&1" @click="toggleCarColor(4, 1)">
					<p style="background-image: url(threejsDemo/car/海钻蓝黑双色.png); background-size: cover;"></p>
					<div class=""></div>
					<section>海钻蓝黑双色</section>
				</li>
				<li ad="5&2" @click="toggleCarColor(5, 2)">
					<p style="background-image: url(threejsDemo/car/琥珀棕银双色.png); background-size: cover;"></p>
					<div class=""></div>
					<section>琥珀棕银双色</section>
				</li>
			</ul>
			<div id="toggleStatus">
				<div class="item" @click="lightBtn">
					<p style="background-image: url(threejsDemo/car/车灯.png); background-size: contain;"></p>
					<section style="">开启车灯</section>
				</div>
				<div class="item lungu" style="position: relative" @click="showLungu">
					<p class="hubBtn" style="background-image: url(threejsDemo/car/轮毂.png); background-size: contain;"></p>
					<section class="hubBtn" style="">更换轮毂</section>
					<ul class="lunguList" :class="{ show: isShow }">
						<li @click="toggleLungu(0)"></li>
						<li @click="toggleLungu(1)"></li>
						<li @click="toggleLungu(2)"></li>
						<li @click="toggleLungu(3)"></li>
					</ul>
				</div>
				<div class="item" @click="sizeBtn">
					<p style="background-image: url(threejsDemo/car/尺寸.png); background-size: contain;"></p>
					<section style="">车身尺寸</section>
				</div>
				<div class="item" @click="runBtn">
					<div class="img" :class="runCar ? 'run' : 'noRun'" />
					<section style="">一键启动</section>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import * as TWEEN from "three/examples/jsm/libs/tween.module.js"
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare"

let webgl = ref<HTMLDivElement>()
let web: WebGl
let isShow = ref(false)
let clock
let dt
let envMap
let envMapboli
let spriteBox = []
let carModel
let mixer
let actions
let paintANames = ["painta_a27", "painta_a21", "painta_a22", "painta_a9", "painta_a32", "painta_a28", "painta_a12"]
let paintBNames = ["paintb_a4"]
let paintA = []
let paintB = []
let lunguA = []
let lunguB = []
let lunguC = []
let lunguD = []
const allColors = [
	new THREE.Color(0xa2a2a2),
	new THREE.Color(0x000000),
	new THREE.Color(0x525252),
	new THREE.Color(0x90f),
	new THREE.Color(0x622),
	new THREE.Color(0x50000)
]
let houshiObj = []
const houshi = ["painta_a3", "plastic_a13", "painta_a18", "plastic_a12", "painta_a31", "painta_a34"]
const degVec = {
	p1: new THREE.Vector3(-451, 144, -140),
	p2: new THREE.Vector3(-451, 144, 140),
	l1: new THREE.Object3D(),
	l2: new THREE.Object3D(),
	isLight: false
}
let runCar = false
let speed = {
	type: false,
	val: 1
}

onMounted(() => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value, true, false, false, {
		render: { antialias: true, alpha: true, logarithmicDepthBuffer: true }
	})
	web.webGlRender.toneMappingExposure = 0.9
	web.webGlRender.toneMapping = THREE.LinearToneMapping
	web.webGlRender.outputColorSpace = THREE.SRGBColorSpace

	web.activeCamera.fov = 60
	web.activeCamera.position.set(-1398, 733, 685)
	web.activeCamera.updateProjectionMatrix()

	web.controls.dampingFactor = 0.15
	web.controls.enableKeys = false
	web.controls.enablePan = false
	web.controls.minDistance = 1000
	web.controls.maxDistance = 1950
	web.controls.minPolarAngle = 0
	web.controls.maxPolarAngle = Math.PI * 0.45
	web.controls.minAzimuthAngle = -Infinity
	web.controls.maxAzimuthAngle = Infinity

	clock = new THREE.Clock()

	lightInit()
	envMaps()
	inintGround()
	modelInit()
	lensflares()

	render()
})

function lightInit() {
	web.addAmbientLight(0xffffff, 0.8)
	let hemiLight = web.addHemisphereLight(0xffffff, 0xffffff, 0.65)
	hemiLight.position.set(0, 500, 0)
	web.addDirectionalLight(-400, 800, 0, 0xffffff, 0.75)
	let spotLight = web.addSpotLight(15, 600, 1000, 0xffffff, 1)
	spotLight.angle = Math.PI / 7
	spotLight.penumbra = 0.12
	spotLight.lookAt(0, 0, 0)
}

function envMaps() {
	let path1 = "./threejsDemo/car/vr/"
	let format = ".jpg"
	envMapboli = new THREE.CubeTextureLoader().load([
		path1 + "CubeMap_R_0001" + format,
		path1 + "CubeMap_L_0001" + format,
		path1 + "CubeMap_U_0001" + format,
		path1 + "CubeMap_D_0001" + format,
		path1 + "CubeMap_B_0001" + format,
		path1 + "CubeMap_F_0001" + format
	])
	envMapboli.format = THREE.RGBAFormat
	envMapboli.minFilter = THREE.LinearFilter
	envMapboli.colorSpace = THREE.SRGBColorSpace
	envMap = envMapboli
	web.scene.environment = envMap
	let geometry = new THREE.SphereGeometry(2500, 24, 24)
	let texture = new THREE.TextureLoader().load("./threejsDemo/car/TOY.jpg")
	texture.colorSpace = THREE.SRGBColorSpace

	let material = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		map: texture,
		side: THREE.BackSide
	})
	material.map.flipY = false
	let sphere = new THREE.Mesh(geometry, material)
	sphere.rotation.x = -Math.PI
	sphere.rotation.y = -Math.PI / 2
	sphere.name = "bgSphere"
	sphere.position.y += 200
	web.scene.add(sphere)
}

function modelInit() {
	web.addGlb("./threejsDemo/car/car/car.gltf").then(gltf => {
		carModel = gltf
		animateInit(carModel.scene, carModel.animations)
		carModel.scene.scale.set(1000, 1000, 1000)
		drawModel(carModel.scene)
		web.scene.add(carModel.scene)
		raycasterShow()
		initSprite()
	})
}

function initSprite() {
	const ves = [
		{
			name: "sprite1",
			pos: new THREE.Vector3(-13.0, 197.0, 204.0),
			pos2: new THREE.Vector3(-77.0, 197.0, 354),
			type: "a"
		},
		{
			name: "sprite2",
			pos: new THREE.Vector3(179.0, 197.0, 204.0),
			pos2: new THREE.Vector3(128.0, 215.0, 329),
			type: "b"
		},
		{
			name: "sprite3",
			pos: new THREE.Vector3(13.0, 197, -196),
			pos2: new THREE.Vector3(-77.0, 197.0, -355),
			type: "c"
		},
		{
			name: "sprite4",
			pos: new THREE.Vector3(179, 197, -196),
			pos2: new THREE.Vector3(126.0, 214.0, -328),
			type: "d"
		},
		{
			name: "sprite5",
			pos: new THREE.Vector3(504, 216, -4),
			pos2: new THREE.Vector3(515.0, 413.0, 7),
			type: "e"
		},
		{
			name: "sprite6",
			pos: new THREE.Vector3(45, 350, -4),
			pos2: new THREE.Vector3(79.0, 350.0, -4),
			type: "f"
		}
	]
	const spMat = new THREE.SpriteMaterial({
		color: 0xffffff,
		map: new THREE.TextureLoader().load("./threejsDemo/car/pointSprite.png"),
		transparent: true,
		alphaTest: 0.2
	})
	for (let i = 0; i < ves.length; i++) {
		let sprite = new THREE.Sprite(spMat) as any
		sprite.position.copy(ves[i].pos)
		sprite.anType = ves[i].type
		sprite.anStats = 0
		sprite.vec2 = ves[i].pos2
		sprite.vec1 = ves[i].pos
		sprite.name = ves[i].name
		web.scene.add(sprite)
		spriteBox.push(sprite)
		biling(sprite, 40)
	}
	let vz = void 0

	function biling(a, val) {
		let animates = new TWEEN.Tween(a.scale)
			.to(
				{
					x: val,
					y: val
				},
				600
			)
			.easing(TWEEN.Easing.Linear.None)
			.start()
			.onComplete(function () {
				vz = val === 65 ? 35 : 65
				animates = null
				biling(a, vz)
			})
	}
}

function lensflares() {
	let textureLoader = new THREE.TextureLoader()
	let textureFlare0 = textureLoader.load("./threejsDemo/car/po.png")
	textureFlare0.colorSpace = THREE.SRGBColorSpace
	let colorLight = new THREE.Color(0xffffff)
	addLight2(0.08, 0.8, 0.5, -388, 188, -138, degVec.l1, 125, colorLight)
	addLight2(0.08, 0.8, 0.5, -388, 188, 138, degVec.l2, 125, colorLight)
	addLight2(0.08, 0.8, 0.5, -388, 132, -144, degVec.l1, 100, colorLight)
	addLight2(0.08, 0.8, 0.5, -388, 132, 144, degVec.l2, 100, colorLight)

	function addLight2(h, s, l, x, y, z, obj, size, color) {
		let lensflare = new Lensflare()
		lensflare.addElement(new LensflareElement(textureFlare0, size, 0, color))
		obj.add(lensflare)
		obj.visible = false
		web.scene.add(obj)
		lensflare.position.set(x, y, z)
	}
}

function inintGround() {
	let ground = new THREE.TextureLoader().load("./threejsDemo/car/ground2.jpg")
	ground.wrapS = ground.wrapT = THREE.RepeatWrapping
	ground.repeat.set(1, 1)
	let mesh = new THREE.Mesh(
		new THREE.CircleGeometry(1200, 48),
		new THREE.MeshBasicMaterial({
			map: ground,
			side: THREE.DoubleSide,
			transparent: false
		})
	)
	mesh.rotation.x = -Math.PI / 2
	mesh.position.y = -10
	mesh.name = "ground"
	mesh.visible = false
	web.scene.add(mesh)
	let mask2 = new THREE.Mesh(
		new THREE.CircleGeometry(2800, 36),
		new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load("./threejsDemo/car/changjing2.jpg"),
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.9,
			alphaTest: 0.9
		})
	)
	mask2.rotation.x = -Math.PI / 2
	mask2.position.y = -5
	mask2.visible = false
	mask2.name = "ground2"
	web.scene.add(mask2)
}

function animateInit(model, animations) {
	mixer = new THREE.AnimationMixer(model)
	actions = {}
	for (let i = 0; i < animations.length; i++) {
		let clip = animations[i]
		let action = mixer.clipAction(clip)
		actions[clip.name] = action
		action.clampWhenFinished = true
		action.loop = THREE.LoopOnce
	}
}

function drawModel(model) {
	model.traverse(function (object) {
		if (object.isMesh) {
			// 宽高
			getCarObj("biaozhu14").position.y = 0.06
			getCarObj("biaozhu14").material.transparent = true
			getCarObj("biaozhu14").material.opacity = 0
			getCarObj("biaozhu14").material.alphaTest = 0.05
			// 底面
			getCarObj("dimian").position.y = -0.002
			getCarObj("dimian").material.color = new THREE.Color(0x000000)
			let clonems = getCarObj("polySurface3316").material.clone()
			// 车标
			getCarObj("polySurface3316").material = clonems.clone()
			getCarObj("polySurface3316").material.roughness = 1
			getCarObj("polySurface3316").material.metalness = 0.1
			getCarObj("polySurface4326").position.x = -0.002
			// 前后玻璃
			getCarObj("glass_ab11").material.color = new THREE.Color(0x202020)
			getCarObj("glass_ab11").material.opacity = 0.85
			// 天窗
			let cloneglass = getCarObj("glass_a10_cc7").material.clone()
			getCarObj("glass_a10_cc7").material = cloneglass.clone()
			getCarObj("glass_a10_cc7").material.color = new THREE.Color(0x000000)
			getCarObj("glass_a10_cc7").material.opacity = 0.75
			getCarObj("glass_a10_cc7").material.transparent = true
			// 侧面车窗、车灯
			dispose(getCarObj("glassC_a2"))
			dispose(getCarObj("glassC_a3"))
			// 后视镜
			houshi.map(function (f) {
				let o = getCarObj(f) as any
				if (!o) {
					return false
				}
				let m = o.material.clone()
				o.material = m.clone()
				if (o.name === "painta_a31" || o.name === "painta_a34") {
					o.material.color = new THREE.Color(0x525252)
					o.material.envMap = envMapboli
					o.material.envMapIntensity = 5
					houshiObj.push(o)
				} else {
					o.material.color = new THREE.Color(0x102)
				}
				// o.material.color = new THREE.Color("rgb(229, 63, 43)")
			})

			if (object.name.indexOf("pSphere") !== -1) {
				dispose(object)
			}
			// 雨刮、蒙皮
			if (object.name.indexOf("paint") !== -1) {
				object.material.envMap = envMapboli
				object.material.refractionRatio = 0 //空气的折射率
				object.material.envMapIntensity = 1 // 通过乘以环境贴图的颜色来缩放环境贴图的效果
				object.material.roughness = 0 // 材质的粗糙程度
				object.material.metalness = 0.44 // 材质与金属的相似度
			}
			// 前挡、天窗
			if (object.name.indexOf("glass") !== -1) {
				object.material.envMap = envMap
				object.material.metalness = 1
				object.material.roughness = 0
				object.material.refractionRatio = 1
				object.material.transparent = true
				object.material.opacity = 0.8
				object.material.envMapIntensity = 20
			}
			if (object.name.indexOf("glassa") !== -1) {
				dispose(object)
			}
			if (object.name.indexOf("glassB") !== -1) {
				dispose(object)
			}
			// 侧窗
			if (object.name.indexOf("glassC") !== -1) {
				object.material.envMap = envMap
				object.material.color = new THREE.Color(0xffffff)
				object.material.metalness = 1
				object.material.roughness = 0
				object.material.refractionRatio = 1
				object.material.transparent = true
				object.material.opacity = 0.5
				object.material.envMapIntensity = 1
			}
			if (object.name.indexOf("pCube") !== -1 || object.name.indexOf("pcube") !== -1) {
				object.visible = false
			}
			if (object.name.indexOf("metal") !== -1 || object.name.indexOf("lungu") !== -1 || object.name.indexOf("shachepan") !== -1) {
				object.material.refractionRatio = 1
				object.material.envMapIntensity = 1
				// 轮毂
				if (object.name.indexOf("lungu") !== -1) {
					object.material.envMap = envMap
					object.material.roughness = 0.1
					object.material.metalness = 0.5
					object.material.refractionRatio = 3
					object.material.envMapIntensity = 7
				}
			}
			// 包围
			if (object.name.indexOf("plastic") !== -1) {
				object.material.envMap = envMap
				object.material.refractionRatio = 1
				object.material.envMapIntensity = 1
			}
		}
		if (paintANames.indexOf(object.name) !== -1) {
			if (object.type === "Group") {
				object.children.map(function (t) {
					paintA.push(t)
				})
			} else {
				paintA.push(object)
			}
		}
		if (paintBNames.indexOf(object.name) !== -1) {
			if (object.type === "Group") {
				object.children.map(function (t) {
					paintB.push(t)
				})
			} else {
				paintB.push(object)
			}
		}
		if (object.name.indexOf("xuanzhuan_cube") !== -1) {
			object.material.opacity = 0
			object.material.transparent = true
			object.children.map(function (f) {
				if (f.name.indexOf("lungu") !== -1) {
					if (f.name.indexOf("lunguA") !== -1) {
						lunguA.push(f)
					}
					if (f.name.indexOf("lunguB") !== -1) {
						lunguB.push(f)
					}
					if (f.name.indexOf("lunguC") !== -1) {
						f.children.map(function (t) {
							lunguC.push(t)
						})
					}
					if (f.name.indexOf("lunguD") !== -1) {
						lunguD.push(f)
					}
				}
			})

			toggleLungu(0)
		}
	})
	toggleCarColor(1)
}

function raycasterShow() {
	document.addEventListener("click", ray)

	function ray() {
		const mouse = new THREE.Vector2()
		mouse.x = ((event as MouseEvent).clientX / webgl.value.offsetWidth) * 2 - 1
		mouse.y = -((event as MouseEvent).clientY / webgl.value.offsetHeight) * 2 + 1
		let raycaster = new THREE.Raycaster()
		raycaster.setFromCamera(mouse, web.activeCamera)
		const intersects = raycaster.intersectObjects(web.scene.children, false)
		if (intersects.length > 0) {
			let obj = intersects[0].object as any
			if (obj.name.indexOf("sprite") !== -1) {
				if (!obj.anStats) {
					actions[obj.anType].reset().play()
					obj.anStats = 1
					tweenPos(obj, obj.vec2)
				} else {
					tweenAn(actions[obj.anType])
					obj.anStats = 0
					tweenPos(obj, obj.vec1)
				}
			}
		}
	}
}

function dispose(obj) {
	if (obj.material.map) {
		obj.material.map.dispose()
	}
	obj.material.dispose()
	obj.geometry.dispose()
	obj.visible = false
}

function toggleLungu(index) {
	if (index === 0) {
		ab(lunguA, true), ab(lunguB, false), ab(lunguC, false), ab(lunguD, false)
	}
	if (index === 1) {
		ab(lunguA, false), ab(lunguB, true), ab(lunguC, false), ab(lunguD, false)
	}
	if (index === 2) {
		ab(lunguA, false), ab(lunguB, false), ab(lunguC, true), ab(lunguD, false)
	}
	if (index === 3) {
		ab(lunguA, false), ab(lunguB, false), ab(lunguC, false), ab(lunguD, true)
	}
}

function ab(arr, type) {
	if (type) {
		arr.map(function (t) {
			t.visible = true
		})
	} else {
		arr.map(function (t) {
			t.visible = false
		})
	}
}

function intensityV(val) {
	paintA.map(function (u) {
		tweenVal(u.material, val)
	})
	paintB.map(function (u) {
		tweenVal(u.material, val)
	})
}

function tweenVal(valA, valB) {
	let animates = new TWEEN.Tween(valA)
		.to(
			{
				envMapIntensity: valB
			},
			600
		)
		.easing(TWEEN.Easing.Linear.None)
		.start()
		.onComplete(function () {
			animates = null
		})
}

function colorTo(arr, color) {
	arr.map(function (g) {
		an(g.material.color, color)
	})

	function an(a, b) {
		let animates = new TWEEN.Tween(a)
			.to(
				{
					r: b.r,
					g: b.g,
					b: b.b
				},
				600
			)
			.easing(TWEEN.Easing.Linear.None)
			.start()
			.onComplete(function () {
				animates = null
			})
	}
}

function tweenPos(obj, b) {
	let animates = new TWEEN.Tween(obj.position)
		.to(
			{
				x: b.x,
				y: b.y,
				z: b.z
			},
			600
		)
		.easing(TWEEN.Easing.Linear.None)
		.start()
		.onComplete(function () {
			animates = null
		})
}

function tweenAn(a) {
	let animates = new TWEEN.Tween(a)
		.to(
			{
				time: 0
			},
			600
		)
		.easing(TWEEN.Easing.Linear.None)
		.start()
		.onComplete(function () {
			animates = null
		})
}

function getObj(name) {
	return web.scene.getObjectByName(name) as any
}

function getCarObj(name) {
	return carModel.scene.getObjectByName(name) as any
}

function toggleCarColor(index, other?) {
	if (index === 0) {
		intensityV(3)
	} else if (index === 2) {
		intensityV(7)
	} else {
		intensityV(15)
	}
	if (!other) {
		colorTo(paintA, allColors[index])
		colorTo(paintB, allColors[index])
		colorTo(houshiObj, allColors[index])
	} else {
		colorTo(houshiObj, allColors[1])
		colorTo(paintA, allColors[index])
		colorTo(paintB, allColors[other])
	}
}

function resizeFlares(deg1, deg2) {
	if (!degVec.isLight) {
		degVec.l1.visible = false
		degVec.l2.visible = false
	} else {
		if (deg1 < 90 && deg2 < 90) {
			degVec.l1.visible = true
			degVec.l2.visible = true
		} else if (deg1 <= 90) {
			degVec.l1.visible = true
			degVec.l2.visible = false
		} else if (deg2 <= 90) {
			degVec.l1.visible = false
			degVec.l2.visible = true
		} else {
			degVec.l1.visible = false
			degVec.l2.visible = false
		}
	}
}

function modelControl() {
	getObj("ground").material.map.offset.x -= 0.004
	if (speed.type) {
		speed.val = 2
	} else {
		speed.val = 1
	}
	getObj("xuanzhuan_cube").rotation.z += 0.1 * speed.val
	getObj("xuanzhuan_cube2").rotation.z += 0.1 * speed.val
	getObj("xuanzhuan_cube3").rotation.z += 0.1 * speed.val
	getObj("xuanzhuan_cube4").rotation.z += 0.1 * speed.val
}

// 车身尺寸
function sizeBtn() {
	let animates = new TWEEN.Tween(getCarObj("biaozhu14").material)
		.to(
			{
				opacity: getCarObj("biaozhu14").material.opacity === 1 ? 0 : 1
			},
			600
		)
		.easing(TWEEN.Easing.Linear.None)
		.start()
		.onComplete(function () {
			animates = null
		})
}

// 灯
function lightBtn() {
	degVec.isLight = !degVec.isLight
	speed.type = !speed.type
}

// 启动
function runBtn() {
	runCar = !runCar
	getObj("ground").visible = !getObj("ground").visible
	getObj("ground2").visible = !getObj("ground2").visible
}

function showLungu() {
	isShow.value = !isShow.value
}
onUnmounted(() => {
	web.remove()
})

const render = () => {
	dt = clock.getDelta()
	if (mixer) mixer.update(dt)
	web.update()
	if (runCar) modelControl()
	TWEEN.update()
	let deg1 = THREE.MathUtils.radToDeg(degVec.p1.angleTo(web.activeCamera.position))
	let deg2 = THREE.MathUtils.radToDeg(degVec.p2.angleTo(web.activeCamera.position))
	resizeFlares(deg1, deg2)
	requestAnimationFrame(render)
}
</script>

<style lang="scss">
.car {
	position: relative;
	width: 100vw;
	height: 100vh;

	.webgl {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		width: 100%;
		height: 100%;
	}

	#toggleColor {
		position: fixed;
		bottom: 7%;
		left: 50%;
		display: flex;
		width: 80%;
		padding: 0;
		margin: 0;
		margin-left: -40%;
		list-style: none;
		justify-content: space-around;

		li {
			flex: 1;

			p {
				width: 70px;
				height: 70px;
				margin: 0 auto;
				cursor: pointer;
				border-radius: 50%;
			}

			section {
				width: 100%;
				margin-top: 10px;
				font-size: 14px;
				font-weight: 555;
				color: #000;
				text-align: center;
			}
		}
	}

	#toggleStatus {
		position: fixed;
		right: 3%;
		bottom: 23%;
		width: auto;
		padding: 20px 10px;
		margin: 0;
		list-style: none;
		background-image: url(./threejsDemo/car/listbg.png);
		background-repeat: no-repeat;
		background-size: cover;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		border-bottom-left-radius: 10px;
		border-top-left-radius: 10px;

		.item {
			position: relative;
			display: flex;
			margin-top: 20px;
			cursor: pointer;
			flex-direction: column;
			align-items: center;

			&:nth-child(1) {
				margin-top: 0;
			}

			p {
				width: 50px;
				height: 50px;
				padding-top: 0;
				margin: 0 auto;
				background-repeat: no-repeat;
			}
		}

		.show {
			display: flex !important;
		}

		.lunguList {
			position: absolute;
			top: -8px;
			left: -310px;
			display: none;
			padding: 10px;
			background-color: rgba(72, 81, 88, 0.5);
			border-radius: 20px 0 0 20px;

			li {
				width: 70px;
				height: 70px;
				background-size: 100% 100%;

				&:nth-child(1) {
					background-image: url(./threejsDemo/car/lun1.png);
				}

				&:nth-child(2) {
					background-image: url(./threejsDemo/car/lun2.png);
				}

				&:nth-child(3) {
					background-image: url(./threejsDemo/car/lun3.png);
				}

				&:nth-child(4) {
					background-image: url(./threejsDemo/car/lun4.png);
				}
			}
		}

		.img {
			width: 50px;
			height: 50px;
			background-size: 100% 100%;
		}

		.run {
			background-image: url(./threejsDemo/car/run1.png);
		}

		.noRun {
			background-image: url(./threejsDemo/car/run0.png);
		}
	}
}
</style>
