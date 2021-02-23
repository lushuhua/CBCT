/**
 * Created by miyaye on 2020/5/17.
 */
const chokidar = require('chokidar');
const {createDocs} = require('./fileHelper')
const path = require('path')
const Patient = require('./PatientModelOpt/patient');
const {readFileList} = require('./readPatients')
module.exports=function (ws,req,client) {
        // One-liner for current directory
        var watchDir = '../patient-source'
        var distDir = '../patients'
        const watcher = chokidar.watch(watchDir);
        var timer = setTimeout(()=>{
            watcher.on('all', async (event, pathInfo) => {
                if(event=='addDir'){
                    console.log(event, pathInfo);
                    var distPath = pathInfo.replace(watchDir,distDir);
                    var arr = pathInfo.split('/')
                    var patientName = arr[2];
                    createDocs(pathInfo, distPath);

                    if(arr.length == 3){
                        //console.log(arr)
                        await  Patient.add({patientName:patientName})
                        var timer1 = setTimeout(()=>{
                            readFileList(path.resolve(distDir),[],[patientName])
                            console.log('准备发送了')
                            var url = req.url
                            ws.send(JSON.stringify({type:'newPatient'}));
                            clearInterval(timer1)
                        },3000)
                    }
                }
            });
            clearInterval(timer)
        },2000)
}




