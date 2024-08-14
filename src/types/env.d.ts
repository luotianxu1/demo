/// <reference types="vite/client" />

declare module "three/nodes"
declare module "three/addons/renderers/webgl/nodes/WebGLNodes.js"
declare module "three/addons/textures/FlakesTexture.js"
declare module "leaflet-ant-path"
declare module "leaflet-minimap"
declare const Loca: any
declare module "three/addons/helpers/VertexNormalsHelper"
declare module "three/addons/controls/TransformControls"
declare module "three/addons/objects/Lensflare"

declare module "*.vue" {
	import type { DefineComponent } from "vue"
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>
	export default component
}
