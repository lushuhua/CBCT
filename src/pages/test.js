/**
 * Created by miyaye on 2020/4/19.
 */
import React from 'react';

function throttle(fn,delay){
    let valid = true
    return function() {
        if(!valid){
            //休息时间 暂不接客
            return false
        }
        // 工作时间，执行函数并且在间隔期内把状态位设为无效
        valid = false
        setTimeout(() => {
            fn()
            valid = true;
        }, delay)
    }
}

class Test extends React.Component {
    constructor(props) {
        super(props);
        this._throttledMouseMove = throttle(this._throttledMouseMove.bind(this), 2000);
    }

    _throttledMouseMove = (e) => {
        console.log(e);
    }

    render() {
        return (
            <div ref="tool" className="tool">
                sdfsdf
                <div ref="toolBody"
                     className="tool__body"
                     onMouseMove={this._onMouseMove}>
                </div>
            </div>
        )
    }

    _onMouseMove = (e) => {
        //e.persist();
        this._throttledMouseMove(e);
    }
}
export default Test