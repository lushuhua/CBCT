/**
 * Created by miyaye on 2020/4/19.
 */
import React, {Component} from 'react';
import helper from '@/utils/helper';
import {debounce} from '@/utils/utils';
import EventBus from '@/utils/eventBus';
import _ from 'lodash';

var left = 0,top = 0  ;
function getDisXY(pos,ev) {
    var disX=0;
    var disY=0;
    var {myCanvasSideLXStart, myCanvasSideLXEnd, myCanvasSideRXStart, myCanvasSideRXEnd, startLineY, middleLineY, endLineY, tsc} = pos;
    switch (tsc){
        case 'transverse':
            disX = ev.clientX-myCanvasSideLXStart ;
            disY = ev.clientY - startLineY   ;
            break;
        case 'sagittal':
            disX = ev.clientX - myCanvasSideRXStart;
            disY = ev.clientY - startLineY;
            break;
        case 'coronal':
            disX = ev.clientX - myCanvasSideRXStart;
            disY = ev.clientY - middleLineY;
            break;
    }
    return {disX,disY}
}

export default class Second extends Component{
    fnMounseDown(){
        var _this = this;
        console.log(_this.glcanvas);

        if(this.state.inited){
            console.log('down left-top:',left,top);

            var ev= event;
            var pos = this.fnGetPos(ev.clientX,ev.clientY);
            const {myCanvasSideLXStart, myCanvasSideLXEnd, myCanvasSideRXStart, myCanvasSideRXEnd, startLineY, middleLineY, endLineY, tsc} = pos;
            var {action} = this.props.app;
            var l,t;
            switch (tsc){
                case 'transverse':
                    var initialX = this.glcanvas.get_pan_transverse_x();
                    var initialY = this.glcanvas.get_pan_transverse_y();
                    var initialScale = this.glcanvas.get_scale_transverse();
                    var initialSlice = this.glcanvas.get_slice_transverse();
                    break;
                case 'sagittal' :
                    var initialX = this.glcanvas.get_pan_sagittal_x();
                    var initialY = this.glcanvas.get_pan_sagittal_y();
                    var initialScale = this.glcanvas.get_scale_sagittal();
                    var initialSlice = this.glcanvas.get_slice_sagittal();
                    break;
                case 'coronal':
                    var initialX = this.glcanvas.get_pan_coronal_x();
                    var initialY = this.glcanvas.get_pan_coronal_y();
                    var initialScale = this.glcanvas.get_scale_coronal();
                    var initialSlice = this.glcanvas.get_slice_coronal();
                    break;
            }

            const posDisXY = getDisXY(pos,ev);

            var disX =   posDisXY.disX;
            var disY =   posDisXY.disY;

            console.log('fnDown disXY:',disX,disY);
            console.log('fnDown initialScale:',initialScale);
            console.log('fnDown initialSlice:',initialSlice);

             document.onmousemove = function (ev) {
                 console.log('tsc:',_this.glcanvas.get_pan_transverse_x(),_this.glcanvas.get_pan_transverse_y())
                 const {disX:disXM,disY:disYM} = getDisXY(pos,ev);

                 var left = disXM - disX;
                 var top = disYM - disY;

                 console.log('移动距离:',left,top);
                 //比例尺 0-630  | 0-2
                 switch(tsc){
                     case 'transverse':
                         var w = (myCanvasSideLXEnd - myCanvasSideLXStart) ;
                         break;
                     case 'sagittal' :
                         var w = (myCanvasSideRXEnd - myCanvasSideRXStart) ;
                         break;
                     case 'coronal':
                         var w = (myCanvasSideRXEnd - myCanvasSideRXStart) ;
                         break;
                 }

                 var  transformdX =  left / w  ;
                 var  transformdY =  -(top  / w  );

                 var distanceX = Math.abs(transformdX);

                 if(transformdX > 0){
                     transformdX = distanceX > 1-initialX ? 1-initialX : distanceX
                 }else{
                     transformdX = distanceX > 1-initialX ? -(1-initialX) : -distanceX
                 }

                 console.log('transformedXY:', transformdX,transformdY);
                 switch (action){
                     case 'pan':
                         _this.glcanvas[`set_pan_${tsc}_x`](( (transformdX) + initialX) );
                         _this.glcanvas[`set_pan_${tsc}_y`](( (transformdY) + initialY) );
                         break;
                     case 'scale':
                         var scaledY = transformdY * 10;
                         var lastScale = initialScale  + scaledY
                         console.log('放大缩小：',lastScale);
                         if(lastScale<=0.5) lastScale = 0.5
                         _this.glcanvas[`set_scale_${tsc}`]( lastScale );
                         break;
                 }

                 _this.glcanvas.render();
                 _this.setState({name:'alice'});
             };
            document.onmouseup = (ev)=>{
                document.onmousemove=document.onmouseup=null;
            };
        }
    }
    fnScroll(){
        const {buffers} = this.props.app

        if(_.isEmpty(buffers)) return
        var ev = window.event;
        const {tsc} = this.fnGetPos(ev.clientX,ev.clientY);
        switch(tsc){
            case 'transverse':
                var init = this.glcanvas.get_slice_transverse();
                break;
            case 'sagittal' :
                var init = this.glcanvas.get_slice_sagittal();
                break;
            case 'coronal':
                var init = this.glcanvas.get_slice_sagittal();
                break;
        }
        if(this.state.inited){
            var {action} = this.props.app;
            if(action !=='slice') return;
            var ev = window.event;
            if(ev.wheelDelta){//IE/Opera/Chrome
                var last = init + (ev.wheelDelta / 120 * 0.01);
                if(last < 0) last = 0;
                if(last > 1) last = 1;

                console.log('last:',last,' | wheelDelta:',ev.wheelDelta);
                this.setGl('slider_slice',last)
                // this.glcanvas[`set_slice_${tsc}`]( last );
                // this.setState({name:'alice11'+ev.wheelDelta});
            }else if(ev.detail){//Firefox
                //console.log(ev.detail);
            }
        }
        window.event.preventDefault();
        return false;
    }
    fnGetPos(x,y){//鼠标位置
        var myCanvas = document.getElementById('mycanvas');
        var pcont = document.getElementById('pcont');
        var myCanvasWidth = myCanvas.width;
        var myCanvasHeight = myCanvas.height;
        var myCanvasOffsetTop = document.getElementById('head-nav').offsetHeight;
        var tsc = "";

        //左边的
        var myCanvasSideLXStart = pcont.offsetLeft + myCanvas.offsetLeft;
        var myCanvasSideLXEnd = pcont.offsetLeft + myCanvas.offsetLeft + parseInt(myCanvasWidth/3)*2;

        var myCanvasSideRXStart = pcont.offsetLeft + myCanvas.offsetLeft + parseInt(myCanvasWidth/3)*2 + 1;
        var myCanvasSideRXEnd = pcont.offsetLeft + myCanvas.width + myCanvas.offsetLeft;
        var middleLineY = myCanvasOffsetTop + myCanvasHeight/2;
        var startLineY = myCanvasOffsetTop;
        var endLineY = myCanvasOffsetTop + myCanvasHeight;

        if(x < myCanvasSideLXEnd){
            tsc = 'transverse'
        }else{
            if(y <middleLineY){
                tsc = "sagittal"
            }else{
                tsc = "coronal"
            }
        }

        this.props.dispatch({type:'setData',payload:{key:'tsc',value:tsc}});

        return {
            myCanvasSideLXStart,
            myCanvasSideLXEnd,
            myCanvasSideRXStart,
            myCanvasSideRXEnd,
            startLineY,
            middleLineY,
            endLineY,
            tsc
        }
    }
}