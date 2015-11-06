
// flip a coin
var getBit = function() {
  return Math.random() < 0.5;
}

// partial shuffle where the data is divided in two random sets in-place
var inplace_onepass_shuffle = function(arr) {
  var len = arr.length;
  var boundary = -1;
  for(var i = 0; i < len; ++i) {
    var coin = getBit();
    // if coin is true then arr[i] is black, else it is white
    if(coin) {
      boundary++; // one more black
      swap(arr, i,boundary);
    }
  }
}

var swap = function(arr, i,j) {
  var x = arr[i];
  arr[i] = arr[j];
  arr[j] = x;
}


var arr = new Array(100);
inplace_onepass_shuffle(arr);
console.log(arr);
