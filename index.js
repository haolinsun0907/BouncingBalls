var gl;
var canvas;
var shaderProgram;
var gui;

// Create a place to store sphere geometry
var sphereBuffer;

//Create a place to store sphere normals for shading
var sphereNormalBuffer;
var spherecolorBuffer;
// Create a place to store cube geometry
var cubeBuffer;

//Create a place to store cube normals for shading
var cubeNormalBuffer;

var cubecolorBuffer;
var spheres_pos = [];		// position of sphere centers
var spheres_vel = [];		// velocity of spheres
var spheres_radius = [];		// radius of spheres
var spheres_mas = [];		// mass of spheres
var spheres_mat = [];		// color of spheres

var sphereCount = 0;	// number of spheres

var gravity = 1000;				// gravitional force
var drag = 1;				// drag amount
var bounceMultiplier = 0.95;	// the fraction of velocity that it skept after a bounce

var timenow = Date.now();
var timePrev = Date.now();
var timedt = 0;

// View parameters
var eyePt = vec3.fromValues(0.0,0.0,120.0);
var viewDir = vec3.fromValues(0.0,0.0,-1.0);
var up = vec3.fromValues(0.0,1.0,0.0);
var viewPt = vec3.fromValues(0.0,0.0,0.0);

// Create the normal
var nMatrix = mat3.create();

// Create ModelView matrix
var mvMatrix = mat4.create();

//Create Projection matrix
var pMatrix = mat4.create();
var mvMatrixStack = [];

var sphere_numItems =0;
var sphere_verts=[];
var sphere_normals=[];
var sphere_colors=[];
var sphere_ambient=[];
var sphere_diffuse=[];
var sphere_specular=[];
var sphere_shininess =[];

var sphere_radius=[];
var  	sphere_radius = 1;
var		sphere_power = 100.0;
	 
var gui_ambient=vec3.fromValues(0.5,0.5,0.5);
var gui_diffuse=vec3.fromValues(0.6,0.6,0.6);
var gui_specular=vec3.fromValues(0.8,0.8,0.8);
var gui_shininess = 32.0;
var sphere_num = 0;
var		sphere_random_radius = false;
var		sphere_random_color  = false;
var rotate = vec3.create();
var cube_verts = [];
var cube_normals = [];
var cube_colors=[];

function triangle(a, b, c ) {

     var t1 = subtract(b, a);
     var t2 = subtract(c, a);
     var t12 =   cross(t1,t2);
     var normal = normalize(t12);
     // console.log(a);
    // normal = vec3.fromValues(normal);

     
     sphere_normals.push(normal);
     sphere_normals.push(normal);
     sphere_normals.push(normal);

     
     sphere_verts.push(a);
     sphere_verts.push(b);      
     sphere_verts.push(c);

     sphere_colors.push(vec4.fromValues(0.1,0.1,0.1,1.0));
     sphere_colors.push(vec4.fromValues(0.1,0.1,0.1,1.0));
     sphere_colors.push(vec4.fromValues(0.1,0.1,0.1,1.0));
     sphere_numItems += 3;
}
 //----------------------------------------------------------------------------

function subtract( u, v )
{
    var result = [];

        for ( var i = 0; i < u.length; ++i ) {
            result.push( u[i] - v[i] );
        }
        return result;
}
function dot( u, v )
{
  

    var sum = 0.0;
    for ( var i = 0; i < u.length; ++i ) {
        sum += u[i] * v[i];
    }

    return sum;
}
function cross( u, v )
{
   

    var result = [ 
        u[1]*v[2] - u[2]*v[1],
        u[2]*v[0] - u[0]*v[2],
        u[0]*v[1] - u[1]*v[0]
    ];

    return result;
}

//----------------------------------------------------------------------------

function length( u )
{
    return Math.sqrt( dot(u, u) );
}
//----------------------------------------------------------------------------

function normalize( u )
{ 
    var len = length(u);
    for ( var i = 0; i < u.length; ++i ) {
        u[i] /= len;
    }
 
    return u;
}

function mix( u, v, s )
{
    

    var result = [];
    for ( var i = 0; i < u.length; ++i ) {
        result.push( s * u[i] + (1.0 - s) * v[i] );
    }

    return result;
}

