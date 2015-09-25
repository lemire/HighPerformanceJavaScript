"use strict";
var os = require('os');
var describeme = function() {
  console.log("Platform: "+process.platform+" "+os.release()+" "+process.arch);
  console.log(os.cpus()[0]["model"]);
  console.log("Node version "+process.versions.node+", v8 version "+process.versions.v8);
}

module['exports'] = {"describeme":describeme};
