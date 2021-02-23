
export function guid() { //获取随机ID，组件拖到预览视图后就会被设置个ID
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4()
}


export function getFromLS() {
    let ls = {};
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem('rgl-7')) || null;
        } catch (e) {
            /*Ignore*/
        }
    }
    return ls ;
}
export function saveToLS(obj) {
    if (global.localStorage) {
        global.localStorage.setItem(
            'rgl-7',
            JSON.stringify(obj)
        );
    }
}
export function initialLayout() {
  return  [0, 1, 2, 3, 4].map(function(i, key, list) {
        return {
            id: i.toString(),
            x: i * 2,
            y: 0,
            w: 2,
            h: 2,
            add: i === (list.length - 1).toString(),
            test:i.toString(),
            info:{},
            attributes:{},
            slots:{

            }
        };
    })
}

export const formItemLayout = (labelCol=8)=>(
      {
        labelCol: {
            xs: { span: 24 },
            sm: { span: labelCol },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24-labelCol },
        },
    }
)

export const tailFormItemLayout = (labelCol=0) =>( {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 24-labelCol,
            offset: labelCol,
        },
    },
});

/**取消冒泡**/
export function stopPro (e) {
    if (e && e.stopPropagation) {
        //W3C取消冒泡事件
        e.stopPropagation();
    } else {
        //IE取消冒泡事件
        window.event.cancelBubble = true;
    }
}

export const getRes = (res,fnSuccess,fnFail)=>{
    const response = res;
    const {data,code, status  } = response;
    if (code==200 || code==0 || status=='success') {
        fnSuccess&&fnSuccess(data)
    } else {
        fnFail&&fnFail(status);
    }
};