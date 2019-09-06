var exec = require('child_process').execSync;
class DEV {
    constructor() {
        this.formats = [];

    }
}
const LIST_DEVICE = "--list-devices";
const LIST_FORMAT = "--list-formats-ext";
const LIST_MENU = "--list-ctrls-menus";
const GET_CTRL = "-C";
const SET_CTRL = "-c";
/**
 * [
 *  {name:name
 *    [
 * 
 *     ]
 * 
 * 
 *  },
 *  
 * 
 * ] 
 */


class Device {
    
    constructor(){
        this.name = null;
        this.menus = [];
        this.formats = [];
    }
}
class USB {
    constructor(){
        this.name =null;
        this.devices = [];
    }
}
const V4L2 = "v4l2-ctl";
class V4l2 {
    _exec(cmd) {
        let r = exec(cmd);
        // console.log(r.toString());
        return r.toString();
    }

    setCtrl(deviceId,ctrlName, value){
        let result = this._exec(`${V4L2} ${SET_CTRL} ${ctrName}:${value} -d ${deviceId}`);
        if(result){
            return {result:false, message:result};
        }
        else
            return {result:true};
    }
    getCtrl(deviceId,ctrName){
        let result = this._exec(`${V4L2} ${SET_CTRL} ${ctrName}:${value} -d ${deviceId}`);
        let vals =result.split(':');
        if(vals.length>1){
            return vals[1].trim();
        }else
            throw new Error(result);
    }
    getMenus(deviceId) {
        let txt = this._exec(`${V4L2} -d ${deviceId} ${LIST_MENU}`);
      
        let txts = txt.split('\n');
        
        let cur;
        let ctrls = [];
        let isMenu = false;
        for (let i = 0; i < txts.length; i++) {
            let line = txts[i];
            if(line.trim().length<1){
                continue;
            }
            let menu_type = line.match(/\(.*\)/gi);

            if (menu_type == null || menu_type.length < 1) {
                let m =line.trim().split(':');
         
                let menu = {key:m[0].trim() ,value:m[1].trim()};
                if(cur){
           
                    cur.menus.push(menu);
                }
                continue;
            }
            let ctrl = {};
            let tmp = line.split(/\(.*?\).*?\:/);
            let names = tmp[0].trim().split(' ');
            let values = tmp[1].trim().split(' ');
            
            ctrl.type = menu_type[0].substr(1, menu_type[0].length - 2);
            ctrl.name = names[0];
            ctrl.cmd = names[1];
            for (let j = 0; j < values.length; j++) {
                let value = values[j];
                value = value.split('=');
                switch (value[0]) {
                    case 'min':
                        ctrl.min = value[1];
                        break;
                    case 'max':
                        ctrl.max = value[1];
                        break;
                    case 'step':
                        ctrl.step = value[1];
                        break;
                    case 'default':
                        ctrl.default = value[1];
                        break;
                    case 'value':
                        ctrl.value = value[1];
                        break;
                    case 'flags':
                        ctrl.flags = value[1];
                        break;
                    default:
                        break;
                }

            }
            if(ctrl.type=='menu'){
                ctrl.menus = [];
            }
            cur = ctrl;
            ctrls.push(ctrl);

        

        }
        return ctrls;
    }
    getinfo() {
        let usb_txt = this._exec(`${V4L2} --list-devices`);
        let usbs = this.listUSB(usb_txt);
        for (let i = 0; i < usbs.length; i++) {
            let usb = usbs[i];
            for (let j = 0; j < usb.devices.length; j++) {
                let dev = usb.devices[j];
                let format_txt = this._exec(`${V4L2} --list-formats-ext -d ${dev.name}`);
                let formats = this.formatExt(format_txt);
                dev.formats.push(formats);
            }

        }

        return usbs;

    }
    formatExt(txt) {
        let lines = txt.split('\n');
        let exts = [];
        let cur;
        let curSize;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.indexOf('ioctl:') >= 0) continue;
            if (line.indexOf('Type:') > 0) {
                if (line.indexOf('Video Capture') < 0) {
                    console.log("not capture device");
                    return;
                }
            }
            if (line.indexOf('[') >= 0) {
                let dev = {};
                dev.size = [];
                cur = dev;
                let x = line.split("'");
                dev.format = x[1];
                exts.push(dev);
                continue;
            }
            if (line.indexOf("Size:") >= 0) {
                let sizeObj = {};
                let size = line.split("Discrete")[1].trim();
                sizeObj.size = size;
                sizeObj.fps = [];
                curSize = sizeObj;
                cur.size.push(sizeObj);
                continue
            }
            if (line.indexOf("Interval") >= 0) {
                let f1 = line.split("(")[1];
                let fps = f1.split(".")[0];
                curSize.fps.push(fps);

            }

        }

        return exts;
    }
    /**
     * parse device all device info
     * @param {*} txt 
     */
    listUSB(txt) {
        let lines = txt.split('\n');
        let devices = [];
        let cur;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            if (line.endsWith(":")) {
                let dev = {};
                if (line.indexOf('bcm2835-codec') >= 0) {
                    cur = undefined;
                    continue;
                }
                dev.name = line.substr(0, line.length - 1);
                dev.devices = [];
                devices.push(dev);

                cur = dev;
                continue;
            }
            if (line.indexOf('/dev/') >= 0 && cur) {
                let dev = { name: line.trim(), formats: [] };
                cur.devices.push(dev);
            }
        }


        return devices;

    }
}

module.exports = V4l2