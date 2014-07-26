/*
  Implementation of MERCHANT'S GUIDE TO THE GALAXY.
  
  * Spaces can be multiple before and after words.
  * No hardcoding of any of the terms of the input, just the structure of the
  * phrases.
  * Easily extensible by adding parsers to the parsers object, and accompanying
  * regular expression patterns for the phrases.
  * Not tested rigorously, but should catch quite a bit of nonsense input.
  
*/

var path = require('path');
var fs = require('fs-extra');
require('logthis').config({ _on: true, 'merchant.js': 'debug', 'roman.js': 'debug' });
var log = require('logthis').logger._create(path.basename(__filename));
  
var roman = require('./roman');

var unit, pricePattern, howMuchPattern, howManyPattern;
var definitions = {}, prices = {};
  
var definePattern = [ '^\\s*(\\w+)\\s+', 'is', '\\s+([IVXLCDM])\\s*$' ];
var defineRegexp = new RegExp(definePattern.join(''));

function buildPatterns() {
    var units = Object.keys(definitions);
    unit =  '\\s+(' + units.join('|') + ')';
    pricePattern = [ '^\\s*' + '(' + units.join('|') + ')'
                     ,'\\s+(\\w+)' ,'\\s+is\\s+' ,'(\\d+)' ,'\\s+Credits\\s*$'
                   ];
    howMuchPattern =  [
        '^\\s*how' + '\\s+much' + '\\s+is' + unit
        ,'\\s*\\?\\s*' ,'$'
    ];
    howManyPattern =  [
        '^\\s*how' + '\\s+many' + '\\s+Credits' + '\\s+is' + unit
        ,'\\s+(' + Object.keys(prices).join('|') + ')'
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
            buildPatterns();
            return 'OK';
        }
        return null;
    },
    // glob glob Silver is 34 Credits 
    function(line) {
        if (!Object.keys(definitions).length) return null;
        var match = regExpMatch(pricePattern, line, 4);
        if (match) {
            var quantity = convert(match.slice(1, match.length -2));
            if (quantity < 0) return null;
            prices[match[3]] = parseInt(match[4]) / quantity;
            buildPatterns();
            return 'OK';
        }
        return null;
    },
    // how much is pish tegj glob glob ? 
    function(line) {
        if (!Object.keys(definitions).length) return null;
        var match = regExpMatch(howMuchPattern, line, 4);
        if (match)  {
            var quantity = convert(match.slice(1));
            if (quantity < 0) return null;
            return match.slice(1).join(' ') + ' is ' + convert(match.slice(1));
        }
        return null;
    },
    //how many Credits is glob prok Silver ? 
    function(line) {
        if (!Object.keys(definitions).length ||
            !Object.keys(prices).length) return null;
        var match = regExpMatch(howManyPattern, line, 6);
        if (match) {
            var amount = match.slice(1, match.length-1);
            if (amount < 0) return null;
            var product = match[match.length-1];
            return  amount.join(' ') + ' ' + product +
                ' is ' + prices[product] * convert(amount) + ' Credits';
        }
        return null;
    }
];

function process(input) {
    buildPatterns();
    return input.map(function(line, i) {
            var result;
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
