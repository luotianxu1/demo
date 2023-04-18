import * as THREE from "three"
import * as dat from "dat.gui"
import Stats from "three/examples/jsm/libs/stats.module"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer"
import Scene from "./scene"
import PerspectiveCamera from "./perspectiveCamera"
import WebGlRenderer from "./webGLRenderer"
import OControls from "./orbitControls"
import AxesHelper from "./axesHelper"
import AmbientLight from "./ambientLight"
import DirectionLight from "./directionLight"
import PointLight from "./pointLight"
import SpotLight from "./spotLight"
import HemisphereLight from "./hemisphereLight"
import RectAreaLight from "./rectAreaLight"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import FControls from "./flyControls"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import type { FlyControls } from "three/examples/jsm/controls/FlyControls"

export interface IConfig {
	render?: THREE.WebGLRendererParameters | undefined
}

export default class WebGl {
	domElement: HTMLDivElement
	scene: THREE.Scene
	activeCamera
	cameraList: any = {}
	webGlRender: THREE.WebGLRenderer
	controls: OrbitControls | FlyControls | undefined
	clock: THREE.Clock
	axesHelper: THREE.AxesHelper | undefined
	stats: Stats | undefined
	gui: dat.GUI | undefined
	css3dRednerer: CSS3DRenderer | undefined
	composer
	renderPass
	effect: boolean

	constructor(
		domElement: HTMLDivElement,
		controls: boolean = true,
		css3dRednerer: boolean = false,
		effect: boolean = false,
		config: IConfig = {}
	) {
		this.domElement = domElement
		this.effect = effect
		this.scene = Scene()
		const perspectiveCamera = this.addPerspectiveCamera(50, 50, 50)
		this.activeCamera = perspectiveCamera
		this.scene.add(this.activeCamera)
		this.activeCamera.lookAt(this.scene.position)
		this.webGlRender = WebGlRenderer(this.domElement, config.render)
		this.webGlRender.render(this.scene, this.activeCamera)
		this.clock = new THREE.Clock()
		if (css3dRednerer) {
			this.addCSS3dRenderer()
		}
		if (controls) {
			this.addOrbitControls()
		}
		if (effect) {
			this.composer = new EffectComposer(this.webGlRender)
			this.composer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
			this.renderPass = new RenderPass(this.scene, this.activeCamera)
			this.composer.addPass(this.renderPass)
		}
		window.addEventListener("resize", this.resize.bind(this))
	}

	/**
	 * 创建一个透视相机
	 * @param x
	 * @param y
	 * @param z
	 * @param fov 摄像机视锥体垂直视野角度
	 * @param name 摄像机名称
	 * @param width 场景宽度
	 * @param height 场景高度
	 * @returns 透视相机
	 */
	addPerspectiveCamera(
		x: number,
		y: number,
		z: number,
		fov = 45,
		name = Object.keys(this.cameraList).length + 1,
		width = this.domElement.offsetWidth,
		height = this.domElement.offsetHeight
	): THREE.PerspectiveCamera {
		const perspectiveCamera = PerspectiveCamera(x, y, z, fov, name, width, height)
		perspectiveCamera.aspect = this.domElement.offsetWidth / this.domElement.offsetHeight
		perspectiveCamera.updateProjectionMatrix()
		this.cameraList[perspectiveCamera.name] = perspectiveCamera
		return perspectiveCamera
	}

	/**
	 * 切换相机
	 * @param name
	 */
	switchCamera(name: string | number) {
		this.activeCamera = this.cameraList[name]
		if (this.controls) {
			this.controls.object = this.activeCamera
		}
	}

	/**
	 * 轨道控制器
	 * @param camera
	 * @param renderer
	 * @returns
	 */
	addOrbitControls(
		camera: THREE.Camera = this.activeCamera,
		renderer: THREE.WebGLRenderer | CSS3DRenderer | undefined = this.webGlRender
	) {
		this.controls = OControls(camera, renderer)
		return this.controls
	}

	/**
	 * 飞行控制器
	 * @param camera
	 * @param renderer
	 * @returns
	 */
	addFlyControls(
		camera: THREE.Camera = this.activeCamera,
		renderer: THREE.WebGLRenderer | CSS3DRenderer | undefined = this.webGlRender
	) {
		this.controls = FControls(camera, renderer)
		return this.controls
	}

