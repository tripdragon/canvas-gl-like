

export function tacos(aa) {
  console.log("¿¿¿2222", aa);
}


export function init({canvas, image, fragShader}={}) {
  console.log("inintiinininng", canvas);
  if (!canvas) {
      // console.log("missing dom element!!!");
      // return;
      throw new Error("missing da canvas element")
  }
  
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    console.warn("no GL!!!");
  }
  
  const vertexSource = `#version 300 es
  
                      // in vec4 a_position;
  in vec2 a_position;
  uniform vec2 u_resolution;
  
  in vec2 a_texCoord;
  out vec2 v_texCoord;
  
  void main() {
    
                        // vec2 zeroToOne = a_position / u_resolution; // convert the position from pixels to 0.0 to 1.0
                        
                        // vec2 zeroToTwo = zeroToOne * 2.0; // convert from 0->1 to 0->2
                        // vec2 zeroToTwo = vec2(100.0,100.0) * 2.0; // convert from 0->1 to 0->2
                        
                        // vec2 clipSpace = zeroToTwo - 1.0; // convert from 0->2 to -1->+1 (clip space)
                        
                        //gl_Position = a_position;
                        
    v_texCoord = a_texCoord;
    
                        // clipSpace.y *= -1.0;
                        // gl_Position = vec4(clipSpace, 0, 1);
                        // gl_Position = vec4(clipSpace * vec2(1,-1), 0, 1);
    gl_Position = vec4(a_position,0.,1.);
  }
  `;
   
  let fragmentSource = `#version 300 es   
  precision highp float;
  uniform sampler2D u_image;
  uniform vec2 u_resolution;
  
  in vec2 v_texCoord;
  out vec4 outColor;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    // outColor = vec4(1, 0, 0.5, 1);
    outColor = texture(u_image, v_texCoord);
    outColor = vec4( v_texCoord, 0,1);
    
  }
  `;
  function removeNewLines(inputString) {
    return inputString.replace(/(\r\n|\n|\r)/gm, "");
  }
  if(fragShader){
    // setup the basics, so the user just submits vars and main()
    let ff = `#version 300 es
    
    precision highp float;
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    in vec2 v_texCoord;
    out vec4 outColor;

    `;
    
    // debugger

    fragmentSource = ff + fragShader;

    
  //   fragmentSource = `#version 300 es    
  //   precision highp float;
  //   uniform sampler2D u_image;
  //   uniform vec2 u_resolution;    
  //   in vec2 v_texCoord;    
  //   out vec4 outColor;             
  //   void main() {           
  //   vec2 uv = gl_FragCoord.xy / u_resolution;           
  //   // outColor = vec4(1, 0, 0.5, 1);           
  //   outColor = texture(u_image, v_texCoord);           
  //   outColor = vec4( v_texCoord, 0,1);                    
  // }    `;
    
    // debugger
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
  // starting stuff
  
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");
  const imageLocation = gl.getUniformLocation(program, "u_image");


  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 2d coords for two tris
  // var positions = [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];
  var positions = [
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0,
    ];
  // positions = positions.map(x=>x*200);
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const vao = gl.createVertexArray();

  gl.bindVertexArray(vao);

  gl.enableVertexAttribArray(positionAttributeLocation);

  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  
  
  
  // a:
  // provide texture coordinates for the rectangle.
  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  const tPositions = [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tPositions), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordAttributeLocation);
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer( texCoordAttributeLocation, size, type, normalize, stride, offset)

  // Create a texture.
  var texture = gl.createTexture();

  // make unit 0 the active texture unit
  // (i.e, the unit all other texture commands will affect.)
  gl.activeTexture(gl.TEXTURE0 + 0);

  // Bind texture to 'texture unit '0' 2D bind point
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we don't need mips and so we're not filtering
  // and we don't repeat
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  if(image){
    
    // Upload the image into the texture.
    var mipLevel = 0;               // the largest mip
    var internalFormat = gl.RGBA;   // format we want in the texture
    var srcFormat = gl.RGBA;        // format of data we are supplying
    var srcType = gl.UNSIGNED_BYTE  // type of data we are supplying
    // images are flipped in y
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, srcFormat, srcType, image);
  }
  // b:
  
  
  
  
  
  applyRectSize(gl.canvas);
  // we dont need this cause its based on custom card size
  // resizeCanvasToDisplaySize(gl.canvas);
  console.log(gl.canvas);
  
  // convert from the clip space values we'll be setting gl_Position to back into pixels, often called screen space
  // need to see if this is needed
  // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);



  // const primitiveType = gl.TRIANGLES;
  // const offset = 0;
  // const count = 6;
  // 
  // gl.drawArrays(primitiveType, offset, count);
    
  draw(gl, vao, resolutionUniformLocation);
  
  
  // window.onresize = function () {
  //   applyRectSize(gl.canvas);
  //   draw(gl, vao, resolutionUniformLocation);
  // };
  
}



// ++++++++++++++
// functions like

function draw(gl, vao, resolutionUniformLocation) {
  
  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  
 
  // Pass in the canvas resolution so we can convert from
  // pixels to clip space in the shader
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // Tell the shader to get the texture from texture unit 0
  // gl.uniform1i(imageLocation, 0);

  gl.bindVertexArray(vao);

  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);
}


function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}


function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function clearProgramAndShader(gl, shader, program) {
  gl.deleteShader(shader);
  gl.deleteProgram(program);
}



function resizeCanvasToDisplaySize(canvas) {
  
  // use around here
  // function drawScene() {
   // resizeCanvasToDisplaySize(gl.canvas);
 
  
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth  = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
 
  // Check if the canvas is not the same size.
  const needResize = canvas.width  !== displayWidth ||
                     canvas.height !== displayHeight;
 
  if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
 
  return needResize;
}

function applyRectSize(canvas) {
  const rect = canvas.getBoundingClientRect();
  canvas.width =  rect.width;
  canvas.height =  rect.height;
  console.log(canvas);
}
