var path = require('path');
require('logthis').config({ _on: true, 'test-roman.js': 'debug', 'roman.js': 'debug' });
var log = require('logthis').logger._create(path.basename(__filename));
  
var roman = require('./roman.js');
  
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

  
function wc(line) {
    return line.split(' ').filter(function(e) { return e.length; }).length;;
}
log(wc(' bla   two') );
  
// test
for (var i=1; i< 4000; i++) {
    var str = roman.toRoman(i);
    printInPlace(i + ' = ' + str);
    var n = roman.toArabic(str);
    if (n < 0 || i !== n) console.log('Oops, ', n);
    
}