function divideTriangle(a, b, c, count) {
	
    if ( count > 0 ) {
                
        var ab = mix( a, b, 0.5);  
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
             //    console.log(ab);
        ab = normalize(ab );
        ac = normalize(ac );
        bc = normalize(bc);

                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );

    }
    else { 
        triangle( a, b, c);
    }
}


function tetrahedron(a, b, c, d, n) {

    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}






function flatten( v,len=3 )
{
    

    var n = v.length;
	
    var floats = new Float32Array(n*len);
    var idx = 0;
        for ( var i = 0; i < v.length; ++i ) {
            for ( var j = 0; j < len; ++j ) {
                floats[idx++] = v[i][j];
            }
        }

 

    return floats;
}

 



// create a cube out of planes with subdivisions
function initCubeBuffers() {
 

	var t= 0.5;
 

	/////////////////////////////////////////////
  
   cube_verts.push(vec3.fromValues(  -60, -60, -60    ));
   cube_verts.push(vec3.fromValues(  60, -60, -60     ));
   cube_verts.push(vec3.fromValues(  60, 60, -60      ));

   cube_verts.push(vec3.fromValues(  60, 60, -60      ));
   cube_verts.push(vec3.fromValues(  -60, 60, -60     ));
   cube_verts.push(vec3.fromValues(  -60, -60, -60    ));

   cube_verts.push(vec3.fromValues(  -60, 60, 60      ));
   cube_verts.push(vec3.fromValues(  -60, 60, -60     ));
   cube_verts.push(vec3.fromValues(  -60, -60, -60    ));

   cube_verts.push(vec3.fromValues(  -60, -60, -60    ));
   cube_verts.push(vec3.fromValues(  -60, -60, 60     ));
   cube_verts.push(vec3.fromValues(  -60, 60, 60      ));

   cube_verts.push(vec3.fromValues(  60, 60, 60       ));
   cube_verts.push(vec3.fromValues(  60, 60, -60      ));
   cube_verts.push(vec3.fromValues(  60, -60, -60     ));

   cube_verts.push(vec3.fromValues(  60, -60, -60     ));
   cube_verts.push(vec3.fromValues(  60, -60, 60      ));
   cube_verts.push(vec3.fromValues(  60, 60, 60       ));

   cube_verts.push(vec3.fromValues(  -60, -60, -60    ));
   cube_verts.push(vec3.fromValues(  60, -60, -60     ));
   cube_verts.push(vec3.fromValues(  60, -60, 60      ));

   cube_verts.push(vec3.fromValues(  60, -60, 60      ));
   cube_verts.push(vec3.fromValues(  -60, -60, 60     ));
   cube_verts.push(vec3.fromValues(  -60, -60, -60    ));

   cube_verts.push(vec3.fromValues(  -60, 60, -60     ));
   cube_verts.push(vec3.fromValues(  60, 60, -60      ));
   cube_verts.push(vec3.fromValues(  60, 60, 60       ));

   cube_verts.push(vec3.fromValues(  60, 60, 60       ));
   cube_verts.push(vec3.fromValues(  -60, 60, 60      ));
   cube_verts.push(vec3.fromValues(  -60, 60, -60     ));


   cube_verts.push(vec3.fromValues(  -60, -60, 60    ));
   cube_verts.push(vec3.fromValues(  60, -60, 60     ));
   cube_verts.push(vec3.fromValues(  60, 60, 60      ));

   cube_verts.push(vec3.fromValues(  60, 60, 60      ));
   cube_verts.push(vec3.fromValues(  -60, 60, 60     ));
   cube_verts.push(vec3.fromValues(  -60, -60, 60    ));
 

   cube_normals.push(vec3.fromValues(0,0,1));
   cube_normals.push(vec3.fromValues(0,0,1));
   cube_normals.push(vec3.fromValues(0,0,1));
   cube_normals.push(vec3.fromValues(0,0,1));
   cube_normals.push(vec3.fromValues(0,0,1));
   cube_normals.push(vec3.fromValues(0,0,1));

   cube_colors.push(vec4.fromValues(1,0,0,t));
   cube_colors.push(vec4.fromValues(1,0,0,t));
   cube_colors.push(vec4.fromValues(1,0,0,t));
   cube_colors.push(vec4.fromValues(1,0,0,t));
   cube_colors.push(vec4.fromValues(1,0,0,t));
   cube_colors.push(vec4.fromValues(1,0,0,t));


 

   cube_normals.push(vec3.fromValues(1,0,0));
   cube_normals.push(vec3.fromValues(1,0,0));
   cube_normals.push(vec3.fromValues(1,0,0));
   cube_normals.push(vec3.fromValues(1,0,0));
   cube_normals.push(vec3.fromValues(1,0,0));
   cube_normals.push(vec3.fromValues(1,0,0));


   cube_colors.push(vec4.fromValues(1,1,0,t));
   cube_colors.push(vec4.fromValues(1,1,0,t));
   cube_colors.push(vec4.fromValues(1,1,0,t));
   cube_colors.push(vec4.fromValues(1,1,0,t));
   cube_colors.push(vec4.fromValues(1,1,0,t));
   cube_colors.push(vec4.fromValues(1,1,0,t));


  

   cube_normals.push(vec3.fromValues(-1,0,0));
   cube_normals.push(vec3.fromValues(-1,0,0));
   cube_normals.push(vec3.fromValues(-1,0,0));
   cube_normals.push(vec3.fromValues(-1,0,0));
   cube_normals.push(vec3.fromValues(-1,0,0));
   cube_normals.push(vec3.fromValues(-1,0,0));

   cube_colors.push(vec4.fromValues(0,1,1,t));
   cube_colors.push(vec4.fromValues(0,1,1,t));
      cube_colors.push(vec4.fromValues(0,1,1,t));
	     cube_colors.push(vec4.fromValues(0,1,1,t));
		    cube_colors.push(vec4.fromValues(0,1,1,t));
		 cube_colors.push(vec4.fromValues(0,1,1,t));


   cube_normals.push(vec3.fromValues(0,1,0));
   cube_normals.push(vec3.fromValues(0,1,0));
   cube_normals.push(vec3.fromValues(0,1,0));
   cube_normals.push(vec3.fromValues(0,1,0));
   cube_normals.push(vec3.fromValues(0,1,0));
   cube_normals.push(vec3.fromValues(0,1,0));


   cube_colors.push(vec4.fromValues(0,1,0,t));
  cube_colors.push(vec4.fromValues(0,1,0,t));
   cube_colors.push(vec4.fromValues(0,1,0,t));
    cube_colors.push(vec4.fromValues(0,1,0,t));
	 cube_colors.push(vec4.fromValues(0,1,0,t));
	  cube_colors.push(vec4.fromValues(0,1,0,t));
 

   cube_normals.push(vec3.fromValues(0,-1,0));
   cube_normals.push(vec3.fromValues(0,-1,0));
   cube_normals.push(vec3.fromValues(0,-1,0));

   cube_normals.push(vec3.fromValues(0,-1,0));
   cube_normals.push(vec3.fromValues(0,-1,0));
   cube_normals.push(vec3.fromValues(0,-1,0));

   cube_colors.push(vec4.fromValues(1,0,1,t));
   cube_colors.push(vec4.fromValues(1,0,1,t));
   cube_colors.push(vec4.fromValues(1,0,1,t));
   cube_colors.push(vec4.fromValues(1,0,1,t));
   cube_colors.push(vec4.fromValues(1,0,1,t));
   cube_colors.push(vec4.fromValues(1,0,1,t));
	 
	 
	 
	 
   cube_normals.push(vec3.fromValues(0,0,-1));
   cube_normals.push(vec3.fromValues(0,0,-1));
   cube_normals.push(vec3.fromValues(0,0,-1));
   cube_normals.push(vec3.fromValues(0,0,-1));
   cube_normals.push(vec3.fromValues(0,0,-1));
   cube_normals.push(vec3.fromValues(0,0,-1));

   cube_colors.push(vec4.fromValues(0,0,1,t));
   cube_colors.push(vec4.fromValues(0,0,1,t));
   cube_colors.push(vec4.fromValues(0,0,1,t));
   cube_colors.push(vec4.fromValues(0,0,1,t));
   cube_colors.push(vec4.fromValues(0,0,1,t));
   cube_colors.push(vec4.fromValues(0,0,1,t));   
	 
	/////////////////////////////////////////////

	// fill in vertex position buffer
	cubeBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer); 
	gl.bufferData(gl.ARRAY_BUFFER, flatten(cube_verts), gl.STATIC_DRAW);
	cubeBuffer.itemSize = 3;
	cubeBuffer.numItems = 36;

	// fill in vertex normal buffer
	cubeNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(cube_normals), gl.STATIC_DRAW);
	cubeNormalBuffer.itemSize = 3;
	cubeNormalBuffer.numItems = 36;

	cubecolorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubecolorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,  flatten(cube_colors,4), gl.STATIC_DRAW);
	cubecolorBuffer.itemSize = 4;
	cubecolorBuffer.numItems = 36;
 
   //  console.log(flatten(cube_colors,4));
}
 
