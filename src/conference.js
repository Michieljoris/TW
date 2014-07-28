var fs = require('fs-extra');
var util = require('util');

var sessionTypes = [
    { start: { hour: 9, minutes: 0 }, when: 'am', length: 180 , priority: 0 },
    { start: { hour:13, minutes:0 }, when: 'pm', length : 240, priority: 1  }
];

function createSessions(nDays) {
    var sessions = [];
    for (var i=0; i<nDays; i++) {
        sessionTypes.forEach(function(sessionType) {
            var session = Object.create(sessionType);
            session.day = i + 1; session.talks = []; session.free = session.length;
            sessions.push(session);
        });
    }
    return sessions;
}

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

function select(sessions) {
    sessions.sort(function(s1, s2) {
        var onFree =  s1.free < s2.free ? 1 : s1.free > s2.free ? -1 : 0;
        if (onFree) return onFree;
        var onPriority =  s1.priority < s2.priority ? 1 : s1.priority > s2.priority ? -1 : 0;
        return onPriority;
    });
    return sessions[0];
}

function addMinutes(time, minutes) { //time is in hours and minutes, offset in minutes
    return {
        hour: time.hour + Math.floor((time.minutes + minutes)/60),
        minutes : (time.minutes + minutes)%60
    };
}

function format(hours, minutes) {
    return (hours < 10 ? '0' + hours : hours)+ ':' +
        (minutes < 10 ? '0' + minutes : minutes);
}

function print(sessions) {
    var day = 0;
    sessions.forEach(function(session) {
        if (session.day !== day) {
            day = session.day;
            console.log('\ntrack ' + day);   
        }
        var start = session.start;
        var talks = session.talks.map(function(talk) {
            var str = format(start.hour, start.minutes) + session.when+ ' ' + talk.title; 
            start = addMinutes(start, talk.length);
            console.log(str);
            return str;
        });
        if (session.when === 'am') {
            talks.push('12:00pm lunch');   
            console.log(talks[talks.length-1]);
        }
        else {
            var str = format(start.hour, start.minutes) + session.when+ ' ' + 'networking event'; 
            talks.push(str);   
            console.log(talks[talks.length-1]);
        }
        return talks;
    });
}

function assign(sessions, talks) {
    var sessionsCopy = sessions.slice(0);
    talks.forEach(function(talk) {
        var session = select(sessionsCopy);
        session.talks.push(talk);
        session.free -= talk.length;
        if (session.free < 0) throw Error('This isn\'t working...');
    });
}

function compare(c1, c2) {
    // c1.sort
    // console.log(c1, c2, c1===c2);
    return c1 === c2;
    // if (c1 === c2) console.log('bla');
}

function checkForDups(combos) {
    var count = 0;
    combos.forEach(function(c1, i) {
        combos.slice(i).forEach(function(c2) {
            if (compare(c1, c2)) count++;
        });
    });
    console.log(count);
    // console.log(combos);
}

// function getCombos(talks, free, maxFree) {
function getCombos(talks, minLength, maxLength) {
    // var maxFree = free - minLength;
    var free = maxLength;
    
    var combinations = [];
    
    var d = 0;
    function fill(from, combo) {
        d++;
        // if (d>15000) return;
        var end = true;
        for (var i = from; i< talks.length; i++) {
            var talk = talks[i];
            if (free - talk.length >= 0)  {
                talks.splice(i,1);
                end = false;
                free -= talk.length;
                combo.push(talk);
                fill(i, combo);
                combo.pop();
                free += talk.length;
                talks.splice(i,0,talk);
            }
        }
        if (end) {
            // if (free <= maxFree) {
            if (maxLength - free >= minLength) {
                var newCombo = combo.slice(0);
                newCombo.free = free;
                newCombo.talks = talks.slice(0);
                combinations.push(newCombo);   
            }
            // console.log('pushing ', combo, ' ON\n ' , combinations);
        }
    }
    fill(0, []);
    return combinations;
}

function assign2(sessions, talks, maxFree) {
    var schedules = [];
    function recur(s, talks, combos, maxFree) {
        var session = sessions[s];
        // console.log(s, session, talks);
        // if (!session && talks.length) {
        //     console.log("No sessions left to put talks in!!!");
        //     return;
        // }
        if (s === sessions.length-1) {
            var l = talks.reduce(function(p, n) {
                return p + n.length;
            },0);
            if (l > session.length) console.log("Last session is too short!!!");
            var newSchedule = {};
            newSchedule.day = session.day; newSchedule.start = session.start;
            newSchedule.talks = talks; newSchedule.when = session.when;
            // console.log('------------------');
            
            combos.push(newSchedule);
            schedules.push(combos.slice(0));
            // print(combos);
            combos.pop();
            // console.log(util.inspect(combos, {depth: 10, colors:true }));
            // console.log(newSchedule);
            return;
            
            
        }
        var maxSessionLength =  session.free;
        var minSessionLength = session.when === 'am' ? session.free : session.free - maxFree;
        var combinations = getCombos(talks, minSessionLength, maxSessionLength);
        combinations.forEach(function(combo, i) {
            var talks = combo.talks;
            combo.day = session.day; combo.start = session.start;
            combo.talks = combo; combo.when = session.when;
            combos.push(combo);
            recur(s+1, talks || [], combos , maxFree - combo.free);
            combos.pop();
        });
            
    }
    console.log(talks);
    recur(0, talks, [], maxFree); 
    
    // console.log(util.inspect(result, {depth: 10, colors:true }));
    return schedules;
}
    
function process(input, days) {
    var sessions = createSessions(days);
    var talks = input.map(function(line, i) {
        return parse(line);
    }).sort(function(t1, t2) {
        return t1.length < t2.length ? 1 : t1.length > t2.length ? -1 : 0;
    });
    var totalLength = talks.reduce(function(p, n) {
        return p + n.length;
    }, 0);
    var totalAvailable= sessions.reduce(function(p, n) {
        return p + n.length;
    }, 0);
    if (totalLength > totalAvailable)
        throw Error('Not enough time available to slot in the talks!!!',
                    totalLength, totalAvailable);
    var schedules = assign2(sessions, talks, totalAvailable - totalLength);
    schedules.slice(0,2).forEach(function(schedule) {
        print(schedule);
    });
    console.log(schedules.length);
    // print(sessions);
}

// var input = fs.readFileSync('./conference-input.txt', { encoding: 'utf8' }).split('\n');
var input = fs.readFileSync('./test2.txt', { encoding: 'utf8' }).split('\n');
input = input.slice(0, input.length -1).slice(0,16);

process(input, 2);

// * conference
//   file:///home/michieljoris/tmp/tw/tw/solution%20for%20tech%20problems%20%20problem%20statement%20-%20conference%20track%20management.html
//   problem statement - conference track management

// you are planning a big programming conference and have received many
// proposals which have passed the initial screen process but you're having
// trouble fitting them into the time constraints of the day -- there are so
// many possibilities! so you write a program to do it for you.

// · the conference has multiple tracks each of which has a morning and afternoon session.
// · each session contains multiple talks.
// · morning sessions begin at 9am and must finish by 12 noon, for lunch.
// · afternoon sessions begin at 1pm and must finish in time for the networking event.
// · the networking event can start no earlier than 4:00 and no later than 5:00.
// · no talk title has numbers in it.
// · all talk lengths are either in minutes (not hours) or lightning (5 minutes).
// · presenters will be very punctual; there needs to be no gap between sessions.

// note that depending on how you choose to complete this problem, your solution
// may give a different ordering or combination of talks into tracks. this is
// acceptable; you don’t need to exactly duplicate the sample output given here.

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


