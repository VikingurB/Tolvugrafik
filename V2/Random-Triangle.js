var canvas;
var gl;

var points = [];

var NumTimesToShift = 2;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -1, -1 ),
        vec2( -1,  1 ),
        vec2(  1, -1 ),
        vec2(  1,  1 )
    ];

    shiftTriangle( vec2(-0.05, -0.05), vec2(0, 0.05), vec2(0.05, -0.05),
                    NumTimesToShift);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function shiftTriangle( a, b, c, count )
{
    var j = Math.floor(Math.random() * 3);
    triangle( a, b, c );
    count--;
    var x = mix(a,vertices[j],0.25)
    var y = mix(b,vertices[j],0.25)
    var z = mix(c,vertices[j],0.25)
    shiftTriangle(x, y, z , count);
    //var p = add( a, vertices[j] );
    
    
    /*for (var i = 0; i < NumTimesToShift; i++) {
            var j = Math.floor(Math.random() * 4);
            
        }*/

    // check for end of recursion

    /*if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 1 );
        var ac = mix( a, c, 1 );
        var bc = mix( b, c, 1 );

        --count;

        // three new triangles

        shiftTriangle( a, b, c, count );
    }*/
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