//-------------------------------------------------------------------------
function initSphereBuffers() {
  
    var va = vec3.fromValues(0.0, 0.0, -1.0);
	var vb = vec3.fromValues(0.0, 0.942809, 0.333333);
	var vc = vec3.fromValues(-0.816497, -0.471405, 0.333333);
	var vd = vec3.fromValues(0.816497, -0.471405, 0.333333);

    tetrahedron(va, vb, vc, vd,6);
 //	console.log( flatten (sphere_verts));
    //console.log(sphere_normals);
    sphereBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer);      
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphere_verts), gl.STATIC_DRAW);
    sphereBuffer.itemSize = 3;
    sphereBuffer.numItems = sphere_numItems;
     
    // Specify normals to be able to do lighting calculations
    sphereNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,  flatten(sphere_normals), gl.STATIC_DRAW);
    sphereNormalBuffer.itemSize = 3;
    sphereNormalBuffer.numItems = sphere_numItems;   
   // sphere_numItems =0;

    spherecolorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,spherecolorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,   flatten(sphere_colors,4), gl.STATIC_DRAW);
    spherecolorBuffer.itemSize = 4;
    spherecolorBuffer.numItems = sphere_numItems;   
   
}

//-------------------------------------------------------------------------
function drawSphere(){
 
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// Bind normal buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	
	gl.bindBuffer(gl.ARRAY_BUFFER, spherecolorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, spherecolorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	      // console.log("s" + sphereBuffer.numItems);
	gl.drawArrays(gl.TRIANGLES, 0, sphereBuffer.numItems);      
}

function drawCube(){
	// Bind positions buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// Bind normal buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubecolorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,cubecolorBuffer.itemSize, gl.FLOAT, false, 0, 0);


 //console.log("c " + cubeBuffer.numItems);
	gl.drawArrays(gl.TRIANGLES, 0, cubeBuffer.numItems); 
}

//-------------------------------------------------------------------------
function uploadModelViewMatrixToShader() {
	gl.uniformMatrix4fv(shaderProgram.mvMatrixLoc, false, mvMatrix);
}

//-------------------------------------------------------------------------
function uploadProjectionMatrixToShader() {
	gl.uniformMatrix4fv(shaderProgram.porjectMatrixLoc, false, pMatrix);
}

//-------------------------------------------------------------------------
function uploadNormalMatrixToShader() {
	mat3.fromMat4(nMatrix,mvMatrix);
	mat3.transpose(nMatrix,nMatrix);
	mat3.invert(nMatrix,nMatrix);
	gl.uniformMatrix3fv(shaderProgram.normalMatrixLoc, false, nMatrix);
}

//----------------------------------------------------------------------------------
function mvPushMatrix() {
    var copy = mat4.clone(mvMatrix);
    mvMatrixStack.push(copy);
}


//----------------------------------------------------------------------------------
function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
    	throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

//----------------------------------------------------------------------------------
function setMatrixUniforms() {
    uploadModelViewMatrixToShader();
    uploadNormalMatrixToShader();
    uploadProjectionMatrixToShader();
}

//----------------------------------------------------------------------------------
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

//----------------------------------------------------------------------------------
function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

//----------------------------------------------------------------------------------
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
	shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

//----------------------------------------------------------------------------------
function setupShaders() {
    vertexShader = loadShaderFromDOM("shader-vs");
    fragmentShader = loadShaderFromDOM("shader-fs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Failed to setup shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexpos");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "vertexnormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);


    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexcolor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);


    shaderProgram.mvMatrixLoc = gl.getUniformLocation(shaderProgram, "modelMatrix");
    shaderProgram.porjectMatrixLoc = gl.getUniformLocation(shaderProgram, "projectMatrix");
    shaderProgram.normalMatrixLoc = gl.getUniformLocation(shaderProgram, "NormalMatrix");
      
    shaderProgram.lightpositionLoc = gl.getUniformLocation(shaderProgram, "lightpos");    
    shaderProgram.lightambientLoc = gl.getUniformLocation(shaderProgram, "light_ambientcolor");  
    shaderProgram.lightdiffuseLoc = gl.getUniformLocation(shaderProgram, "light_diffusecolor");
    shaderProgram.lightspecularLoc = gl.getUniformLocation(shaderProgram, "light_Specularcolor");
      
    shaderProgram.uniformAmbientMatColorLoc = gl.getUniformLocation(shaderProgram, "ambientcolor");  
    shaderProgram.uniformDiffuseMatColorLoc = gl.getUniformLocation(shaderProgram, "diffusecolor");
    shaderProgram.uniformSpecularMatColorLoc = gl.getUniformLocation(shaderProgram, "specularcolor");    
    shaderProgram.uniformShininessMatColorLoc = gl.getUniformLocation(shaderProgram, "shininess"); 
 
}


