"use strict";
var Benchmark = require('benchmark');
var util = require("./benchmarkutil.js");

function logme(x) {
    console.log(x);
}

// fast function to compute the Hamming weight of a 32-bit unsigned integer
var hamming_weight = function(v) {
    v -= ((v >> 1) & 0x55555555);
    v = (v & 0x33333333) + ((v >> 2) & 0x33333333);
    return ((v + (v >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
}

var mapreducewithouthinting = function(array, fnc) {
  var answer = 0;
  for (var i = 0; i < array.length; i++) {
    answer = answer + fnc(array[i]);
  }
  return answer;
}

var mapreducewithhinting = function(array, fnc) {
  var answer = 0;
  for (var i = 0; i < array.length; i++) {
    answer = answer + fnc(array[i]|0);
  }
  return answer;
}

function Bench() {
    logme("starting benchmark");
    var suite = new Benchmark.Suite();
    var length = 128;

    var a1 = new Uint32Array(length);
    var a2 = new Array(length);
    // add tests
    var ms = suite.add('mapreduce w hinting Uint32Array',function() {return mapreducewithhinting(a1,hamming_weight);} )
    .add('mapreduce w hinting Array',function() {return mapreducewithhinting(a2,hamming_weight);} )
    .add('mapreduce without hinting Uint32Array',function() {return mapreducewithouthinting(a1,hamming_weight);} )
    .add('mapreduce without hinting Array',function() {return mapreducewithouthinting(a2,hamming_weight);} )
    .on('setup', function() {
        for(i = 0; i < length; i++) {
            a1[i] = i;
            a2[i] = i;
        }
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
