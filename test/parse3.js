
let fs = require("fs");
let path = require("path");

let v4l2 = require("../v4l2");

(() => {
    // let line = '       power_line_frequency 0x00980918 (menu)   : min=0 max=2 default=2 value=2';
    // let tmp = line.split( /\(.*?\)/);
    // console.log(tmp);
    let menus = v4l2.getMenus('/dev/video2');
    console.log(menus);
    // console.log("result", x);
    
})();