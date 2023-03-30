precision lowp float;

uniform float uHeight;

varying vec3 vPosition;

void main(){
  float gradMix = (vPosition.y + uHeight / 2.0) / uHeight;
  gl_FragColor = vec4(1,1,0,1.0 - gradMix);
}