//-------------------------------------------------------------------------
function updatelight(loc,a,d,s) {
	gl.uniform3fv(shaderProgram.lightpositionLoc, loc);
	gl.uniform3fv(shaderProgram.lightambientLoc, a);
	gl.uniform3fv(shaderProgram.lightdiffuseLoc, d);
	gl.uniform3fv(shaderProgram.lightspecularLoc, s);
}

//-------------------------------------------------------------------------
function updatecolor(a,d,s,sh) {
	gl.uniform3fv(shaderProgram.uniformAmbientMatColorLoc, a);
	gl.uniform3fv(shaderProgram.uniformDiffuseMatColorLoc, d);
	gl.uniform3fv(shaderProgram.uniformSpecularMatColorLoc, s);
	gl.uniform1f(shaderProgram.uniformShininessMatColorLoc,sh);
}


//----------------------------------------------------------------------------------
function setupBuffers() {
    initSphereBuffers();
	initCubeBuffers();   
}

//----------------------------------------------------------------------------------
function draw() { 
    var transformVec = vec3.create();
  
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // We'll use perspective 
    mat4.perspective(pMatrix,degToRad(90), gl.viewportWidth / gl.viewportHeight, 0.1, 200.0);

    // Then generate the lookat matrix and initialize the MV matrix to that view
    mat4.lookAt(mvMatrix,eyePt,viewPt,up);

    // Set up light parameters
    var Ia = vec3.fromValues(1.0,1.0,1.0);
    var Id = vec3.fromValues(1.0,1.0,1.0);
    var Is = vec3.fromValues(0.0,0.0,0.0);
    
    var lightpos4 = vec4.fromValues(0.0,0.0,0.0,1.0);
    lightpos4 = vec4.transformMat4(lightpos4,lightpos4,mvMatrix);
    var lightPosEye = vec3.fromValues(lightpos4[0],lightpos4[1],lightpos4[2]);

	var ma = vec3.fromValues(0.51, 0.51, 0.51);			// get the ambient color of the cube
	var md = vec3.fromValues(.70, 0.80, 0.70);			// get the diffuse color of the cube
	var ms = vec3.fromValues(.70, .80, .90);			// get the specular color of the cube

	updatelight(lightPosEye,Ia,Id,Is);		// apply the light
		updatecolor(ma, md, ms,128);				// apply the color of the cube
							// apply the cube attributes
		setMatrixUniforms();	
	  
 
			setMatrixUniforms();	
     gl.depthMask(false);
    		drawCube();								// draw the cube
 gl.enable(gl.BLEND);

      gl.depthMask(true);
       gl.disable(gl.BLEND);
   gl.blendFunc(gl.SRC_ALPHA, gl.ONE); 

 
	for(var i=0; i<sphereCount; i++){
		mat4.lookAt(mvMatrix,eyePt,viewPt,up);			// reset model view matrix

		vec3.set(transformVec, spheres_pos[i*3], spheres_pos[i*3+1], spheres_pos[i*3+2]);		// get the position of the sphere
		mat4.translate(mvMatrix, mvMatrix,transformVec);								// translate the model view matrix for the sphere
	
	vec3.set(transformVec,spheres_radius[i], spheres_radius[i], spheres_radius[i]);				// get the radius of the sphere
  
		mat4.scale(mvMatrix, mvMatrix,transformVec);									// scale the model view matrix for the sphere
 
		var a = sphere_ambient[i];		// get the ambient color of the sphere
		var d = sphere_diffuse[i];		// get the diffuse color of the sphere
		var s = sphere_specular[i];
		var sh = sphere_shininess[i];
		updatecolor(a, d, s,sh);				// apply the color of the sphere
		setMatrixUniforms();							// apply the sphere attributes

		drawSphere();							// draw the sphere
	}

}

