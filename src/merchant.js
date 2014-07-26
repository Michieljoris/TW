var path = require('path');
var fs = require('fs-extra');
require('logthis').config({ _on: true, 'merchant.js': 'debug', 'roman.js': 'debug' });
var log = require('logthis').logger._create(path.basename(__filename));
  
var roman = require('./roman');
  
var definePattern = [ '^\\s*(\\w+)\\s+', 'is', '\\s+([IVXLCDM])\\s*$' ];
var defineRegexp = new RegExp(definePattern.join(''));

var unit, pricePattern, howMuchPattern, howManyPattern;
var definitions = {}, prices = {};

function buildPatterns(units) {
    unit =  '\\s+(' + units.join('|') + ')';
    pricePattern = [ '^\\s*' + '(' + units.join('|') + ')'
                     // '(glob|prok|pish|tegj)',
                     // ,'(\\s+glob|\\s+prok|\\s+pish|\\s+tegj)?'
                     ,'\\s+(\\w+)' ,'\\s+is\\s+' ,'(\\d+)' ,'\\s+Credits\\s*$'
                   ];
    howMuchPattern =  [
        '^\\s*how' + '\\s+much' + '\\s+is' + unit
        // ,'(\\s+glob|\\s+prok|\\s+pish|\\s+tegj)'
    
        // ,'(\\s+glob|\\s+prok|\\s+pish|\\s+tegj)?'
        // ,'(\\s+glob|\\s+prok|\\s+pish|\\s+tegj)?'
        ,'\\s*\\?\\s*' ,'$'
    ];
    howManyPattern =  [
        '^\\s*how' + '\\s+many' + '\\s+Credits' + '\\s+is' + unit
        // ,'(\\s+glob|\\s+prok|\\s+pish|\\s+tegj)'
    
        // ,'(\\s+glob|\\s+prok|\\s+pish|\\s+tegj)?'
        // ,'(\\s+glob|\\s+prok|\\s+pish|\\s+tegj)?'
        ,'\\s+(Silver|Gold|Iron)'
        // ,'\\s*\\?\\s*'
        // ,'$'
    ];
    unit += '?';
}

function wc(line) {
    return line.split(' ').filter(function(e) { return e.length; }).length;;
}

function regExpMatch(pattern, line, x) {
    var units = [];
    var n = wc(line) - x - 1;
    for (var i = 0; i < n; i++)
        units.push(unit);
    pattern = pattern.slice(0,1)
        .concat(units)
        .concat(pattern.slice(1));
    return line.match(new RegExp(pattern.join('')))
}

function convert(units) {
    var romanNumber = units.map(function(u) {
        return definitions[u];
    }).join('');
    return roman.toArabic(romanNumber);
}

var parsers = [
    // glob is I 
    function(line) {
        var match = line.match(defineRegexp);
        if (match) {
            definitions[match[1]] = match[2];   
            buildPatterns(Object.keys(definitions));
            return 'OK';
        }
        return null;
    },
    // glob glob Silver is 34 Credits 
    function(line) {
        var match = regExpMatch(pricePattern, line, 4);
        if (match) {
            var quantity = convert(match.slice(1, match.length -2));
            prices[match[3]] = parseInt(match[4]) / quantity;
            return 'OK';
        }
        return null;
    },
    // how much is pish tegj glob glob ? 
    function(line) {
        var match = regExpMatch(howMuchPattern, line, 4);
        if (match) 
            return match.slice(1).join(' ') + ' is ' + convert(match.slice(1));
        return null;
    },
    //how many Credits is glob prok Silver ? 
    function(line) {
        var match = regExpMatch(howManyPattern, line, 6);
        // glob prok Silver is 68 Credits 
        if (match) {
            var amount = match.slice(1, match.length-1);
            var product = match[match.length-1];
            return  amount.join(' ') + ' ' + product +
                ' is ' + prices[product] * convert(amount) + ' Credits';
        }
        return null;
    }
];

function process(input) {
    return input.map(function(line, i) {
            var result;
        log(line);
        parsers.some(function(parser) {
            result = parser(line);
            return result;
        });
        return result;
    }).filter(function(r) {
        return r !== 'OK';
    }).map(function(r) {
        return r || 'I have no idea what you are talking about';
    });
}

var input = fs.readFileSync('./merchant-input.txt', { encoding: 'utf8' }).split('\n')
input = input.slice(0, input.length -1);

var output = process(input);

log('\n', output);
log('\nDefinitions: \n', definitions);
log('Prices: \n', prices);
// Test input: 
// ------------- 
// glob is I 
// prok is V 
// pish is X 
// tegj is L 
// glob glob Silver is 34 Credits 
// glob prok Gold is 57800 Credits 
// pish pish Iron is 3910 Credits 
// how much is pish tegj glob glob ? 
// how many Credits is glob prok Silver ? 
// how many Credits is glob prok Gold ? 
// how many Credits is glob prok Iron ? 
// how much wood could a woodchuck chuck if a woodchuck could chuck wood ? 

// Test Output: 
// --------------- 
// pish tegj glob glob is 42 
// glob prok Silver is 68 Credits 
// glob prok Gold is 57800 Credits 
// glob prok Iron is 782 Credits 
// I have no idea what you are talking about


  
