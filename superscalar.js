"use strict";
var Benchmark = require('benchmark');
var util = require("./benchmarkutil.js");

function logme(x) {
    console.log(x);
}

var inplacedelta = function(a1) {
    for(var i = a1.length - 1; i !=0 ; i--) {
        a1[i+1] = a1[i+1] - a1[i];
    }
};

var inplaceprefixsum = function(a1) {
    var cl = a1.length;
    for(var i = 0; i + 1 < cl ; i++) {
        a1[i+1] += a1[i];
    }
}

var delta = function(source, output) {
    if(output.length != source.length) throw "lengths do not match";
    var cl = source.length;
    if(cl == 0) return;
    output[0] = source[0];
    for(var i = 1; i < cl ; i++) {
        output[i] = source[i] - source[i - 1];
    }
};

var delta2 = function(source, output) {
    if(output.length != source.length) throw "lengths do not match";
    var cl = source.length;
    if(cl == 0) return;
    output[0] = source[0];
    var i = 1;
    for(; i + 1 < cl ; i+=2) {
        output[i] = source[i] - source[i - 1];
        output[i + 1] = source[i + 1] - source[i];
    }
    for(; i < cl ; i++) {
        output[i] = source[i] - source[i - 1];
    }
};


var delta4 = function(source, output) {
    if(output.length != source.length) throw "lengths do not match";
    var cl = source.length;
    if(cl == 0) return;
    output[0] = source[0];
    var i = 1;
    for(; i + 3 < cl ; i+=4) {
        output[i] = source[i] - source[i - 1];
        output[i + 1] = source[i + 1] - source[i];
        output[i + 2] = source[i + 2] - source[i + 1];
        output[i + 3] = source[i + 3] - source[i + 2];
    }
    for(; i < cl ; i++) {
        output[i] = source[i] - source[i - 1];
    }
};

var delta8 = function(source, output) {
    if(output.length != source.length) throw "lengths do not match";
    var cl = source.length;
    if(cl == 0) return;
    output[0] = source[0];
    var i = 1;
    for(; i + 7 < cl ; i+=8) {
        output[i] = source[i] - source[i - 1];
        output[i + 1] = source[i + 1] - source[i];
        output[i + 2] = source[i + 2] - source[i + 1];
        output[i + 3] = source[i + 3] - source[i + 2];
        output[i + 4] = source[i + 4] - source[i + 3];
        output[i + 5] = source[i + 5] - source[i + 4];
        output[i + 6] = source[i + 6] - source[i + 5];
        output[i + 7] = source[i + 7] - source[i + 6];
    }
    for(; i < cl ; i++) {
        output[i] = source[i] - source[i - 1];
    }
};
var prefixsum = function(source, output) {
    if(output.length != source.length) throw "lengths do not match";
    var cl = source.length;
    if(cl == 0) return;
    output[0] = source[0];
    for(var i = 1; i < cl ; i++) {
        output[i] = output[i - 1] + source[i];
    }
};


var prefixsum2 = function(source, output) {
    if(output.length != source.length) throw "lengths do not match";
    var cl = source.length;
    if(cl == 0) return;
    output[0] = source[0];
    var i = 1;
    for(; i + 1 < cl ; i+=2) {
        output[i + 1] = (output[i] = output[i - 1] + source[i]) + source[i + 1];
    }
    for(; i < cl ; i++) {
        output[i] = output[i - 1] + source[i];
    }
};
var prefixsum4 = function(source, output) {
    if(output.length != source.length) throw "lengths do not match";
    var cl = source.length;
    if(cl == 0) return;
    output[0] = source[0];
    var i = 1;
    for(; i + 3 < cl ; i+=4) {
        output[i + 3] = (output[i + 2] = (output[i + 1] = (output[i] = output[i - 1] + source[i]) + source[i + 1]) + source[i + 2]) + source[i + 3];
    }
    for(; i < cl ; i++) {
        output[i] = output[i - 1] + source[i];
    }
};

var prefixsum8 = function(source, output) {
    if(output.length != source.length) throw "lengths do not match";
    var cl = source.length;
    if(cl == 0) return;
    output[0] = source[0];
    var i = 1;
    for(; i + 7 < cl ; i+=8) {
        output[i + 7] = (output[i + 6] = (output[i + 5] = (output[i + 4] = (output[i + 3] = (output[i + 2] = (output[i + 1] = output[i] + source[i + 1]) + source[i + 2]) + source[i + 3])+ source[i + 4]) + source[i + 5]) + source[i + 6]) + source[i + 7];
    }
    for(; i < cl ; i++) {
        output[i] = output[i - 1] + source[i];
    }
};

function Bench() {
    logme("starting benchmark");
    var suite = new Benchmark.Suite();
    var length = 1000;

    var a1 = new Uint32Array(length);
    var diffa1 = new Uint32Array(length);
    delta(a1,diffa1);
    prefixsum(diffa1,a1);
    for(var i = 0; i < length; i++)
        a1[i] = i;
    delta2(a1,diffa1);
    prefixsum2(diffa1,a1);
    for(var i = 0; i < length; i++)
        if(a1[i] != i) throw "bug";
    // add tests
    var ms = suite.add('delta',function() {
        delta(a1,diffa1);
    })
    .add('delta2',function() {
        delta2(a1,diffa1);
    })
    .add('delta4',function() {
        delta4(a1,diffa1);
    })
    .add('delta8',function() {
        delta8(a1,diffa1);
    })
    .add('prefixsum',function() {
        prefixsum(diffa1,a1);
    })
    .add('prefixsum2',function() {
        prefixsum2(diffa1,a1);
    })
    .add('prefixsum4',function() {
        prefixsum4(diffa1,a1);
    })
    .add('prefixsum8',function() {
        prefixsum8(diffa1,a1);
    })
    .on('setup', function() {
        for(var i = 0; i < length; i++)
            a1[i] = i;
    })
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
