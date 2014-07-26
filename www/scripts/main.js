
console.log('Hello from a node module');
var log = logthis._create('default');
logthis.default._enable(); //comment out when finished.
//don't forget to execute logthis._on() in the browser for logging output

var conway = require('./conway.js');

var width = parseInt(localStorage.getItem('width') || "600"),
    height = parseInt(localStorage.getItem('height') || "300"),
    cellSize = parseInt(localStorage.getItem('cellSize') || "20"),
    startPattern = localStorage.getItem('startPattern') || '',
    gridOn = localStorage.getItem("gridOn"),
    cells = {};

if (gridOn) {
    log('GRIDON??', gridOn);
    $("#grid-on").addClass('active');
    $("#grid-off").removeClass('active');
}
else {
    $("#grid-off").addClass('active');
    $("#grid-on").removeClass('active');
}

log('hello');

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


var buttonClick = $("button").asEventStream("click");
buttonClick.onValue(function(ev) {
    var button = ev.target.id;
    if (handler[button]) handler[button]();
    else log('No button with this name ', button);
});

// var cliks = $("#canvas").asEventStream("click");
// cliks.onValue(function(ev) {
//     var x = Math.floor(ev.offsetX/cellSize);
//     var y = Math.floor(ev.offsetY/cellSize);
//     flip([[x,y]]);
// });

var dragover = $("#canvas").asEventStream("mousemove");
var lastEvent;
var flipped = {};
var writeMode;
dragover.onValue(function(ev) {
    if (!ev.which) return;
    var x = Math.floor(ev.offsetX/cellSize);
    var y = Math.floor(ev.offsetY/cellSize);
    var event = x + '.' + y;
    if (flipped[event]) return;
    flipped[event] = true;
    if (event === lastEvent) return;
    lastEvent = event;
    if (writeMode) delete cells[event];
    else cells[event] = [x,y];
    flip([[x,y]]);
});

var mouseUp = $("#canvas").asEventStream("mouseup");
mouseUp.onValue(function(ev) {
    log ('mouseup');
    flipped = {};
    redraw();
});

var mouseDown = $("#canvas").asEventStream("mousedown");
mouseDown.onValue(function(ev) {
    log ('mousedown');
    var x = Math.floor(ev.offsetX/cellSize);
    var y = Math.floor(ev.offsetY/cellSize);
    var event = x + '.' + y;
    flip([[x,y]]);
    flipped[event] = true;
    // if (Object.keys(flipped).length === 0) {
    writeMode = cells[event] ? 1 : 0;
    // }
});


$("#grid-size-height").slider({
    orientation: 'vertical', min: 100, max: 1200, step: 10, value: height, handle: 'square'
}).on('slide', function(ev){
    if (ev.value !== height) {
        height = ev.value;
        initGrid();
        redraw();
        localStorage.setItem('height', height);
    };
});

$("#grid-size-width").slider({
    min: 100, max: 1200, step: 10, value: width, handle: 'square'
}).on('slide', function(ev){
    if (ev.value !== width) {
        width = ev.value;
        initGrid();
        redraw();
        localStorage.setItem('width', width);
    };
});

$("#cell-size").slider({
    min: 5, max: 100, step: 5, value: cellSize, handle: 'square'
}).on('slide', function(ev){
    if (ev.value !== cellSize) {
        cellSize = ev.value;
        initGrid();
        redraw();
        localStorage.setItem('cellSize', cellSize);
    }
});

var extraCells = {};
var maxCellsX, maxCellsY;
//after changing grid size
function redraw() {
    // log('in redraw');
    maxCellsX = Math.floor(width/cellSize);
    maxCellsY = Math.floor(height/cellSize);
    Object.keys(extraCells).forEach(function(k) {
        if (extraCells[k][0] < maxCellsX && extraCells[k][1] < maxCellsY) {
            cells[k] = extraCells[k];
            delete extraCells[k];
        }
        
    });
    
    var list = Object.keys(cells)
        .filter(function(k) {
            if (cells[k][0] >= maxCellsX || cells[k][1] >= maxCellsY) {
                extraCells[k] = cells[k];
                return false;
            }
            return true;
        })
        .map(function(k) {
            return [ cells[k][0], cells[k][1] ];
        });
    cells = {};
    flip(list);
    conway.init(maxCellsX, maxCellsY, list);
}

function arrayify(str) {
    return str ? str.slice('pattern-'.length).split('-').map(function(p) {
        return  p.split('.').map(function(c) {
            return parseInt(c);
        });
        
    }): [];
}

function recall(next) {
    var patterns = Object.keys(localStorage).filter(function(p) {
        return p.indexOf('pattern-') === 0;
    });
    var index = patterns.indexOf(startPattern) || 0;
    startPattern = patterns[(next(index) + patterns.length) % patterns.length];
    
    localStorage.setItem(startPattern, 1);
    localStorage.setItem('startPattern', startPattern);
    cells = {};
    extraCells = {};
    initGrid(startPattern);
    
}


