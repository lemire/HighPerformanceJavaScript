"use strict";
var Benchmark = require('benchmark');
var util = require("./benchmarkutil.js");

function logme(x) {
    console.log(x);
}

var sumup = function(array) {
  var answer = 0;
  for (var i = 0; i < array.length; i++) {
    answer = answer + array[i];
  }
  return answer;
}
var typedsumup = function(array) {
  var answer = 0|0;
  var c = array.length |0;
  for (var i = 0|0; i < c; i++) {
    answer += array[i]|0;
  }
  return answer;
}


var sumupof = function(array) {
  var answer = 0;
  for (var i of array) {
    answer += i;
  }
  return answer;
}


var sumupnol = function(array) {
  var answer = 0;
  var ml = array.length
  for (var i = 0; i < ml; i++) {
    answer = answer + array[i];
  }
  return answer;
}


var backsumup = function(array) {
  var answer = 0;
  if(array.length == 0) return answer;
  for(var i = array.length - 1; i !=0 ; i--) {
      answer = answer + array[i];
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
    var ms = suite.add('sum over Uint32Array (typed)',function() {return typedsumup(a1);} )
    .add('sum over Uint32Array',function() {return sumup(a1);} )
    .add('reduce over Uint32Array (required recent v8)', function() {return a1.reduce( function(total, num){ return total + num }, 0);})
    .add('sum over Uint32Array using of ',function() {return sumupof(a1);} )
    .add('sum over Array',function() {return sumup(a2);} )
    .add('reduce over Array', function() {return a2.reduce( function(total, num){ return total + num }, 0);})
    .add('sum over Uint32Array (no length)',function() {return sumupnol(a1);} )
    .add('sum over Array (no length)',function() {return sumupnol(a2);} )
    .add('backward sum over Uint32Array',function() {return backsumup(a1);} )
    .add('backward sum over Array',function() {return backsumup(a2);} )
    .on('setup', function() {
        for(var i = 0; i < length; i++) {
            a1[i] = i;
            a2[i] = i;
        }
    })
    // add listeners
    .on('cycle', function(event) {
        logme(String(event.target));
    })
    .on('complete', function() {
       var tps = this.filter('fastest').pluck('hz')[0];
       var intpers = tps * length / 1000000000.0 ;
       logme('Fastest is ' + this.filter('fastest').pluck('name')+' at '+intpers.toFixed(3)+' billions int. per s');
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
