
let fs = require("fs");

let V4l2 =  require("./v4l2");
let v4l2 = new V4l2();
(()=>{
    let buffer = fs.readFileSync("list-device" ) ;
    let ext_buffer = fs.readFileSync("list-formats-ext" ) ;

    let devices = v4l2.listDevice(buffer.toString());
  
    for(let i =0; i<devices.length;i++){
        let usb = devices[i];
       
        for (let j=0;j<usb.devices.length;j++){
            let dev = usb.devices[j];
            let x = v4l2.formatExt(ext_buffer.toString());
            dev.formats.push(x);
        }
    }
    console.log(devices);
})();