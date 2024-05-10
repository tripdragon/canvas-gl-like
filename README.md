# canvas-gl-like
Its canvas only in GL!!!

python3 -m http.server 9000

Its canvas webgl with shaders!

Simply put, it loads all the noise of webgl in the background and you just inline your shader code.
Kinda like Book of shaders or shadertoy but well not as large as those yet

Figured this was available at this point in technology but nurp, nor are shareable gif like files that load a mini shader program. ANCIENT tech world...

Sources: https://webgl2fundamentals.org/ and a bit of cross checking with chatygpt


## Sample

```html
<script type="module" src="./canvas-gl.js"></script>

<canvas is="canvas-gl" width="500" height="300" id="aaacanvas3d" src="NFT_ourealy_ourealy.png" shader="
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  outColor = texture(u_image, v_texCoord);
}
"></canvas>

<canvas is="canvas-gl" width="500" height="300" id="aaacanvas3d" sdfsdfsrc="GFd9c7oa0AAyPAI.jpeg" shader="
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  outColor = vec4( v_texCoord, 0,1);
}
"></canvas>

```
