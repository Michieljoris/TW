console.log('Hello from a node module');
var log = logthis._create('default');
logthis.default._enable(); //comment out when finished.
//don't forget to execute logthis._on() in the browser for logging output

var conway = require('./conway.js');

var width = parseInt(localStorage.getItem('width') || "600"),
    height = parseInt(localStorage.getItem('height') || "300"),
    cellSize = parseInt(localStorage.getItem('cellSize') || "20"),
    startPattern = localStorage.getItem('startPattern') || '',
    cells = {};




var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');



$("#canvas").attr('width', width+1);
$("#canvas").attr('height', height+1);



var cliks = $("#canvas").asEventStream("click");
log('hello');

cliks.onValue(function(ev) {
    // log('You clicked the canvas', ev.offsetX, ev.offsetY);
    var x = Math.floor(ev.offsetX/cellSize);
    var y = Math.floor(ev.offsetY/cellSize);
    log(x,y);
    var ref = x + '.' + y;
    if (cells[ref]) {
        delete cells[ref];   
        log('was on', cells);
        ctx.clearRect(x * cellSize+1, y * cellSize+1, cellSize-1, cellSize-1);
        
      // ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        log(ctx);
    }
    else {
        // ctx.fillStyle = "rgb(200,200.200)";
        cells[ref] = [x,y] ;   
        log('was off', cells);
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
    log(cells);
    
});

function arrayify(str) {
    return str.slice('pattern-'.length).split('-').map(function(p) {
        return p.split('.');
    });
}

function clear() {
    log('clearing grid');
}

function flip(cells) {
    log(cells);
}

function recall(next) {
    var patterns = Object.keys(localStorage).filter(function(p) {
        return p.indexOf('pattern-') === 0;
    });
    var index = patterns.indexOf(startPattern) || 0;
    clear();
    startPattern = patterns[(next(index) + patterns.length) % patterns.length];
    log(startPattern);
    var cells = arrayify(startPattern);
    flip(cells);
}

var handler = {
    start: function() {
    }
    ,stop: function() {
    }
    ,reset: function() {
    }
    
    ,recallPrev: function() {
       recall(function(i) { return i-1; });
    }
    ,recallNext: function() {
       recall(function(i) { return i+1; });
    }
    ,clear: function() {
        clear();
    }
    ,delete: function() {
        localStorage.removeItem(startPattern);
        clear();
    }
    ,reset: function() {
        localStorage.removeItem(startPattern);
        clear();
    }
    ,save: function() {
        var str = Object.keys(cells).join('-');
        localStorage.setItem('pattern-' + str, 1);
    }
    ,export: function() {
        $("#export").removeClass('hide');
        $("#main").addClass('hide');
        $("#export").html("//Please refresh the browser to get back to the app<br>" +
                         "var id = [ [1,2],[3,4] ]");
    }
};


var buttonClick = $("button").asEventStream("click");
buttonClick.onValue(function(ev) {
    var button = ev.target.id;
    if (handler[button]) handler[button]();
    else log('No button by this name ', button);
});

$("#grid-size-height").slider({
    orientation: 'vertical', min: 100, max: 1200, step: 50, value: height, handle: 'square'
}).on('slide', function(ev){
    if (ev.value !== height) {
        $("#canvas").attr('width', width+1);
        $("#canvas").attr('height', ev.value+1);
        height = ev.value;
        drawGrid(width, height, cellSize);
        localStorage.setItem('height', height);
    };

});

$("#grid-size-width").slider({
    min: 100, max: 1200, step: 50, value: width, handle: 'square'
}).on('slide', function(ev){
    if (ev.value !== width) {
        $("#canvas").attr('width', ev.value+1);
        $("#canvas").attr('height', height+1);
        width = ev.value;
        drawGrid(width, height, cellSize);
        localStorage.setItem('width', width);
    };

});

$("#cell-size").slider({
    min: 5, max: 100, step: 5, value: cellSize, handle: 'square'
}).on('slide', function(ev){
    if (ev.value !== cellSize) {
        // ctx.clearRect(0,0,canvas.width,canvas.height);
        // // ctx.clearRect(0,0,100,100);
        
        $("#canvas").attr('width', width+1);
        $("#canvas").attr('height', height+1);
        drawGrid(width, height, ev.value);
        cellSize = ev.value;
        localStorage.setItem('cellSize', cellSize);
    }
});

function drawGrid(w, h, size) {

    var nRows = Math.floor(h/size);
    var nColumns = Math.floor(w/size);
    // log(nRows, nColumns);
    w = nColumns * size;
    h = nRows * size;
    for (var i=0; i<= nRows; i++) {
        ctx.moveTo(0+.5,i*size + .5);
        ctx.lineTo(w+.5,i*size+.5);
    }
    for (i=0; i<= nColumns; i++) {
        ctx.moveTo(i*size+.5, 0+.5);
        ctx.lineTo(i*size+.5, h+.5);

    }
    ctx.lineWidth=1;
    ctx.stroke();
    // ctx.endPath();


}
drawGrid(width, height, cellSize);

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
