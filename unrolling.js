"use strict";
var Benchmark = require('benchmark');
var util = require("./benchmarkutil.js");

function logme(x) {
    console.log(x);
}

var bitwiseor = function(a1, a2) {
    if(a1.length != a2.length) throw "lengths do not match";
    var cl = a1.length;
    for(var i = 0; i < cl ; i++) {
        a1[i] |= a2[i];
    }
};

var bitwiseor2 = function(a1, a2) {
    if(a1.length != a2.length) throw "lengths do not match";
    var cl = a1.length;
    var i = 0;
    for(; i + 1  < cl ; i += 2) {
        a1[i] |= a2[i];
        a1[i+1] |= a2[i+1];
    }
    for(; i < cl ; i++) {
        a1[i] |= a2[i];
    }

};

var bitwiseor4 = function(a1, a2) {
    if(a1.length != a2.length) throw "lengths do not match";
    var cl = a1.length;
    var i = 0;
    for(; i + 3  < cl ; i += 4) {
        a1[i] |= a2[i];
        a1[i+1] |= a2[i+1];
        a1[i+2] |= a2[i+2];
        a1[i+3] |= a2[i+3];
    }
    for(; i < cl ; i++) {
        a1[i] |= a2[i];
    }

};


var bitwiseor8 = function(a1, a2) {
    if(a1.length != a2.length) throw "lengths do not match";
    var cl = a1.length;
    var i = 0;
    for(; i + 7  < cl ; i += 8) {
        a1[i] |= a2[i];
        a1[i+1] |= a2[i+1];
        a1[i+2] |= a2[i+2];
        a1[i+3] |= a2[i+3];
        a1[i+4] |= a2[i+4];
        a1[i+5] |= a2[i+5];
        a1[i+6] |= a2[i+6];
        a1[i+7] |= a2[i+7];
    }
    for(; i < cl ; i++) {
        a1[i] |= a2[i];
    }

};

var bitwiseor16 = function(a1, a2) {
    if(a1.length != a2.length) throw "lengths do not match";
    var cl = a1.length;
    var i = 0;
    for(; i + 15  < cl ; i += 16) {
        a1[i] |= a2[i];
        a1[i+1] |= a2[i+1];
        a1[i+2] |= a2[i+2];
        a1[i+3] |= a2[i+3];
        a1[i+4] |= a2[i+4];
        a1[i+5] |= a2[i+5];
        a1[i+6] |= a2[i+6];
        a1[i+7] |= a2[i+7];
        a1[i+8] |= a2[i+8];
        a1[i+9] |= a2[i+9];
        a1[i+10] |= a2[i+10];
        a1[i+11] |= a2[i+11];
        a1[i+12] |= a2[i+12];
        a1[i+13] |= a2[i+13];
        a1[i+14] |= a2[i+14];
        a1[i+15] |= a2[i+15];
    }
    for(; i < cl ; i++) {
        a1[i] |= a2[i];
    }

};


function Bench() {
    logme("starting benchmark");
    var suite = new Benchmark.Suite();
    var length = 1000;
    var a1 = new Uint32Array(length);
    var a2 = new Uint32Array(length);
    for(var i = 0; i < length; i++) {
        a1[i] = i;
        a2[i] = i + 5;
    }
    var b1 = new Array(length);
    var b2 = new Array(length);
    for(var i = 0; i < length; i++) {
        b1[i] = i;
        b2[i] = i + 5;
    }

    // add tests
    var ms = suite.add('bitwiseor (Uint32Array)',function(){bitwiseor(a1,a2);})
    .add('bitwiseor2 (Uint32Array)',function(){bitwiseor2(a1,a2);})
    .add('bitwiseor4 (Uint32Array)',function(){bitwiseor4(a1,a2);})
    .add('bitwiseor8 (Uint32Array)',function(){bitwiseor8(a1,a2);})
    .add('bitwiseor16 (Uint32Array)',function(){bitwiseor16(a1,a2);})
    .add('bitwiseor (Array)',function(){bitwiseor(b1,b2);})
    .add('bitwiseor2 (Array)',function(){bitwiseor2(b1,b2);})
    // add listeners
    .on('cycle', function(event) {
        logme(String(event.target));
    })
    .on('complete', function() {
        logme('Fastest is ' + this.filter('fastest').pluck('name'));
    })
    // run async
    .run({ 'async': false });
}

var main = function() {
    Bench();
}

if (require.main === module) {
    util.describeme();
    main();
}
