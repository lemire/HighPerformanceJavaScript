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
    var ms = suite.add('sum over Uint32Array',function() {return sumup(a1);} )
    .add('sum over Array',function() {return sumup(a2);} )
    .add('reduce over Array', function() {return a2.reduce( function(total, num){ return total + num }, 0);})
    .add('sum over Uint32Array (no length)',function() {return sumupnol(a1);} )
    .add('sum over Array (no length)',function() {return sumupnol(a2);} )
    .add('backward sum over Uint32Array',function() {return backsumup(a1);} )
    .add('backward sum over Array',function() {return backsumup(a2);} )
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
