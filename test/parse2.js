
let fs = require("fs");
let path = require("path");

let V4l2 = require("../v4l2");
let v4l2 = new V4l2();
(() => {

    let x = v4l2.getinfo();
    console.log(x);
    
})();