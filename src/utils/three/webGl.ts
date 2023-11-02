import * as THREE from "three"
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
import GridHelper from "./gridHelper"
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
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import type { WebGLRendererParameters } from "three"
import VertexNormalsHelperCustom from "./VertexNormalsHelper"

export interface IConfig {
	render?: THREE.WebGLRendererParameters
	controls?: {
		type: "OrbitControls" | "FlyControls" | false
	}
	camera?: {
		type: "PerspectiveCamera" | "OrthographicCamera"
	}
}

const defaultConfig: IConfig = {
	controls: {
		type: "OrbitControls"
	},
	camera: {
		type: "PerspectiveCamera"
	}
}

export default class WebGl {
	config: IConfig
	domElement: HTMLDivElement
	scene: THREE.Scene
	camera
	cameraList: any = {}
	webGlRender: THREE.WebGLRenderer
	orbitControls: OrbitControls
	flyControls: FlyControls
	clock: THREE.Clock
	stats: Stats
	gui: GUI
	css3dRednerer: CSS3DRenderer
	composer
	renderPass
	effect: boolean

	constructor(domElement: HTMLDivElement, config: IConfig = {}) {
		this.config = Object.assign(defaultConfig, config)
		this.domElement = domElement
		this.scene = this.createScene()
		this.camera = this.createPerspectiveCamera(50, 50, 50)
		this.camera.lookAt(this.scene.position)
		this.scene.add(this.camera)
		this.webGlRender = this.createWebGlRender(this.domElement, this.config.render)
		this.webGlRender.render(this.scene, this.camera)
		this.clock = new THREE.Clock()
		this.initControls(this.config.controls.type)
		window.addEventListener("resize", this.resize.bind(this))
	}

	/**
	 * 创建场景
	 * @returns THREE.Scene
	 */
	createScene() {
		return Scene()
	}

