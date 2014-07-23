var cells;
var changed;
var width, height;


function createCell(x, y) {
    return {
        x: x, y: y,
        state: 0, // settings.state ? 1 : 0,
        nStateNext: 0, 
        nState: 0
    };
}

function changeNeighbourStates(cell) {
    var diff = cell.state ? 1 : -1;
    var x = cell.x, y = cell.y;
    var left = (x - 1 + width)%width;
    var right = (x + 1)%width;
    var above = (y - 1 + height)%height;
    var below = (y + 1)%height;
    
    [[left,above],[x,above],[right,above],
     [left,y],[ right,y],
     [left,below],[x,below],[right,below]]
        .forEach(function(e, i) {
            var ref = '' + e[0] + e[1];
            var cell = cells[ref];
            if (!cell) {
                cell = cells[ref] =
                    createCell(e[0], e[1]);
            }
            cell.nStateNext += diff;
            if (cell.nStateNext === cell.nState) delete changed[ref];
            else changed[ref] = cell;
        });
}

//B3/S23
var map = {'03':1, '12':1, '13':1 };
function decide(state, next) {
    return map['' + state + next] ? 1 : 0;
}; 

function calcNextState() {
    var toBeChanged = [];
    Object.keys(changed).forEach(function(ref) {
        var cell = changed[ref];
        var newState = decide(cell.state, cell.nStateNext);
        cell.nState = cell.nStateNext;
        if (newState !== cell.state)
            toBeChanged.push(cell);
        if (!cell.state && !cell.nState) delete cells[ref];
    });
    return toBeChanged;
}

//initialize world with height, width and some live cells
function init(someWidth, someHeight, someLiveCells) {
    cells = {};
    changed = {};
    width = someWidth;
    height = someHeight;
    var liveCells = [];
    someLiveCells.forEach(function(c) {
        var ref = '' + c[0] + c[1];
        var cell = cells[ref] =
            cells[ref] ? cells[ref] : createCell(c[0], c[1]);
        cell.state = 1;
        liveCells.push(cell);
        changeNeighbourStates(cell);
        changed[ref] = cell;
    });
    liveCells.forEach(function(cell) {
        // cell.nState = cell.nStateNext;
    });
}


//moves world one step further and returns list of cells (eg: [[1,2], [2,3]])
//that flipped.
function step() {
    var toBeChanged = calcNextState();
    
    
}

module.exports = {
    init: init,
    step: step
};


function start(w, h, liveCells) {
    var grid = createGrid(w, h);

    init( w, h, liveCells);
    console.log('cells:\n ', cells);
    printGrid(grid, cells);

    // console.log('cells:\n ', cells);
    console.log('changed:\n ', Object.keys(changed));
    var toBeChanged = calcNextState();
    console.log('To be changed:\n', toBeChanged);
    
    printGrid(grid);

    
}

var liveCells = [
    // [ 1,1 ], [ 2, 1], [1,2], [2,2]
    [ 1,1 ], [1,2]
];

start(8, 8, liveCells);

// console.log(changed);

// function getLiveCells(grid) {
//     return grid.reduce(function(a, row) {
//         var cellsInRow = row.reduce(function(a, cell) {
//             return cell + a; }, 0);
//         return cellsInRow + a;
//     }, 0);
// }
// var grid = [[ 0,1,1,1], [0,1,1]];

// var result = getLiveCells(grid);
// console.log('Result: ', result);

// var b = 4;
// console.log(b&3);


  
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

function printGrid(grid) {
    Object.keys(cells).forEach(function(key) {
        var cell = cells[key];
        grid[cell.x][cell.y] = cell.state;
        
    });
    console.log(grid);
    
}
