/**
 * Created by miyaye on 2020/5/17.
 */
const path = require('path')
const {startRead} = require('./readPatients')
var dirPath = path.resolve(__dirname,'../../patients')
startRead(dirPath)  