var fs = require('fs-extra');

function parse(line) {
    var words = line.split(' ').filter(function(w) {
        return w.length;
    });
    var length = words[words.length-1];
    return {
        title: line,
        length: length === 'lightning' ? 5  :
            parseInt(length.slice(0, length.length -3))
    };
}
    
function process(input) {
    var talks = input.map(function(line, i) {
        return parse(line);
    }).sort(function(t1, t2) {
        return t1.length < t2.length ? 1 : t1.length > t2.length ? -1 : 0;
    });
}
                     
var input = fs.readFileSync('./conference-input.txt', { encoding: 'utf8' }).split('\n');

input = input.slice(0, input.length -1);

var output = process(input);

console.log('\n', output);


// * conference
//   file:///home/michieljoris/tmp/tw/tw/solution%20for%20tech%20problems%20%20problem%20statement%20-%20conference%20track%20management.html
//   problem statement - conference track management

// you are planning a big programming conference and have received many proposals which have passed the initial screen process but you're having trouble fitting them into the time constraints of the day -- there are so many possibilities! so you write a program to do it for you.

// · the conference has multiple tracks each of which has a morning and afternoon session.
// · each session contains multiple talks.
// · morning sessions begin at 9am and must finish by 12 noon, for lunch.
// · afternoon sessions begin at 1pm and must finish in time for the networking event.
// · the networking event can start no earlier than 4:00 and no later than 5:00.
// · no talk title has numbers in it.
// · all talk lengths are either in minutes (not hours) or lightning (5 minutes).
// · presenters will be very punctual; there needs to be no gap between sessions.

// note that depending on how you choose to complete this problem, your solution may give a different ordering or combination of talks into tracks. this is acceptable; you don’t need to exactly duplicate the sample output given here.

// test input :-
// ------------

// writing fast tests against enterprise rails 60min
// overdoing it in python 45min
// lua for the masses 30min
// ruby errors from mismatched gem versions 45min
// common ruby errors 45min
// rails for python developers lightning
// communicating over distance 60min
// accounting-driven development 45min
// woah 30min
// sit down and write 30min
// pair programming vs noise 45min
// rails magic 60min
// ruby on rails: why we should move on 60min
// clojure ate scala (on my project) 45min
// programming in the boondocks of seattle 30min
// ruby vs. clojure for back-end development 30min
// ruby on rails legacy app maintenance 60min
// a world without hackernews 30min
// user interface css in rails apps 30min

// test output :-
// -------------

// track 1:
// 09:00am writing fast tests against enterprise rails 60min
// 10:00am communicating over distance 60min
// 11:00am rails magic 60min
// 12:00pm lunch
// 01:00pm ruby on rails: why we should move on 60min
// 02:00pm common ruby errors 45min
// 02:45pm accounting-driven development 45min
// 03:30pm pair programming vs noise 45min
// 04:15pm user interface css in rails apps 30min
// 04:45pm rails for python developers lightning
// 04:50pm networking event

// track 2:
// 09:00am ruby on rails legacy app maintenance 60min
// 10:00am overdoing it in python 45min
// 10:45am ruby errors from mismatched gem versions 45min
// 11:30am lua for the masses 30min
// 12:00pm lunch
// 01:00pm clojure ate scala (on my project) 45min
// 01:45pm woah 30min
// 02:15pm sit down and write 30min
// 02:45pm programming in the boondocks of seattle 30min
// 03:15pm ruby vs. clojure for back-end development 30min
// 03:45pm a world without hackernews 30min
// 04:15pm networking event


