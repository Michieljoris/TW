var move = 'LL1R3'.split('');
var width = 10;
var height = 10;

var rover =  {
    x: 0, y: 0,
    orientation : 0
};

var orientation = [ [0,-1], [1,0], [0,1], [-1, 0]];

var action = {
    R: function(r) {
        r.orientation =  (r.orientation+1)%4;
        return r;
    }
    ,L: function(r) {
        r.orientation =  (r.orientation+3)%4;
        return r;
    },
    move: function(r,n) {
        r.x += n * orientation[r.orientation][0];
        r.y += n * orientation[r.orientation][1];
        //boundary checking
        r.x = Math.min(r.x, width);
        r.y = Math.min(r.x, height);
        r.x = Math.max(r.x, 0);
        r.y = Math.max(r.y, 0);
        return r;
    }
};

var result = move.reduce(
    function(r, a) {
        console.log(r,a);
        if (action[a]) return action[a](r);
        var n = parseInt(a);
        if (isNaN(n)) throw Error('Illegal move!!');
        return action.move(r, n);
    }, rover);

console.log('Rover', rover); 

//multiple rovers
//detect collisions
//write in oop style (typescript, or prototype, yuk)