//----------------------------------------------------------------------------------
function animate() {
	timenow = Date.now();							// get the new current time
	timedt = (timenow - timePrev) / 1000;		// get the time between last frame and this frame
	timePrev = timenow;							// update the last frame time

    for(var i=0; i<sphereCount; i++){
		spheres_pos[i*3] = spheres_pos[i*3] + (spheres_vel[i*3] * timedt);			// update x position
		spheres_pos[i*3+1] = spheres_pos[i*3+1] + (spheres_vel[i*3+1] * timedt);		// update y position
		spheres_pos[i*3+2] = spheres_pos[i*3+2] + (spheres_vel[i*3+2] * timedt);		// update z position

		// account for collisions
		for(var j=0; j<3; j++){
			if(spheres_pos[i*3+j] + spheres_radius[i] > 60){
				spheres_pos[i*3+j] = 60 - ((spheres_pos[i*3+j] + spheres_radius[i]) - 60) - spheres_radius[i];
				spheres_vel[i*3+j] = (-bounceMultiplier)*spheres_vel[i*3+j];
			}else if(spheres_pos[i*3+j] - spheres_radius[i] < -60){
				spheres_pos[i*3+j] = -60 - ((spheres_pos[i*3+j] - spheres_radius[i]) + 60) + spheres_radius[i];
				spheres_vel[i*3+j] = (-bounceMultiplier)*spheres_vel[i*3+j];
			}
		}

		var dt = Math.pow(drag, timedt);	// drag force to the elapsed time power

		spheres_vel[i*3] = spheres_vel[i*3] * dt;
		spheres_vel[i*3+1] = (spheres_vel[i*3+1] * dt) - (gravity*timedt);		// update y velocity to account for gravity
		spheres_vel[i*3+2] = spheres_vel[i*3+2] * dt;
	}
}