function flip(a) {
    // var maxCellsX = Math.floor(width/cellSize);
    // var maxCellsY = Math.floor(height/cellSize);
    // log('MAX::', maxCellsX, maxCellsY);
    // var list = Object.keys(cells)
    //     .filter(function(k) {
    //         return cells[k][0] < maxCellsX && cells[k][1] < maxCellsY;
    //     }).map(function(k) {
    //         return [ cells[k][0], cells[k][1] ];
    //     });
    a.forEach(function(cell) {
        var x = cell[0], y = cell[1];
        var ref = x + '.' + y;
        if (cells[ref]) {
            delete cells[ref];   
            ctx.clearRect(x * cellSize+1, y * cellSize+1, cellSize-1, cellSize-1);
        }
        else {
            cells[ref] = [x,y] ;   
            // ctx.fillStyle = "#009900";
            ctx.fillStyle = "rgb(" + (color/300)%300 +  "," + (color++/200)%200 + " ,200)";
            // log(color);
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    });
    // log(cells);
}
var color = 1;

function drawGrid(w, h, size) {
    if (!gridOn) return;

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

function click() {
    var changes = conway.step();
    if (changes.length === 0) {
        var state = $("#start").html();
        if (state === 'Stop')  {
            handler.start();
            // interval = -1;
        } 
        return;
    }
    var list = changes.map(function(change) {
        return [change.x, change.y];
    });
    // log('conway.step',list);
    flip(list);
}


var interval;
var totalSeconds = 0;
var step = 0;
var seconds;
var handler = {
    start: function() {
        var state = $("#start").html();
        if (state === 'Go')  {
            if (interval < 0) handler.reset();
            $("#start").html('Stop');
            if (step === 0) {
                var str = Object.keys(cells).join('-');
                startPattern = 'pattern-' + str;
            }
            // $("#step").attr('disabled', 'disabled');
            var startTime = new Date().getTime();;
            seconds = 0;
            
            // var speed = 60;
            interval = setInterval(function() {
                // while (step%speed < speed-1) {
                //     step++;
                //     click();
                // }
                step++;
                var now = new Date().getTime();
                seconds = (now - startTime)/1000;
                // var elapsed = seconds%60 + ':' + Math.floor(seconds/60);
                $("#steps-total").html(step);
                $("#steps-second").html(Math.floor(step/(seconds +totalSeconds)));
                click(); 
                
            }, 0);
        }
        else {
            // log(seconds);
            totalSeconds += seconds;
            // log('total seconds: ', seconds);
            clearInterval(interval);
            $("#start").html('Go');   
            // $("#step").removeAttr('disabled');
        }
        
    }
    ,step: function() {
        var state = $("#start").html();
        if (state === 'Stop')  {
            handler.start();
        } 
        click();
    }
    
    ,recallPrev: function() {
        recall(function(i) { return i-1; });
    }
    ,recallNext: function() {
        recall(function(i) { return i+1; });
    }
    ,clear: function() {
        clearInterval(interval);
        cells = {};
        extraCells = {};
        initGrid();
        totalSeconds = 0;
        step = 0;
        $("#steps-total").html('-');
        $("#steps-second").html('-');
        $("#start").html('Go');   
        $("#step").removeAttr('disabled');
    }
    ,delete: function() {
        localStorage.removeItem(startPattern);
        handler.recallNext();
    }
    ,reset: function() {
        clearInterval(interval);
        cells = {};
        extraCells = {};
        initGrid(startPattern);
        totalSeconds = 0;
        step = 0;
        $("#steps-total").html('-');
        $("#steps-second").html('-');
        $("#start").html('Go');   
        $("#step").removeAttr('disabled');
    }
    ,save: function() {
        var str = Object.keys(cells).join('-');
        startPattern = 'pattern-' + str;
        localStorage.setItem(startPattern, 1);
        localStorage.setItem('startPattern', startPattern);
        $("#save").html('Saved!');
        setTimeout(function() {
            $("#save").html('Save');
        }, 2000);
        
    }
    ,export: function() {
        $("#export").removeClass('hide');
        $("#main").addClass('hide');
        console.log('Cells:', cells);
        var list = Object.keys(cells).map(function(k, i) {
            var newLine = (i+1)%10  === 0 ? '<br>' : '';
            return newLine + '[' + cells[k][0] +',' + cells[k][1] + ']';
        }).join(','); 
        list = '[ ' + list + ' ];';
        $("#export").html("//Please refresh the browser to get back to the app<br>" +
                          "var cells = " + list.toString());
    }
    
    ,"grid-on": function() {
        // log("grid on");
        localStorage.setItem('gridOn', 1);
        $("#grid-on").addClass('active');
        $("#grid-off").removeClass('active');
        gridOn = true;
        initGrid();
        redraw();
    }
    ,"grid-off": function() {
        // log("grid off");
        localStorage.removeItem('gridOn');
        $("#grid-off").addClass('active');
        $("#grid-on").removeClass('active');
        gridOn = false;
        initGrid();
        redraw();
    }
};

function initGrid(pattern) {
    // log('initGrid');
    $("#canvas").attr('width', width+1);
    $("#canvas").attr('height', height+1);
    drawGrid(width, height, cellSize);
    if (pattern) {
        cells = arrayify(startPattern || '');
        // log('cells: ', cells);
        redraw();
    }
    
}

initGrid(startPattern);


//  // ctx.fillStyle = "rgb(200,0,0)";
// ctx.strokeRect (10, 10, 55, 50);

// // ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
// ctx.strokeRect(30, 30, 55, 50);



// var inc = function(n) {
//     return n+1;
// };

// mori.into_array(mori.map(inc, mori.vector(1,2,3,4,5)));
// // => [2,3,4,5,6]