	/**
	 * 添加后期处理
	 */
	addEffect() {
		this.composer = new EffectComposer(this.webGlRender)
		this.composer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
		this.renderPass = new RenderPass(this.scene, this.camera)
		this.composer.addPass(this.renderPass)
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
	createPerspectiveCamera(
		x: number,
		y: number,
		z: number,
		fov: number = 45,
		name: string | number = Object.keys(this.cameraList).length + 1,
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
		this.camera = this.cameraList[name]
		if (this.orbitControls) {
			this.orbitControls.object = this.camera
		}
		if (this.flyControls) {
			this.flyControls.object = this.camera
		}
	}

	/**
	 * 创建轨道控制器
	 * @param camera
	 * @param renderer
	 * @returns
	 */
	createOrbitControls(
		camera: THREE.Camera = this.camera,
		renderer: THREE.WebGLRenderer | CSS3DRenderer = this.webGlRender
	): OrbitControls {
		return OControls(camera, renderer)
	}

	/**
	 * 创建飞行控制器
	 * @param camera
	 * @param renderer
	 * @returns
	 */
	createFlyControls(
		camera: THREE.Camera = this.camera,
		renderer: THREE.WebGLRenderer | CSS3DRenderer = this.webGlRender
	): FlyControls {
		return FControls(camera, renderer)
	}

	/**
	 * 初始化控制器
	 * @param 控制器类型 "OrbitControls" | "FlyControls" | false
	 * @returns "OrbitControls" | "FlyControls" | undefind
	 */
	initControls(type) {
		if (!type) return
		switch (type) {
			case "OrbitControls":
				this.orbitControls = this.createOrbitControls()
				break
			case "FlyControls":
				this.flyControls = this.createFlyControls()
				break
		}
	}

	/**
	 * 创建渲染器
	 * @param domElement DOMElement
	 * @param config 配置
	 * @returns
	 */
	createWebGlRender(domElement: HTMLDivElement, config: WebGLRendererParameters = {}) {
		return WebGlRenderer(domElement, config)
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
	addHemisphereLight(
		skyColor: number | string = 0x0000ff,
		groundColor: number | string = 0x00ff00,
		intensity = 1
	): THREE.HemisphereLight {
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
	 * 加载纹理
	 * @param url 图片路径
	 * @returns Promise<THREE.Texture>
	 */
	loaderMap(url: string): Promise<THREE.Texture> {
		const textureLoader = new THREE.TextureLoader()
		return new Promise(resolve => {
			textureLoader.load(url, texture => {
				resolve(texture)
			})
		})
	}

	/**
	 * 设置全景图
	 * @param url 图片路径
	 * @returns Promise<THREE.Texture>
	 */
	setBgPicture(url: string): Promise<THREE.Texture> {
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
	 * @returns Promise<GLB>
	 */
	addGlb(url: string): Promise<GLTF> {
		const gltfLoader = new GLTFLoader()
		return new Promise(resolve => {
			gltfLoader.load(url, glb => {
				resolve(glb)
			})
		})
	}

	/**
	 * 创建坐标轴辅助器
	 * @param size 长度
	 */
	addAxesHelper(size: number = 50, name: string = "axesHelper"): THREE.AxesHelper {
		const axesHelper = AxesHelper(size)
		axesHelper.name = name
		this.scene.add(axesHelper)
		return axesHelper
	}

	/**
	 * 创建坐标格辅助对象
	 * @param size 坐标格尺寸
	 * @param divisions 坐标格细分次数
	 */
	addGridHelper(
		size: number = 50,
		divisions: number = 50,
		colorCenterLine: THREE.Color = new THREE.Color(0x444444),
		colorGrid: THREE.Color = new THREE.Color(0x888888)
	): THREE.GridHelper {
		const gridHelper = GridHelper(size, divisions, colorCenterLine, colorGrid)
		this.scene.add(gridHelper)
		return gridHelper
	}

	/**
	 * 箭头辅助对象
	 * @param object 要渲染顶点法线辅助的对象
	 * @param size 箭头的长度. 默认为 1
	 * @param linewidth 箭头线段的宽度. 默认为 1
	 * @param color 16进制颜色值. 默认为 0xff0000
	 * @returns VertexNormalsHelper
	 */
	addVertexNormalsHelper(
		object,
		name: string = "VertexNormalsHelper",
		size: number = 1,
		color: string | number = 0xff0000,
		linewidth: number = 1
	) {
		const vertexNormalsHelper = VertexNormalsHelperCustom(object, size, color, linewidth)
		vertexNormalsHelper.name = name
		this.scene.add(vertexNormalsHelper)
		return vertexNormalsHelper
	}

	/**
	 * 添加信息显示
	 * @param type 0: fps, 1: ms, 2: mb, 3+: custom
	 */
	addStats(type: number = 0) {
		this.stats = new Stats()
		this.stats.showPanel(type)
		this.stats.dom.style.position = "absolute"
		this.stats.dom.style.left = "0px"
		this.stats.dom.style.top = "0px"
		this.domElement.appendChild(this.stats.dom)
	}

	/**
	 * 添加GUI
	 * @returns GUI
	 */
	addGUI(): GUI {
		this.gui = new GUI()
		return this.gui
	}

	/**
	 * 更新场景
	 */
	update() {
		const t = this.clock.getDelta()
		if (this.orbitControls) {
			this.orbitControls.update(t)
		}
		if (this.flyControls) {
			this.flyControls.update(t)
		}
		if (this.stats) {
			this.stats.update()
		}
		if (this.css3dRednerer) {
			this.css3dRednerer.render(this.scene, this.camera)
		}
		if (this.effect && this.composer) {
			this.composer.render()
		} else {
			this.webGlRender.render(this.scene, this.camera)
		}
	}

	/**
	 * 监听页面大小变化
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
	 * 销毁场景中物体
	 */
	destroyMesh(name?: string) {
		const meshes: any[] = []
		if (name) {
			const mesh = this.scene.getObjectByName(name)
			mesh && meshes.push(mesh)
		} else {
			this.scene.traverse(function (object) {
				if (object instanceof THREE.Mesh) meshes.push(object)
			})
		}
		for (let i = 0; i < meshes.length; i++) {
			const mesh = meshes[i]
			mesh.material.dispose()
			mesh.geometry.dispose()
			this.scene.remove(mesh)
		}
	}

	/**
	 * 销毁
	 */
	destroy() {
		if (this.gui) {
			this.gui.destroy()
		}
		this.destroyMesh()
		window.removeEventListener("resize", this.resize)
	}
}
