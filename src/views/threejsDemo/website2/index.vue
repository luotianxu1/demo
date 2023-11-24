<template>
	<div class="shadow_page">
		<div class="content">
			<nav class="header">
				<a href="https://github.com/dragonir/threejs-odessey" class="active a"><span>首页</span></a>
				<a href="https://github.com/dragonir/threejs-odessey" class="a"><span>关于</span></a>
				<a href="https://github.com/dragonir/threejs-odessey" class="a"><span>作品</span></a>
				<a href="https://github.com/dragonir/threejs-odessey" class="a"><span>我的</span></a>
				<a href="https://github.com/dragonir/threejs-odessey" class="a"><span>更多</span></a>
				<div class="cursor"></div>
			</nav>
			<section class="section first">
				<div class="info">
					<h2 class="name">DRAGONIR</h2>
					<h1 class="title">THREE.JS ODESSEY</h1>
					<p class="description">&nbsp;</p>
				</div>
				<div id="canvas-container" class="webgl" ref="container1Ref"></div>
			</section>
			<section class="section second">
				<div class="second-container">
					<ul>
						<li id="one" class="active">入门</li>
						<li id="two">基础</li>
						<li id="three">进阶</li>
					</ul>
					<p class="text" id="content">昨夜西风凋碧树。独上高楼，望尽天涯路。</p>
				</div>
				<div id="canvas-container-details" class="webgl" ref="container2Ref"></div>
			</section>
		</div>
	</div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

const container1Ref = ref<HTMLDivElement>()
const container2Ref = ref<HTMLDivElement>()
let container1: WebGl
let container2: WebGl
let oldMaterial

onMounted(() => {
	init()
})

const init = () => {
	if (!container1Ref.value) {
		return
	}
	container1 = new WebGl(container1Ref.value, {
		render: {
			antialias: true,
			logarithmicDepthBuffer: true
		}
	})
	container1.webGlRender.outputColorSpace = THREE.SRGBColorSpace
	// container1.camera = new THREE.PerspectiveCamera(35, container1Ref.value.offsetWidth / container1Ref.value.offsetHeight, 1, 100)
	// container1.camera.position.set(19, 1.54, -0.1)

	// 直射光
	const directionLight = new THREE.DirectionalLight(0xffffff, 0.8)
	directionLight.position.set(-100, 0, -100)
	container1.scene.add(directionLight)

	// 点光源
	const fillLight = new THREE.PointLight(0x88ffee, 2.7, 4, 3)
	fillLight.position.set(30, 3, 1.8)
	container1.scene.add(fillLight)

	container1.addGltf("./threejsDemo/website2/statue.glb").then(gltf => {
		gltf.scene.traverse(obj => {
			container1.scene.add(gltf.scene)
		})
	})

	container2 = new WebGl(container1Ref.value, {
		render: {
			antialias: true,
			logarithmicDepthBuffer: true
		}
	})
	container2.webGlRender.outputColorSpace = THREE.SRGBColorSpace

	renderScene()
}

const renderScene = () => {
	container1.webGlRender.render(container1.scene, container1.camera)
	requestAnimationFrame(renderScene)
}

onUnmounted(() => {
	container1.destroy()
	container2.destroy()
})
</script>

<style scoped lang="scss">
.shadow_page {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100%;
	overflow: hidden auto;
	color: #fff;
	scroll-behavior: smooth;
	overscroll-behavior: none;
}

.shadow_page .content .section {
	position: relative;
	z-index: 1;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	pointer-events: none;
	box-sizing: border-box;
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	user-select: none;
	flex-direction: column;
	align-content: center;
	justify-content: center;
	align-items: flex-start;
}

.shadow_page .content .section .webgl {
	width: 100%;
	height: 100%;
}

