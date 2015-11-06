"use strict";
var Benchmark = require('benchmark');
var util = require("./benchmarkutil.js");

function logme(x) {
    console.log(x);
}


// fast function to compute the Hamming weight of a 32-bit unsigned integer
var hammingWeight = function(v) {
  v -= ((v >>> 1) & 0x55555555);// works with signed or unsigned shifts
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  return ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
};

// fast function to compute the Hamming weight of a 32-bit unsigned integer
var hammingWeight2 = function(v1,v2) {
  v1 -= ((v1 >>> 1) & 0x55555555);// works with signed or unsigned shifts
  v2 -= ((v2 >>> 1) & 0x55555555);// works with signed or unsigned shifts
  v1 = (v1 & 0x33333333) + ((v1 >>> 2) & 0x33333333);
  v2 = (v2 & 0x33333333) + ((v2 >>> 2) & 0x33333333);

  return ( ( (v1 + (v1 >>> 4) & 0xF0F0F0F) + (v2 + (v2 >>> 4) & 0xF0F0F0F)) * 0x1010101) >>> 24;
};



// fast function to compute the Hamming weight of a 32-bit unsigned integer
var hammingWeight4 = function(v1,v2,v3,v4) {
  v1 -= ((v1 >>> 1) & 0x55555555);// works with signed or unsigned shifts
  v2 -= ((v2 >>> 1) & 0x55555555);// works with signed or unsigned shifts
  v3 -= ((v3 >>> 1) & 0x55555555);// works with signed or unsigned shifts
  v4 -= ((v4 >>> 1) & 0x55555555);// works with signed or unsigned shifts

  v1 = (v1 & 0x33333333) + ((v1 >>> 2) & 0x33333333);
  v2 = (v2 & 0x33333333) + ((v2 >>> 2) & 0x33333333);
  v3 = (v3 & 0x33333333) + ((v3 >>> 2) & 0x33333333);
  v4 = (v4 & 0x33333333) + ((v4 >>> 2) & 0x33333333);

  v1 = v1 + (v1 >>> 4) & 0xF0F0F0F;
  v2 = v2 + (v2 >>> 4) & 0xF0F0F0F;
  v3 = v3 + (v3 >>> 4) & 0xF0F0F0F;
  v4 = v4 + (v4 >>> 4) & 0xF0F0F0F;
  return (( (v1 + v2+v3 + v4) * 0x1010101) >>> 24);
};



// How many values stored in the set? How many set bits?
var size = function(w) {
  var answer = 0;
  var c = w.length;
  for (var i = 0; i < c; i++) {
    answer += hammingWeight(w[i]);
  }
  return answer;
};
// How many values stored in the set? How many set bits?
var size2 = function(w) {
  var answer = 0;
  var c = w.length;
  var i = 0;
  for (; i < c; i+=2) {
    answer += hammingWeight2(w[i],w[i+1]);
  }
  for (; i < c; i++) {
    answer += hammingWeight(w[i]);
  }
  return answer;
};

// How many values stored in the set? How many set bits?
var size4 = function(w) {
  var answer = 0;
  var c = w.length;
  var i = 0;
  for (; i + 3 < c; i+=4) {
    answer += hammingWeight4(w[i],w[i+1],w[i+2],w[i+3]);
  }
  for (; i + 1 < c; i+=2) {
    answer += hammingWeight2(w[i],w[i+1]);
  }
  for (; i < c; i++) {
    answer += hammingWeight(w[i]);
  }
  return answer;
};
function Bench() {
    logme("starting benchmark");
    var suite = new Benchmark.Suite();
    var length = 2048;

    var a1 = new Uint32Array(length);
    for(var i = 0; i < length; i++)
            a1[i] = Math.floor((Math.random() * 0xFFFFFFFF) + 1);
    for(var i = 0; i < length  - 4; i++) {
      var x1 = hammingWeight(a1[i])+hammingWeight(a1[i+1])+ hammingWeight(a1[i+2])+hammingWeight(a1[i+3]);
      var x2 = hammingWeight2(a1[i],a1[i+1])+ hammingWeight2(a1[i+2],a1[i+3]);
      var x4 = hammingWeight4(a1[i],a1[i+1],a1[i+2],a1[i+3]);
      if(x1 != x2) {
        console.log("bug2");
        return;
      }
      if(x1 != x4) {
        console.log("bug4 "+x1+" "+x2+" "+x4+" "+a1[i]+" "+a1[i+1]+" "+a1[i+2]+" "+a1[i+3]);
        return;
      }
    }

    // add tests
    var ms = suite    .add('size4',function() {
            size4(a1);
        }).add('size2',function() {
            size2(a1);
        })
    .add('size',function() {
        size(a1);
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
