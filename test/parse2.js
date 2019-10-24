
let fs = require("fs");
let path = require("path");

let v4l2 = require("../v4l2");

(() => {

    let x = v4l2.getinfo();
    for(let i=0;i<x.length;i++){
        let usb = x[i];
        console.log(usb.name);
        for(let j=0;j<usb.devices.length;j++){
            let dev = usb.devices[j];
            console.log('\t', dev.name);
            for(let k=0;k<dev.formats.length;k++){
                let format = dev.formats[k];
                console.log('\t\t',format);
            }
        }
    }
    console.log("result", x);
    
})();