var exec = require('child_process').execSync;
class DEV{
    constructor(){
        this.formats = [];

    }
}

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
 

const V4L2 = "v4l2-ctl";
class V4l2{
     _exec(cmd) {
        let r = exec(cmd);
        // console.log(r.toString());
        return  r.toString();
    }
    getinfo(){
        let usb_txt = this._exec(`${V4L2} --list-devices`);
        let usbs = this.listUSB(usb_txt);
        for(let i=0;i<usbs.length;i++) {
            let usb = usbs[i];
            for(let j=0;j<usb.devices.length;j++){
                let dev = usb.devices[j];
                let format_txt= this._exec(`${V4L2} --list-formats-ext -d ${dev.name}`);
                console.log(dev.name,format_txt);
                let format = this.formatExt(format_txt);
                dev.formats.push(format);
            }
            
        }
        console.log(usbs);
        return usbs;

    }
    formatExt(txt){
        let lines = txt.split('\n');
        let exts =[];
        let cur ;
        let curSize ;
        for(let i=0;i<lines.length;i++) {
            let line = lines[i];
            if(line.indexOf('ioctl:')>=0) continue;
            if(line.indexOf('Type:')>0){
                if(line.indexOf('Video Capture')<0){
                    console.log("not capture device");
                    return ;
                }
            }
            if(line.indexOf('[')>=0) {
                let dev = {};
                dev.size =[];
                cur =dev;
                let x= line.split("'");
                dev.format = x[1];
                exts.push(dev);
                continue;
            } 
            if(line.indexOf("Size:")>=0){
                let sizeObj = {};
                let size= line.split("Discrete")[1].trim();
                sizeObj.size= size;
                sizeObj.fps = [];
                curSize = sizeObj;
                cur.size.push(  sizeObj);
                continue
            }
            if(line.indexOf("Interval")>=0){
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
    listUSB(txt){
        let lines = txt.split('\n');
        let devices = [];
        let cur ;
        for(let i=0;i<lines.length;i++ ){
            let line = lines[i];
            
            if(line.endsWith(":")) {
                let dev = {};
                if(line.indexOf('bcm2835-codec')>=0){
                    cur = undefined;
                    continue;
                }
                dev.name = line.substr(0,line.length-1);
                dev.devices = [];
                devices.push(dev);
                dev.formats = {};
                cur = dev;
                continue;
            }
            if(line.indexOf('/dev/')>=0&&cur){
                let dev = {name:line.trim(),formats:[]};
                cur.devices.push(dev);
            }
        }
 

        return devices;

    }
}

module.exports= V4l2