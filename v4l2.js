var exec = require('child_process').exec;
class V4l2{
    _exec(cmd) {



    }
    getinfo(){



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
    listDevice(txt){
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