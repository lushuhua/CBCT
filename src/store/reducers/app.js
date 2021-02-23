export default function reducer(state={
    showSideBar:true,//默认显示目录
    showPatientInfo:false,//默认不显示病人信息
    buffers:{},//前端存放buffer
    currentKey:"",
    curNode:{},//当前选中节点
    tsc:"", // transverse sagittal coronal
    action:"slice",//scale,pan,slice
    kpData:{
        slider_blend:0,
        slider_window:2900,
        slider_level:2800,
        pan:"transverse",
        slider_scale:1,
        slider_pan_x:0,
        slider_pan_y:0,
        slider_slice:0,
        slider_shift_x:0,
        slider_shift_y:0,
        slider_shift_z:0,
        isLocked: false
    },
    options:{
        formData:{},
        formItem:[],
        formProps:{
            'label-width': 60
        },
    },
}, action) {
    switch (action.type) {
        case "setData": {
            const {key,value} = action.payload;
            var obj = {};
            obj[key] = value;
            return {...state, ...obj }
        }
    }
    return state
}
