
function arrayify(str) {
    return str ? str.slice('pattern-'.length).split('-').map(function(p) {
        return p.split('.') 
    }): [];
}
console.log(arrayify(''));