//----------------------------------------------------------------------------------
function Main() {
  canvas = document.getElementById("mycanvas");
   
  gl =createGLContext(canvas);
  gui = new dat.GUI();
  
  
  
  
  	let controls = new function() {
		this.RotateX = 0;
		this.RotateY = 0;
	    
		this.ambient = [Math.trunc(255 * gui_ambient[0]), Math.trunc(255 * gui_ambient[1]), Math.trunc(255 * gui_ambient[2])] ;
		this.diffuse =[Math.trunc(255 * gui_diffuse[0]), Math.trunc(255 * gui_diffuse[1]), Math.trunc(255 * gui_diffuse[2])] ;
		this.specular =[Math.trunc(255 * gui_specular[0]), Math.trunc(255 * gui_specular[1]), Math.trunc(255 * gui_specular[2])] ;
		this.shininess = 32.0;
		
		this.radius = sphere_radius;
		this.power = drag;
		
		this.random_radius = sphere_random_radius;
		this.random_color = sphere_random_color;
		
		this.sphere_num = 0;
		
		this.update=function(value){
			 
			 
			
			 
			 if(value >sphereCount)//add sphere
			 {
				 for(let i=0;i<value-sphereCount;i++)
				 {
					 if(sphere_random_radius ==true)
					 {
						 spheres_radius.push((Math.random()*5) + 1);//radius
					 }
					 else
					 {
						 spheres_radius.push(sphere_radius);
					 }
					 if(sphere_random_color == true)
					 {
		sphere_ambient.push(vec3.fromValues(Math.random(),Math.random(),Math.random()));
		sphere_diffuse.push(vec3.fromValues(Math.random(),Math.random(),Math.random()));
		sphere_specular.push(vec3.fromValues(Math.random(),Math.random(),Math.random()));
		sphere_shininess.push(gui_shininess);
					 }
					 else
					 {
						  	sphere_ambient.push(vec3.fromValues(gui_ambient[0],gui_ambient[1],gui_ambient[2]));
		sphere_diffuse.push(vec3.fromValues(gui_diffuse[0],gui_diffuse[1],gui_diffuse[2]));
		sphere_specular.push(vec3.fromValues(gui_specular[0],gui_specular[1],gui_specular[2]));
		sphere_shininess.push(gui_shininess);
					 }
					
					 
		spheres_mas.push(Math.pow(spheres_radius, 9)); 		 	
		//   position  
		spheres_pos.push((Math.random()-0.5)*100+100);
		spheres_pos.push((Math.random()-0.5)*100+100);
		spheres_pos.push((Math.random()-0.5)*100+100);
		
			//   velocity   random
		spheres_vel.push((Math.random()-0.5)*100);
		spheres_vel.push((Math.random()-0.5)*100);
		spheres_vel.push((Math.random()-0.5)*100);
		
		//console.log(gui_ambient);
		
	
		
		
				sphereCount++;				// add a sphere
		
		
				 }
				 
			 }
			 
			if(value < sphereCount)//delete sphere
			{
				 for(let i=0;i<sphereCount -value;i++)
				 {
					  
			spheres_pos.pop();
		 
		 
			spheres_vel.pop();
	 
			spheres_radius.pop();
	 
			spheres_mas.pop();
		 
			spheres_mat.pop();
	 		sphere_ambient.pop();
			sphere_diffuse.pop();
			sphere_specular.pop();
			sphere_shininess.pop();
			sphereCount--;
				 }
			}
 
	  
			
		};
		this.rotate = function () {
			 
			
			eyePt[0] = 120 * Math.cos((controls.RotateX * Math.PI) / 180) * Math.sin((controls.RotateY * Math.PI) / 180);
			eyePt[1] = 120 * Math.sin((controls.RotateX * Math.PI) / 180);
			eyePt[2] = 120 * Math.cos((controls.RotateX * Math.PI) / 180) * Math.cos((controls.RotateY * Math.PI) / 180);
			 
			 
		};
		 
	};

 
	gui.add(controls, 'RotateX', 0, 360).onChange(controls.rotate);
	gui.add(controls, 'RotateY', 0, 360).onChange(controls.rotate);
	gui.addColor(controls, 'ambient').onChange(function(value){
		gui_ambient[0] = value[0] / 255.0;
        gui_ambient[1] = value[1] / 255.0;
        gui_ambient[2] = value[2] / 255.0;  });
	gui.addColor(controls, 'diffuse').onChange(function(value){
		gui_diffuse[0] = value[0] / 255.0;
          gui_diffuse[1] = value[1] / 255.0;
         gui_diffuse[2] = value[2] / 255.0;  });
	gui.addColor(controls, 'specular').onChange(function(value){
		gui_specular[0] = value[0] / 255.0;
          gui_specular[1] = value[1] / 255.0;
         gui_specular[2] = value[2] / 255.0;  } 	);
	gui.add(controls, 'shininess',0.1,128.0).onChange(function(value){gui_shininess = value; });
	
    gui.add(controls, 'radius',0.1,4.0).onChange(function(value){sphere_radius = value; });
    gui.add(controls, 'power',1.0,3.0).onChange(function(value){drag = value; });
  
    gui.add(controls, 'random_radius').onChange(function(value){ sphere_random_radius = value;});
    gui.add(controls, 'random_color').onChange(function (value){ sphere_random_color = value;});
      gui.add(controls, 'sphere_num',0,1000).onChange(controls.update);
   

  
  
  
  
  
 // gl = canvas.getContext('webgl2');
  setupShaders();
  setupBuffers();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  tick();
}


//----------------------------------------------------------------------------------
function tick() {
    requestAnimFrame(tick);
    draw();
    animate();
}
 