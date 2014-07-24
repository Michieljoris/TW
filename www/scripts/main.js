//node module
// var log = logthis
var log = logthis._create('default');

var conway = require('./conway.js');
console.log(conway);

console.log('Hello from a node module');
var cliks = $("#canvas").asEventStream("click");
log('hello');

cliks.onValue(function() {
    log('You clicked the canvas');
});

var buttonClick = $("button").asEventStream("click");

buttonClick.onValue(function() {
    
});

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var width = 600, height = 300;
$("#canvas").attr('width', width);
$("#canvas").attr('height', height);

function drawGrid(w, h, size) {
    ctx.beginPath();
    var rows = h/size;
    var columns = w/size;
    for (var i=0; i< rows; i++) {
        ctx.moveTo(0,i*size);
        ctx.lineTo(w,i*size);
    } 
    for (i=0; i< columns; i++) {
        ctx.moveTo(i*size, 0);
        ctx.lineTo(i*size, h);
        
    } 
    ctx.stroke();
    // ctx.endPath();
    
    
}
drawGrid(width, height, 20);

function cell(x, y, state) {
    
}
//  // ctx.fillStyle = "rgb(200,0,0)";
// ctx.strokeRect (10, 10, 55, 50);

// // ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
// ctx.strokeRect(30, 30, 55, 50);


var inc = function(n) {
  return n+1;
};

mori.into_array(mori.map(inc, mori.vector(1,2,3,4,5)));
// => [2,3,4,5,6]
