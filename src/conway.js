/*
  Implementation of Conway's game of life.
  Call init with a width, height and some cells.
  Call step to get a list of cells that changed state
  
  Every time a cell changes state its neighbours get updated, These neighbours
  are recorded in a change list. Once all cells have changed stated we end up
  with a list of cells that will need to have their new state calculated. Once
  that is done we actually flip these cells (hereby creating a new list of cells
  that will need to be evaluated) and return the list of the cells that
  actually changed.
  
  When a cell is left dead and neighbourless it is deleted from the system, and
  only recreated when it is needed again. So only cells that are either live, or
  neighbouring cells that are live are getting tracked and remembered from step to step..

  When a cell has changing neighbours, but on balance keeps the same amount of
  live neighbours it is removed from the list of changes before that list gets processed.

 */

var cells;
var changed;
var width, height;

function createCell(x, y) {
    return {
        x: x, y: y,
        state: 0, // settings.state ? 1 : 0,
        nState: 0, 
        nStateOld: 0
    };
}

//Flip cell and update the neighbours of a newly died or born cell and 
function flip(cell) {
    cell.state = 1 - cell.state;
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
            cell.nState += diff;
            if (cell.nState === cell.nStateOld) delete changed[ref];
            else changed[ref] = cell;
        });
}

//B3/S23
var map = {'03':1, '12':1, '13':1 };
function decide(state, next) {
    return map['' + state + next] ? 1 : 0;
}; 

//Calculate new state for every changed cell and return list of cells that are
//actually changing state
function processChanges() {
    var toBeFlipped = [];
    Object.keys(changed).forEach(function(ref) {
        var cell = changed[ref];
        var newState = decide(cell.state, cell.nState);
        cell.nStateOld = cell.nState;
        if (newState !== cell.state)
            toBeFlipped.push(cell);
        if (!cell.state && !cell.nState) delete cells[ref];
    });
    return toBeFlipped;
}

//Moves world one step further and returns list of cells (eg: [[1,2], [2,3]])
//that flipped.
function step() {
    var toBeFlipped = processChanges();
    changed = {};
    toBeFlipped.forEach(function(cell) {
        flip(cell);
    });
    return toBeFlipped.map(function(cell) {
        return { x: cell.x, y: cell.y, state: cell.state };
    });
}

//Initialize world with height, width and some live cells
function init(someWidth, someHeight, someLiveCells) {
    cells = {};
    changed = {};
    width = someWidth;
    height = someHeight;
    someLiveCells.forEach(function(c) {
        var ref = '' + c[0] + c[1];
        var cell = cells[ref] =
            cells[ref] ? cells[ref] : createCell(c[0], c[1]);
        flip(cell);
        changed[ref] = cell;
    });
}

module.exports = {
    init: init,
    step: step
};
