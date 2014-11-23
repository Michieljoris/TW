var conway = require('./conway.js');

function start(w, h, liveCells) {
    var grid = createGrid(w, h);

    conway.init( w, h, liveCells);
    liveCells.forEach(function(cell) {
        grid[cell[1]][cell[0]] = 1;
    });
    console.log(grid);
    
    var changed = conway.step();
    // console.log('Stepped ', changed);
    changed.forEach(function(cell) {
        grid[cell.y][cell.x] = cell.state;
    });
    console.log(grid);
    // console.log('changed:\n ', Object.keys(changed));
  
    changed = conway.step();
    // console.log('Stepped ', changed);
    changed.forEach(function(cell) {
        grid[cell.y][cell.x] = cell.state;
    });
    console.log(grid);
    // console.log('changed:\n ', Object.keys(changed));
    
}

var liveCells = [
    [ 0,1 ], [ 1,0], [2,1],[0,2], [1,2]
    // [ 1,1 ], [ 1,2], [2,1],[2,2]
    // [ 2,1 ], [ 3, 1], [4,1],
    // [ 1,2 ], [ 2, 2], [3,2]
    // [ 1,1 ], [ 2, 1], [1,2], [2,2]
    // [ 1,1 ], [1,2]
];

start(8, 8, liveCells);

//utils  
var printInPlace = (function() {
    var backSpace = '';
    return function(str) {
        process.stdout.write(backSpace) ;
        process.stdout.write(str) ;
        backSpace = '';
        for (var j=0; j < str.length; j++) {
            backSpace += '\b';
        };
    };
    
})();

function createGrid(w, h) {
    var g = [];
    for (var i = 0; i < h; i++) {
        g[i] = [];
        for (var j = 0; j < w; j++) {
            g[i][j] = 0;
        }
    }
    return g;
}

