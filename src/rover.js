/*
  Functional solution to mars rover problem.
   * input checking (illegal moves, orientation, off grid)
   * boundary checking
   * each rover can be on its own grid
   * each rover can have its own set of commands 
   * a number n in the command sequence executes n times 'M'.
   * easily extendable, for instance rovers could jump, or move diagonally
   * collision checking if on the same grid
*/


var assert = require('assert');

function createGrid(w,h) {
    var g = [];
    for (var i = 0; i < h; i++) g[i] = [];
    g.height = h; g.width = w;
    return g;
}

function createRover(r) {
    if (r.orientation === -1)
        throw Error("Illegal orientation for rover " + r.id);
    if (r.x >= r.grid.width || r.y >= r.grid.height)
        throw Error("Rover " + r.id + " is not on the grid!!");
    r.grid[r.x][r.y] = r;
    return {
        x: r.x, y: r.y,
        orientation: compass.indexOf(r.orientation),
        grid: r.grid,
        commands: r.commands
    };
}

var compass = 'NESW';

var vector = [ [0,1], [1,0], [0,-1], [-1, 0]];

function prettyPrint(r) {
    return '(' + r.x + ',' + r.y + ') ' + compass[r.orientation]; 
};

var exampleCommands = {
    R: function(r) {
        r.orientation =  (r.orientation+1)%4;
        return r;
    },
    L: function(r) {
        r.orientation =  (r.orientation+3)%4;
        return r;
    },
    M: function(r) {
        var newX = r.x, newY = r.y;
        newX +=  vector[r.orientation][0];
        newY +=  vector[r.orientation][1];
        //boundary checking
        newX = Math.min(newX, r.grid.width);
        newY = Math.min(newY, r.grid.height);
        newX = Math.max(newX, 0);
        newY = Math.max(newY, 0);
        //collision checking
        if (!r.grid[newX][newY]) {
            delete r.grid[r.x][r.y];
            r.x = newX; r.y = newY;
            r.grid[r.x][r.y] = r;
        }
        else if (newY !== r.y || newX !== r.x)
            console.log('Oops, rover ' + r.id + ' has bumped into ' + r.grid[newX][newY].id);
        return r;
    },
    move: function(r,n) {
        var rover;
        for (var i = 0; i < n; i++)
            rover = exampleCommands.M(r);    
        return rover;
    }
};

function execute(rovers, rover, move) {
    return move.reduce(
        function(r, a) {
            console.log('Applying ' + a + ' to ' , prettyPrint(r));
            if (r.commands[a]) return r.commands[a](r);
            var n = parseInt(a);
            if (isNaN(n)) throw Error('Illegal move!!');
            return r.commands.move(r, n);
        }, rover);
}

function test() {
    var grid = createGrid(10,10);

    var commands1 = 'LMLMLMLMM'.split('');
    var commands2 = 'MMRMMRMRRM'.split('');
    
    var i = 0;
    var rovers = [
        { x: 1, y: 2, orientation : 'N' , grid: grid, commands: exampleCommands }, 
        { x: 3, y: 3, orientation : 'E', grid: grid, commands: exampleCommands }
    ].map(function(r) { r.id = i++; return r; }).map(createRover);

    console.log('Rover', prettyPrint(execute(rovers, rovers[0], commands1))); 
    console.log('Rover', prettyPrint(execute(rovers, rovers[1], commands2)));

    function info(r) {
        return { x: r.x, y: r.y, orientation: compass[r.orientation] };
    }

    assert.deepEqual(info(rovers[0]), { x:1, y:3, orientation: 'N' } );
    assert.deepEqual(info(rovers[1]), { x:5, y:1, orientation: 'E' } );
    
}

test();


//TODO write in oop style (typescript, or using prototype, yuck)
