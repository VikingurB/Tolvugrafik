"use strict";

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;

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
        vec2(  1,  1 ),
        vec2(  1, -1 )
    ];

    divideSquare( vertices[0], vertices[1], vertices[2], vertices[3],
                    NumTimesToSubdivide);

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

function square( a, b, c, d )
{
    points.push( a, b, c);
    points.push( a, c, d);
}

function divideSquare( a, b, c, d, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        square( a, b, c, d );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 1/3 );
        var ba = mix( b, a, 1/3 );
        var ad = mix( a, d, 1/3 );
        var ac = mix( a, c, 1/3 );
        var bd = mix( b, d, 1/3 );
        var bc = mix( b, c, 1/3 );
        var da = mix( d, a, 1/3 );
        var db = mix( d, b, 1/3 );
        var ca = mix( c, a, 1/3 );
        var cb = mix( c, b, 1/3 );
        var dc = mix( d, c, 1/3 );
        var cd = mix( c, d, 1/3 );

        --count;

        // nine new squares

        divideSquare( a , ab, ac, ad, count );
        divideSquare( ab, ba, bd, ac, count );
        divideSquare( b , bc, bd, ba, count );
        divideSquare( bc, cb, ca, bd, count );
        divideSquare( c , cd, ca, cb, count );
        divideSquare( cd, dc, db, ca, count );
        divideSquare( d , da, db, dc, count );
        divideSquare( da, ad, ac, db, count );
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
