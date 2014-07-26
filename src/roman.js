var path = require('path');
var log = require('logthis').logger._create(path.basename(__filename));

var regexpParts = [
    "^(M{0,3})",
    "(", "CD",  "|", "CM", "|", "C{1,3}", "|", "DC{0,3}", ")?",
    "(", "XL",  "|", "XC", "|", "X{1,3}", "|", "LX{0,3}", ")?",
    "(", "IV",  "|", "IX", "|", "I{1,3}", "|", "VI{0,3}", ")?$"
];

var pattern = {
    _:0, I:1, II:2, III:3, IV:4, V:5, VI:6, VII:7, VIII:8, IX: 9,
    __:0, X:1, XX:2, XXX:3, XL:4, L:5, LX:6, LXX:7, LXXX:8, XC: 9,
    ___:0, C:1, CC:2, CCC:3, CD:4, D:5, DC:6, DCC:7, DCCC:8, CM: 9,
    ____:0, M:1, MM:2, MMM:3
    
};

var regexp = new RegExp(regexpParts.join('')) ;

var lookup = Object.keys(pattern);
  
function toArabic(str) {
    var parts = str.match(regexp);
    if (!parts) {
        log._e('Not a roman numeral: ' + str);   
        return -1;
    }
    parts = parts.slice(1,5)
        .map(function(p) {
            return typeof p === "undefined" ? '_' : p;
        });
    return parts[0].length* 1000 +
        pattern[parts[1]] * 100 + 
        pattern[parts[2]] * 10 + 
        pattern[parts[3]];
}

function toRoman(number) {
    if (number === 0 || number > 3999) {
        log._e('Can\'t translate:' + number);
        return '';
    }
    var str = number + '';
    var padding = [ '000', '00', '0', ''];
    str =  padding[str.length-1] + str;
    var result =
        lookup[30 + parseInt(str[0])] +
        lookup[20 + parseInt(str[1])] +
        lookup[10 + parseInt(str[2])] +
        lookup[str[3]];
    result = result.replace(/_/g, '');
    return result;
}

module.exports = {
    toRoman: toRoman,
    toArabic: toArabic
};

