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
  for(var i = a1.length - 1; i !=0 ; i--) {
      a1[i+1] = a1[i+1] - a1[i];
  }

//    for(var i = 1; i < a1.length; i++)
//        a1[i] = a1[i] + a1[i-1];
};


function Bench() {
    logme("starting benchmark");
    var suite = new Benchmark.Suite();
    var length = 1024;

    var a1 = new Uint32Array(length);
inplaceprefixsum(a1);
    // add tests
    var ms = suite.add('delta',function(){return inplacedelta(a1);})
             .add('prefixsum',function(){ return inplaceprefixsum(a1);})
    .on('setup', function() {
        for(i = 0; i < length; i++)
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
    .run({ 'async': true });
}

var main = function() {
    Bench();
}

if (require.main === module) {
    util.describeme();
    main();
}