	/**
	 * 添加css3d渲染
	 */
	addCSS3dRenderer() {
		this.css3dRednerer = new CSS3DRenderer()
		this.css3dRednerer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
		this.domElement.appendChild(this.css3dRednerer.domElement)
		this.css3dRednerer.domElement.style.position = "absolute"
		this.css3dRednerer.domElement.style.top = "0"
		this.css3dRednerer.domElement.style.left = "0"
		this.css3dRednerer.domElement.style.zIndex = "999"
	}

	/**
	 * 添加环境光
	 * @param color 颜色
	 * @param intensity 光照的强度
	 * @returns 环境光
	 */
	addAmbientLight(color: string | number = 0xffffff, intensity: number = 1): THREE.AmbientLight {
		const ambientLight = AmbientLight(color, intensity)
		this.scene.add(ambientLight)
		return ambientLight
	}

	/**
	 * 添加平行光
	 * @param x
	 * @param y
	 * @param z
	 * @param color 颜色
	 * @param intensity 光照强度
	 * @param isCastShadow 是否产生阴影
	 * @returns DirectionalLight
	 */
	addDirectionalLight(
		x: number,
		y: number,
		z: number,
		color: number | string = 0xffffff,
		intensity: number = 1,
		isCastShadow: boolean = true
	): THREE.DirectionalLight {
		const directionalLight = DirectionLight(x, y, z, color, intensity, isCastShadow)
		this.scene.add(directionalLight)
		return directionalLight
	}

	/**
	 * 添加点光源
	 * @param x
	 * @param y
	 * @param z
	 * @param color 颜色
	 * @param intensity 光照强度
	 * @returns PointLight
	 */
	addPointLight(
		x: number = 0,
		y: number = 300,
		z: number = 300,
		color: number | string = 0xffffff,
		intensity: number = 1
	): THREE.PointLight {
		const pointLight = PointLight(x, y, z, color, intensity)
		this.scene.add(pointLight)
		return pointLight
	}

	/**
	 * 添加聚光灯
	 * @param x
	 * @param y
	 * @param z
	 * @param color 颜色
	 * @param intensity 强度
	 * @param isCastShadow 阴影
	 * @returns SpotLight
	 */
	addSpotLight(
		x: number = 100,
		y: number = 100,
		z: number = 100,
		color: number | string = 0xffffff,
		intensity: number = 1,
		isCastShadow: boolean = true
	): THREE.SpotLight {
		const spotLight = SpotLight(x, y, z, color, intensity, isCastShadow)
		this.scene.add(spotLight)
		return spotLight
	}

	/**
	 * 添加半球光
	 * @param skyColor 空中发出光线的颜色
	 * @param groundColor 地面发出光线的颜色
	 * @param intensity 光照强度
	 * @returns HemisphereLight
	 */
	addHemisphereLight(skyColor: number | string = 0x0000ff, groundColor: number | string = 0x00ff00, intensity = 1) {
		const hemisphereLight = HemisphereLight(skyColor, groundColor, intensity)
		this.scene.add(hemisphereLight)
		return hemisphereLight
	}

	/**
	 * 添加平面光
	 * @param x
	 * @param y
	 * @param z
	 * @param color 光照颜色
	 * @param width 光源宽度
	 * @param height 光源高度
	 * @param intensity 光源强度
	 * @returns RectAreaLight
	 */
	addRectAreaLight(
		x: number = 0,
		y: number = 300,
		z: number = 300,
		color: number | string = 0xffffff,
		width: number = 50,
		height: number = 50,
		intensity: number = 1
	): THREE.RectAreaLight {
		const rectAreaLight = RectAreaLight(x, y, z, color, width, height, intensity)
		this.scene.add(rectAreaLight)
		return rectAreaLight
	}

	/**
	 * 设置全景图
	 * @param url 图片路径
	 * @returns Promise<THREE.Texture>
	 */
	setBgPicture(url: string) {
		const textureLoader = new THREE.TextureLoader()
		return new Promise(resolve => {
			textureLoader.load(url, texture => {
				texture.mapping = THREE.EquirectangularRefractionMapping
				this.scene.background = texture
				this.scene.environment = texture
				resolve(texture)
			})
		})
	}

	/**
	 * 添加场景盒
	 * @param imgArray 图片数组
	 */
	setBgCube(imgArray: string[]) {
		const textureCubeLoader = new THREE.CubeTextureLoader()
		const textureCube = textureCubeLoader.load(imgArray)
		this.scene.background = textureCube
		this.scene.environment = textureCube
	}

