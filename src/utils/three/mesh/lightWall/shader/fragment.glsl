precision lowp float;

uniform float uHeight;
uniform vec3 uColor;

varying vec3 vPosition;

void main(){
  float gradMix = (vPosition.y + uHeight / 3.0) / uHeight;
  gl_FragColor = vec4(uColor,1.0 - gradMix);
}
