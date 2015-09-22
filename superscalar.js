var Benchmark = require('benchmark');
function logme(x) {
    console.log(x);
}

function Bench() {
    logme("starting benchmark");
    var suite = new Benchmark.Suite();
    var length = 1024;

    var a1 = new Uint32Array(length);
    var deltaf = function() {
        for(var i = 1; i < length; i++) {
            a1[i - 1] = a1[i] - a1[i - 1];
        }
    };
    var pfs = function(init) {
			  for(var i = 1; i < length; i++)
            a1[i] = a1[i] + a1[i-1];
    };
    // add tests
    var ms = suite.add('delta',deltaf  )
             .add('prefixsum', pfs)
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
    main();
}