.shadow_page .content .section.first {
	position: relative;
	z-index: 1;
	display: flex;
	width: 100%;
	height: 100vh;
	overflow: hidden;
	font-size: 2em;
	letter-spacing: 0.5em;
	text-align: center;
	pointer-events: none;
	background: linear-gradient(0deg, #050505 20%, rgba(5, 5, 5, 0) 50%);
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	user-select: none;
	align-content: center;
	justify-content: flex-end;
	align-items: center;
	flex-direction: column;
}

.shadow_page .content .section.first .info {
	position: relative;
	z-index: 1;
}

.shadow_page .content .section.first .info .name {
	font-size: 2em;
	font-style: italic;
	font-weight: 100;
	letter-spacing: 0.25em;
	color: #03c03c;
}

.shadow_page .content .section.first .info .title {
	margin: 10px 0;
	font-size: 1.8em;
	font-weight: 100;
	letter-spacing: 0.4em;
}

.shadow_page .content .section.first .info .title::after {
	position: absolute;
	left: calc(50% - 25px);
	width: 50px;
	height: 2px;
	margin-top: 105px;
	background: rgba(255, 255, 255, 0.439);
	content: "";
}

.shadow_page .content .section.first .info .description {
	width: 80%;
	margin: 32px auto 16px;
	font-family: sans-serif;
	font-size: 0.45em;
	font-weight: lighter;
	line-height: 28px;
	letter-spacing: 0;
	color: rgba(201, 201, 201, 0.588);
	opacity: 0;
	transition: all 3.2s ease-in-out;
}

.shadow_page .content .section.first .info .description.ended {
	opacity: 1;
}

.shadow_page .content .section.first .webgl {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 0;
	width: 100vw;
	height: 100vh;
	padding: 0;
	margin: 0;
	pointer-events: none;
	background: #000;
	background: radial-gradient(circle at center center, #171717 0, #050505 58%);
	outline: none;
}

.shadow_page .content .section.second {
	z-index: 1;
	display: flex;
	width: 100%;
	height: 100vh;
	padding: 0;
	margin: 0;
	overflow: hidden;
	font-size: 2em;
	pointer-events: all;
	background: #141414;
}

.shadow_page .content .section.second .second-container {
	z-index: 2;
	display: flex;
	width: 100%;
	height: 100vh;
	padding: 0 10%;
	margin: 0;
	pointer-events: all;
	background: radial-gradient(circle at 90% center, rgba(5, 5, 5, 0) 30%, #141414 70%);
	flex-direction: column;
	justify-content: center;
}

.shadow_page .content .section.second .webgl {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 0;
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
	overflow: hidden;
	pointer-events: none;
	pointer-events: all;
	outline: none;
}

nav {
	position: fixed;
	z-index: 2;
	width: 100%;
	padding: 1rem;
}

span {
	display: inline-block;
	pointer-events: none;
	transition: transform 0.1s linear;
}

.cursor {
	position: fixed;
	top: 10px;
	left: 10px;
	z-index: 2;
	padding: 10px;
	pointer-events: none;
	background: rgba(255, 255, 255, 0.3);
	border: 0.5px solid rgba(255, 255, 255, 0.1);
	border-radius: 50%;
	transform: translate(-50%, -50%);
	transition: transform 0.8s ease, opacity 0.6s ease;
	backdrop-filter: blur(4px);
	mix-blend-mode: difference;
}

.a {
	display: inline-block;
	padding: 1rem;
	margin-right: 4rem;
	font-size: 1.2em;
	letter-spacing: 0.4em;
	color: #fff;
	transition: all 0.3s ease, color 0.3s ease;
}

nav.header .a:hover {
	color: #afafaf;
	cursor: pointer;
	transform: scale(1.1);
}

nav.header .a:hover ~ .cursor {
	opacity: 0.1;
	transform: translate(-50%, -50%) scale(5);
}

.dg.ac {
	z-index: 2 !important;
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.header {
	position: absolute;
	top: -2em;
	left: 0;
	z-index: 2;
	width: 100%;
	padding: 0;
	margin: 0;
	font-size: 0.8em;
	color: #fff;
	text-align: center;
	opacity: 0;
	transition: all 1.8s ease-in-out;
}

.header.ended {
	top: 3em;
	opacity: 1;
}

.header > span {
	position: relative;
	padding: 0 3.25em;
	letter-spacing: 0.4em;
}

.header > span.active::after,
.first {
	position: absolute;
	left: 50%;
	-webkit-transform: translate3d(-50%, 0, 0);
	transform: translate3d(-50%, 0, 0);
}

.header > span.active::after {
	bottom: -10px;
	width: 20px;
	height: 2px;
	background: #fff;
	content: "";
}

.second-container > ul {
	z-index: 2;
	display: inline-flex;
	padding: 0;
	margin: 0 0 64px 64px;
	color: rgba(255, 255, 255, 0.11);
	list-style: none;
}

.second-container > ul > li.active::after {
	position: relative;
	top: 20px;
	left: 0;
	display: block;
	width: 50px;
	height: 2px;
	background: #fff;
	content: "";
}

.second-container > ul > li {
	padding-right: 32px;
	font-size: 1.2em;
	transition: all 0.8s ease-out;
}

.second-container > ul > li:hover {
	color: #f5f5f5;
	pointer-events: all;
	cursor: pointer;
}

.second-container > ul > li:hover ~ nav.header.ended.cursor {
	opacity: 1;
	transform: translate(-50%, -50%) scale(5);
}

.second-container > ul > li.active {
	color: #f5f5f5;
}

.second-container .text {
	width: 30%;
	height: 300px;
	margin-left: 60px;
	font-size: 1.4em;
	line-height: 2;
	letter-spacing: 8px;
	color: rgba(255, 255, 255, 0.8);
}
@media only screen and (max-width: 660px) {
	.a {
		padding: 10px;
		margin-right: 0;
		letter-spacing: 0.3em;
	}

	.footer {
		margin-bottom: 20px;
	}

	.header > span {
		padding: 0 1em;
	}

	.header {
		font-size: 0.6em;
	}

	.main-section .product-display h3 {
		width: 260px;
		margin-left: 30px;
		font-size: 42px;
		line-height: 45px;
	}

	.first > h1 {
		margin: 10px 0;
		font-size: 13vw;
		font-weight: 100;
		letter-spacing: 0.2em;
	}

	.first > p {
		width: 85%;
		line-height: 22px;
	}

	.second-container {
		padding: 0;
		justify-content: flex-end;
	}

	.second-container > ul {
		width: 80%;
		margin: 0 0 30px 30px;
	}

	.second-container > ul > li {
		padding-right: 20px;
		font-size: 20px;
		transition: all 0.8s ease-out;
	}

	.second-container > p {
		width: 85%;
		margin-bottom: 40px;
		margin-left: 30px;
		line-height: 21px;
	}

	.third > p {
		column-count: 1;
	}
}
@-moz-keyframes lds-roller {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
@-webkit-keyframes lds-roller {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
@-o-keyframes lds-roller {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
@keyframes lds-roller {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
