/**
 * Created by miyaye on 2020/4/10.
 */
import React, { Component } from 'react';
import { Tree } from 'antd';
import { connect } from 'react-redux';
import { Route, Link, Redirect, withRouter } from "react-router-dom";
// import io from 'window.ws.io-client';
//import EventBus from
import { createFromIconfontCN } from '@ant-design/icons';
import EventBus from '@/utils/eventBus';
// var window.ws = io()
import { Archive } from 'libarchive.js/main.js';
Archive.init({
    workerUrl: '/static/libarchive/worker-bundle.js'
});
// const WebSocket = require('window.ws');
// const window.ws = new WebSocket('ws://localhost:3003/chunk');
// window.ws.binaryType = 'arraybuffer';
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1763058_xbrna35m9w.js',
});
import { getPatientList } from "@/services/api";
import { getRes } from "@/utils";
import { base64ToUint8Array, concatArrayBuffer } from "@/utils/utils";
import { usedTime } from "../../utils/utils";
import { DicomObject, CTImage, CTVolume } from "@/utils/dic.js";
var config = require('../../../config/index')
var i = 0;
var arr = [];
var fileList = [];
@connect((store) => {
    return { app: store.app, };
})
class SideL extends Component {
    constructor(props, context) {
        console.log('===aaa=====', props)
        super(props, context);
        if (props.onRef) {//如果父组件传来该方法 则调用方法将子组件this指针传过去
            props.onRef(this)
        }
        // this.host = props.location.search.indexOf('dev') > 0 ? config.host  : config.prdHost
        this.host = config.host
    }
    state = {
        treeData: [],
        selectedKeys: [],
        checkedKeys: [],
    };
    connect() {
        if (!window.ws) {
            console.log(this.host)
            window.ws = new WebSocket(`ws://${this.host}`);
            window.ws.binaryType = 'arraybuffer'
            window.ws.onclose = (e) => {
                console.log('关闭', e)
            }
        }
    }
    componentDidMount() {
        getPatientList().then(res => {
            console.log("res======>",res);
            getRes(res, data => {
                const handleIcon = (d) => {
                    return d.map(item => {
                        item.icon = ({ selected }) => (selected ? <IconFont type="icon-baseline-check_box-px" /> : <IconFont type="icon-check-box-outline-bl" />);
                        if (item.children) {
                            handleIcon(item.children);
                            return item;
                        }
                        return item;
                    });
                };
                this.props.dispatch({ type: 'setData', payload: { key: 'treeData', value: data } });
                this.setState({ treeData: handleIcon(data) })
            })
        })
    }
    async onSelect(selectedKeys, info) {
        console.log('====selectedKeys====', selectedKeys);
        console.log('=======info', info)
        arr = []
        fileList = [];
        //查看store中是否有当前key, 如果有则拿store的 如果没有则请求
        if (info.selected) {
            console.log('====this.props.app======', this.props.app)
            const { buffers } = this.props.app;
            var { dcmPath, level, path, key, pid, detail: { shift } } = info.node;
            console.log('=====info.node=======', info.node);
            // if (info.node.level == '0') {
            this.props.dispatch({ type: 'setData', payload: { key: 'curNode', value: info.node } });
            // }

            if (shift) {
                var { kpData } = this.props.app
                kpData['slider_shift_x'] = shift['slider_shift_x']
                kpData['slider_shift_y'] = shift['slider_shift_y']
                kpData['slider_shift_z'] = shift['slider_shift_z']
                this.props.dispatch({ type: 'setData', payload: { key: 'kpData', value: kpData } });
            }

            if (key == this.props.app.currentKey) return;
            this.props.dispatch({ type: 'setData', payload: { key: 'loading', value: true } })
            this.connect()
            if (buffers[key]) {
                //病人
                //拿了store的需要通知重新渲染
                if (level == 0) {
                    EventBus.emit('updateGl', { primaryKey: key });
                } else if (level == 2) {
                    //cbct
                    EventBus.emit('updateGl', { primaryKey: key, secondary: pid });
                }
            } else {
                if (level == 0) {
                    this.getRawFile({ dcmDir: dcmPath, level, path, key });
                } else if (level == 2) {
                    const { treeData } = this.state;
                    var parent = treeData.find(item => item.key == pid);
                    // if (!buffers[pid]) {
                    this.getRawFile({ dcmDir: parent.dcmPath, level: parent.level, key: pid });
                    //当primary 数据接受完毕再请求第二批数据
                    EventBus.addListener('recieveEnd', (res) => {
                        console.log('primary over')
                        this.props.dispatch({ type: 'setData', payload: { key: 'loading', value: true } });
                        this.getRawFile({ level, path, key, pid });
                    })
                    // } else {
                    //     this.getRawFile({ level, path, key, pid });
                    // }
                }
            }
            this.props.dispatch({ type: 'setData', payload: { key: 'currentKey', value: key } });
            // this.startListenSocket()
        }
    };
    getRawFile(params) {
        i = 0;
        arr = [];
        params['type'] = 'chunk';
        if (!window.ws) this.connect()
        setTimeout(() => {
            console.log("params=====>", params)
            window.ws.send(JSON.stringify(params))
            this.startListenSocket()
        }, 2000)
    }
    startListenSocket() {
        if (!window.ws) this.connect()
        //下面开始监听websocket
        var startTime = Date.now();
        window.ws.addEventListener('message', (event) => {
            // if (data.buffers.data.constructor != ArrayBuffer) return
            // const { level, key, type, pid } = data;
            // const buffers = data.buffers.data;
            // fileList.push(buffers);
            // console.log("type====>", type)
            // if (type === 'end') {
            //     console.log(11111222)
            //     ws.close();
            //     window.ws = null;
            //     console.log(level, key, pid)
            //     this.readDicom(level, key, pid);
            // }
            const data = event.data;
            if (!(data.constructor == ArrayBuffer || JSON.parse(data).type == 'end')) return
            if (data.constructor == String) {
                var msg = JSON.parse(data)
                ws.close()
                window.ws = null
                var endTime = Date.now()
                console.log(endTime - startTime)
                this.chunkEnd(msg);
            } else {
                arr.push(data);
            }
        });
    }
    readDicom(level, key, pid) {
        let volume = new CTVolume;
        fileList.forEach((item, index) => {
            var dcm = DicomObject.from_array_buffer(item);
            console.log(index, dcm)
            let image = undefined;
            if (dcm) {
                image = CTImage.from_dicom_object(dcm);
            }
            if (image) {
                volume.add_slice(image);
            }
            if (index === (fileList.length - 1)) {
                console.log(volume)
                //接受到buffer后存起来 切换的时候不用再次去请求
                if (volume.slices.length > 0) {
                    const { buffers } = this.props.app;
                    buffers[key] = volume.pixelData;
                    this.props.dispatch({ type: 'setData', payload: { key: 'buffers', value: buffers } });
                    const columns = volume.dim[0];
                    const rows = volume.dim[1];
                    const window = volume.slices[0].window;
                    const levelVal = volume.slices[0].level;
                    const numSlices = volume.numSlices;
                    const spacing = volume.spacing;
                    var { curNode } = this.props.app;
                    curNode.detail.patinfo = { columns, rows, window, level: levelVal, numSlices, spacing };
                    this.props.dispatch({ type: 'setData', payload: { key: 'curNode', value: curNode } });
                    console.log("curNode===>", curNode)
                }

                var timer = setTimeout(() => {
                    if (curNode && curNode.level == 0) {//如果点击的是病人 直接渲染
                        EventBus.emit('updateGl', { primary: key });

                    } else {
                        // 如果点击的是cbct
                        if (level == 0) { //curNode.level为2
                            //this.glRender({primary:msg.key});
                            EventBus.emit('updateGl', { primary: key })
                            EventBus.emit('recieveEnd', true);
                        } else if (level == 2) {
                            //this.glRender({primary:msg.pid,secondary:msg.key});
                            console.log("level2222222222222222222222")
                            EventBus.emit('updateGl', { primary: pid, secondary: key })
                        }
                    }
                    clearInterval(timer);
                }, 1000)
            }
        })
        fileList = [];
    }
    chunkEnd = msg => {
        let volume = new CTVolume;
        arr.forEach((item, index) => {
            var dcm = DicomObject.from_array_buffer(item);
            let image = undefined;
            if (dcm) {
                image = CTImage.from_dicom_object(dcm);
            }
            if (image) {
                volume.add_slice(image);
            }
            if (index == arr.length - 1) {
                //接受到buffer后存起来 切换的时候不用再次去请求
                console.log("volume====>123", volume)
                if (volume.slices.length > 0) {
                    const { buffers } = this.props.app;
                    buffers[msg.key] = volume.pixelData;
                    this.props.dispatch({ type: 'setData', payload: { key: 'buffers', value: buffers } });
                    const columns = volume.dim[0];
                    const rows = volume.dim[1];
                    const window = volume.slices[0].window;
                    const levelVal = volume.slices[0].level;
                    const numSlices = volume.numSlices;
                    const spacing = volume.spacing;
                    var { curNode } = this.props.app;
                    curNode.detail.patinfo = { columns, rows, window, level: levelVal, numSlices, spacing };
                    this.props.dispatch({ type: 'setData', payload: { key: 'curNode', value: curNode } });
                    console.log("curNode===>", curNode);
                }

                var timer = setTimeout(() => {
                    if (curNode && curNode.level == 0) {//如果点击的是病人 直接渲染
                        EventBus.emit('updateGl', { primary: msg.key });

                    } else {
                        // 如果点击的是cbct
                        if (msg.level == 0) { //curNode.level为2
                            //this.glRender({primary:msg.key});
                            EventBus.emit('updateGl', { primary: msg.key })
                            EventBus.emit('recieveEnd', true);
                        } else if (msg.level == 2) {
                            //this.glRender({primary:msg.pid,secondary:msg.key});
                            console.log("level2222222222222222222222")
                            EventBus.emit('updateGl', { primary: msg.pid, secondary: msg.key })
                        }
                    }
                    clearInterval(timer);
                }, 1000)
            }
        })
        return;

        var blob = new Blob([dataBuffer], { type: 'application/octet-stream' });
        var file = new File([blob], 'a.dcm');

        if ((msg.count - 1) == msg.index) {
            let volume = new CTVolume;
            let count = 0;
            // for (let i = 0, f; f = fileList[i]; ++i) {
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function (e) {
                count++;
                console.log(e.target.result)
                var dcm = DicomObject.from_array_buffer(e.target.result);
                let image = undefined;
                if (dcm) {
                    image = CTImage.from_dicom_object(dcm);
                }
                if (image) {
                    volume.add_slice(image);
                }
                if (count == fileList.length) {
                    //接受到buffer后存起来 切换的时候不用再次去请求
                    console.log("volume====>", volume)
                    const { buffers } = this.props.app;
                    buffers[msg.key] = volume.pixelData;
                    this.props.dispatch({ type: 'setData', payload: { key: 'buffers', value: buffers } });

                    const { curNode } = this.props.app;
                    console.log("curNode===>", curNode)
                    var timer = setTimeout(() => {
                        if (curNode.level == 0) {//如果点击的是病人 直接渲染
                            EventBus.emit('updateGl', { primary: key })

                        } else {
                            // 如果点击的是cbct
                            if (msg.level == 0) { //curNode.level为2
                                //this.glRender({primary:msg.key});
                                EventBus.emit('updateGl', { primary: msg.key })
                                EventBus.emit('recieveEnd', true);
                            } else if (msg.level == 2) {
                                //this.glRender({primary:msg.pid,secondary:msg.key});
                                EventBus.emit('updateGl', { primary: msg.pid, secondary: msg.key })
                            }
                        }
                        clearInterval(timer);
                    }, 1000)
                }
            }
            // }
        }
    }
    render() {
        const { treeData } = this.state;
        return (
            <div className="sideL">
                {treeData.length > 0 ? <Tree
                    showIcon
                    onSelect={this.onSelect.bind(this)}
                    treeData={treeData}
                    multiple={false}
                /> : ''}
            </div>
        );
    }
}

export default withRouter(SideL);
