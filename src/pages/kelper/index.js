import React, { Component } from 'react';
import * as wasm from "hello-wasm-pack";
// import { start, GlCanvas, ViewType } from "kepler";
import{start, GlCanvas, ViewType} from "../../../pkg/kepler"
import Second from './second'
import 'antd/es/spin/style/css';
import { connect } from 'react-redux';
import EventBus from '@/utils/eventBus';
import Draggable, { DraggableCore } from 'react-draggable'; // Both at th
@connect((store) => {
    return { app: store.app };
})
class kp extends Component {
    static displayName = "Kelper";
    state = {
        cWidth: 945,
        cHeight: 630,
        inited: false,

        activeDrags: 0,
        deltaPosition: [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 }
        ],
        controlledPosition: {
            x: -400, y: 200
        }
    };
    constructor(props, context) {
        super(props, context);
        this.glcanvas = null;
        this.second = new Second();
        this.fnGetPos = this.second.fnGetPos.bind(this);
        if (props.onRef) {//如果父组件传来该方法 则调用方法将子组件this指针传过去
            props.onRef(this)
        }
    }
    setGl(name, value) {
        const { kpData, tsc } = this.props.app;
        const obj = {};
        let shift = this.glcanvas.get_shift();
        switch (name) {
            case 'slider_blend':
                this.glcanvas.set_blend(value);
                break;
            case 'slider_window':
                this.glcanvas.set_window(value);
                break;
            case 'slider_level':
                this.glcanvas.set_level(value);
                break;
            case 'pan'://类型
                break;
            case 'slider_scale':
                this.glcanvas[`set_scale_${tsc}`](value);
                break;
            case 'slider_pan_x':
                this.glcanvas[`set_pan_${tsc}_x`](value);
                break;
            case 'slider_pan_y':
                this.glcanvas[`set_pan_${tsc}_y`](value);
                break;
            case 'slider_slice':
                this.glcanvas[`set_slice_${tsc}`](value);
                break;
            case 'slider_shift_x':
                this.glcanvas.set_shift(value, shift[1], shift[2]);
                break
            case 'slider_shift_y':
                this.glcanvas.set_shift(shift[0], value, shift[2]);
                break
            case 'slider_shift_z':
                this.glcanvas.set_shift(shift[0], shift[1], value);
                break
        }
        obj[name] = value;
        kpData[name] = value;

        this.glcanvas.render();
        this.props.dispatch({ type: 'setData', payload: { key: 'kpData', value: kpData } });
        this.setState(obj);
    }
    fnChange(e) {
        console.log('触发了change事件', new Date())
        const { name, value } = e.target;
        const obj = {};
        obj[name] = value;
        this.setGl(name, value);
        console.log('====fnchange obj===', obj);
    }
    componentWillReceiveProps(nextProps) {

    }
    getWH() {
        const { showSideBar, showPatientInfo } = this.props.app;
        var dWidth = document.documentElement.clientWidth;
        if (showSideBar == false && showPatientInfo == false) {//左侧都隐藏
            var w = dWidth - 260;
            console.log(0)
        } else if (showSideBar && !showPatientInfo) {//左侧显示一个
            console.log(1)
            var w = dWidth - 480;
        } else if (!showSideBar && showPatientInfo) {//左侧显示一个
            var w = dWidth - 420;
            console.log(2)
        } else if (showSideBar && showPatientInfo) {//左侧都显示
            var w = dWidth - 400 - 212
            console.log(3)
        }

        w = parseInt(w / 3) * 3;
        var h = parseInt(w / 3) * 2;
        this.setState({ cWidth: w, cHeight: h })
        if (this.glcanvas) {
            this.glcanvas.set_canvas_dim(w, h);
            this.glcanvas.render();
        }

        return { w, h }
    }
    componentWillMount() {
        const { kpData } = this.props.app;
        this.setState({ kpData });
        this.second.fnMounseDown.call(this, 'sss');
        this.getWH()
    }
    componentDidMount() {
        document.addEventListener('DOMMouseScroll', (e) => { console.log('DOMMouseScroll'); e.preventDefault(); return false }, false);
        document.addEventListener('mousewheel', (e) => { this.second.fnScroll.call(this) }, { passive: false });

        // this.glcanvas = GlCanvas.new("mycanvas", this.state.cWidth, this.state.cHeight, this.state.kpData.slider_window, this.state.kpData.slider_level);
        this.glcanvas = GlCanvas.new("mycanvas", this.state.cWidth, this.state.cHeight, 1200, 1500)
        // this.glcanvas.load_shaders();
        this.glcanvas.set_window(1200);
        this.glcanvas.set_level(1500);
        this.glcanvas.setup_geometry();
        this.glcanvas.render();

        console.log(ViewType.SAGITTAL || 'ssss');
        console.log('window:', this.glcanvas.window);

        this.setState({ inited: true })

        // 这里在eventBus上绑定了updateGL这个事件，也就是派发的那个事件所以就执行这个函数
        EventBus.addListener('updateGl', (res) => {
            console.log('====updateGl====', res);
            this.glRender(res);
        });
        EventBus.addListener('setGl', (res) => {
            console.log('====setGl====', res);
            this.setGl(res);
        });
    }

    glRender(obj){
        console.log(232323232332323232323)
        console.log('obj======>',obj)
        const {buffers,curNode:{detail:{patinfo}}} = this.props.app;
        console.log('props=====>',this.props.app)  
        const {columns,rows,window,level,numSlices,spacing} = patinfo
        console.log(columns,"columns======================");
        var primaryKey = obj['primary']; 
        console.log(buffers[primaryKey]) 
        if(primaryKey){ 
            this.glcanvas.load_primary(buffers[primaryKey], columns,rows,numSlices, spacing[0], spacing[1], spacing[2]); 
        }

        var secondaryKey = obj['secondary'];
        if(obj['secondary']){ 
            console.log(columns,"columns======================");
            console.log("buffers[secondaryKey]======",buffers[secondaryKey])
            this.glcanvas.load_secondary(buffers[primaryKey], columns,rows,numSlices, spacing[0], spacing[1], spacing[2]);
        }
        this.glcanvas.set_window(window);
        this.glcanvas.set_level(level);
        this.glcanvas.setup_geometry();  
        this.glcanvas.set_blend(0.5);
        this.glcanvas.render();
        this.props.dispatch({type:'setData',payload:{key:'loading',value:false}});
    }
    handleDrag = (e, ui) => {
        if (this.props.app.action !== 'pan') return
        const { deltaPosition } = this.state;
        const { node } = ui
        if (node.id == 'cmask-l') {
            const { x, y } = deltaPosition[0]
            deltaPosition[0] = {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }

            if (this.props.app.action == 'pan') {
                this.glcanvas[`set_pan_transverse_x`](deltaPosition[0].x / (this.state.cHeight / 2));
                this.glcanvas[`set_pan_transverse_y`](-deltaPosition[0].y / (this.state.cHeight / 2));
                this.setState({ deltaPosition });
            }
        } else if (node.id == 'cmask-rt') {
            const { x, y } = deltaPosition[1]
            deltaPosition[1] = {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }

            if (this.props.app.action == 'pan') {
                this.glcanvas[`set_pan_sagittal_x`](deltaPosition[1].x / (this.state.cHeight / 3));
                this.glcanvas[`set_pan_sagittal_y`](-deltaPosition[1].y / (this.state.cHeight / 3));
                this.setState({ deltaPosition });
            }
        } else if (node.id == 'cmask-rb') {
            const { x, y } = deltaPosition[2]
            deltaPosition[2] = {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }

            if (this.props.app.action == 'pan') {
                this.glcanvas[`set_pan_coronal_x`](deltaPosition[2].x / (this.state.cHeight / 3));
                this.glcanvas[`set_pan_coronal_y`](-deltaPosition[2].y / (this.state.cHeight / 3));
                this.setState({ deltaPosition });
            }
        }
        this.glcanvas.render();

    };

    onStart = (e, ui) => {
        console.log(e)
        const { node } = ui;
        var tsc;
        switch (node.id) {
            case 'cmask-l':
                tsc = 'transverse'
                break
            case 'cmask-rt':
                tsc = 'sagittal'
                break
            case 'cmask-rb':
                tsc = 'coronal'
                break
        }
        this.setState({ tsc })
        this.props.dispatch({ type: 'setData', payload: { key: 'tsc', value: tsc } });
        this.setState({
            activeDrags: ++this.state.activeDrags,
            initialSScale: this.glcanvas.get_scale_transverse()
        });
    };

    onStop = () => {
        this.setState({ activeDrags: --this.state.activeDrags });
    };
    render() {
        const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
        const { cWidth, cHeight, slider_blend, slider_window, slider_level, pan, slider_scale, slider_pan_x, slider_pan_y, slider_slice,
            deltaPosition, controlledPosition
        } = this.state;
        return (
            <div className="kelper page" >
                <canvas ref="canvas" id="mycanvas" width={cWidth} height={cHeight}
                    className={this.props.app.action}
                    onMouseDown={this.props.app.action == 'scale' ? this.second.fnMounseDown.bind(this) : null}
                    onScroll={this.second.fnScroll.bind(this)}
                >
                </canvas>
                {this.props.app.action == 'pan' ?
                    <div className="canvasMask">
                        <Draggable onDrag={this.handleDrag} {...dragHandlers} >
                            <div className={`l ${this.props.app.action}`} id="cmask-l" style={{ width: cHeight + 'px' }} onMouseDown={this.fnMouseDown}>
                                left
                                    <div>x: {deltaPosition[0].x.toFixed(0)}, y: {deltaPosition[0].y.toFixed(0)}</div>
                            </div>
                        </Draggable>

                        <Draggable onDrag={this.handleDrag} {...dragHandlers}>
                            <div className={`rt ${this.props.app.action}`} id="cmask-rt" style={{ width: cHeight / 2 + 'px', height: cHeight / 2 + 'px' }}>
                                right top
                                    <div>x: {deltaPosition[1].x.toFixed(0)}, y: {deltaPosition[1].y.toFixed(0)}</div>
                            </div>
                        </Draggable>

                        <Draggable onDrag={this.handleDrag} {...dragHandlers}>
                            <div className={`rb ${this.props.app.action}`} id="cmask-rb" style={{ width: cHeight / 2 + 'px', height: cHeight / 2 + 'px' }}>
                                right bottom
                                    <div>x: {deltaPosition[2].x.toFixed(0)}, y: {deltaPosition[2].y.toFixed(0)}</div>
                            </div>
                        </Draggable>
                    </div>
                    : ''}
            </div>
        );
    }
}


export default kp;
