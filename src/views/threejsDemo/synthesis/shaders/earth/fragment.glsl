// 获取纹理
uniform sampler2D map;
// 纹理坐标
varying vec2 vUv;

void main(void){
  gl_FragColor = gl_FragColor + texture2D( map, vUv );
}