	/**
	 * 加载hdr
	 * @param url hdr图片地址
	 * @returns Promise<THREE.DataTexture>
	 */
	hdrLoader(url: string): Promise<THREE.DataTexture> {
		const hdrLoader = new RGBELoader()
		return new Promise(resolve => {
			hdrLoader.load(url, hdr => {
				resolve(hdr)
			})
		})
	}

	/**
	 * 设置hdr全景图
	 * @param url hdr图片地址
	 * @returns Promise<THREE.DataTexture>
	 */
	setBgHdr(url: string): Promise<THREE.DataTexture> {
		return new Promise(resolve => {
			this.hdrLoader(url).then(texture => {
				texture.mapping = THREE.EquirectangularReflectionMapping
				texture.format = THREE.RGBAFormat
				this.scene.background = texture
				this.scene.environment = texture
				resolve(texture)
			})
		})
	}

	/**
	 * 加载gltf模型
	 * @param url 模型地址
	 * @returns Primise<GLTF>
	 */
	addGltf(url: string): Promise<GLTF> {
		const gltfLoader = new GLTFLoader()
		const dracoLoader = new DRACOLoader()
		dracoLoader.setDecoderPath("./draco/gltf/")
		dracoLoader.setDecoderConfig({ type: "js" })
		dracoLoader.preload()
		gltfLoader.setDRACOLoader(dracoLoader)

		return new Promise(resolve => {
			gltfLoader.load(url, gltf => {
				resolve(gltf)
			})
		})
	}

	/**
	 * 加载glb模型
	 * @param url 模型地址
	 * @returns Promise<GLTF>
	 */
	addGlb(url: string): Promise<GLTF> {
		const gltfLoader = new GLTFLoader()
		return new Promise(resolve => {
			gltfLoader.load(url, gltf => {
				resolve(gltf)
			})
		})
	}

	/**
	 * 创建坐标轴辅助器
	 * @param size 长度
	 */
	addAxesHelper(size: number = 50) {
		this.axesHelper = AxesHelper(size)
		this.scene.add(this.axesHelper)
	}

	/**
	 * 添加帧率显示
	 */
	addStats() {
		this.stats = Stats()
		this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
		this.stats.dom.style.position = "absolute"
		this.stats.dom.style.left = "0px"
		this.stats.dom.style.top = "0px"
		this.domElement.appendChild(this.stats.dom)
	}

	/**
	 * 添加GUI
	 */
	addGUI() {
		this.gui = new dat.GUI()
		this.gui.domElement.style.position = "absolute"
		this.gui.domElement.style.right = window.innerWidth - this.domElement.getBoundingClientRect().right + "px"
		this.gui.domElement.style.top = this.domElement.getBoundingClientRect().top + "px"
	}

	/**
	 * 更新场景
	 */
	update() {
		const t = this.clock.getDelta()
		if (this.controls) {
			this.controls.update(t)
		}
		if (this.stats) {
			this.stats.update()
		}
		if (this.css3dRednerer) {
			this.css3dRednerer.render(this.scene, this.activeCamera)
		}
		if (this.effect && this.composer) {
			this.composer.render()
		} else {
			this.webGlRender.render(this.scene, this.activeCamera)
		}
	}

	/**
	 * 监听页面大小变化
	 * @param domElement HTMLDivElement
	 */
	resize() {
		for (const key in this.cameraList) {
			this.cameraList[key].aspect = this.domElement.offsetWidth / this.domElement.offsetHeight
			this.cameraList[key].updateProjectionMatrix()
		}
		if (this.css3dRednerer) {
			this.css3dRednerer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
		}
		this.webGlRender.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
		this.webGlRender.setPixelRatio(window.devicePixelRatio)
	}

	/**
	 * 销毁
	 */
	remove() {
		if (this.gui) {
			this.gui.destroy()
		}
		const meshes: any[] = []
		this.scene.traverse(function (object) {
			if (object instanceof THREE.Mesh) meshes.push(object)
		})
		for (let i = 0; i < meshes.length; i++) {
			const mesh = meshes[i]
			mesh.material.dispose()
			mesh.geometry.dispose()
			this.scene.remove(mesh)
		}
		window.removeEventListener("resize", this.resize)
	}
}
