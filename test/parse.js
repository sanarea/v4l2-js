
let fs = require("fs");
let path = require("path");

let V4l2 = require("../v4l2");
let v4l2 = new V4l2();
(() => {


    let buffer = fs.readFileSync(path.join(__dirname, "../sample/list-device"));
    let ext_buffer = fs.readFileSync(path.join(__dirname, "../sample/list-formats-ext"));

    let usbList = v4l2.listUSB(buffer.toString());
    console.log(usbList);
    for (let i = 0; i < usbList.length; i++) {
        let usb = usbList[i];

        for (let j = 0; j < usb.devices.length; j++) {
            let dev = usb.devices[j];
            let x = v4l2.formatExt(ext_buffer.toString());
            dev.formats.push(x);
        }
    }
    console.log(devices);
})();