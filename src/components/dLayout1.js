import React,{Component} from 'react';
import {  HashRouter as Router, Route, Switch, Link,browserHistory  } from "react-router-dom";
import { connect } from "react-redux";
/*import axios from 'axios';
import history from '@/utils/history'
import CRouter from '../routes/index'
import notFound from "@/pages/notFound";
import AllComponents from '../pages/index'

//import routeConfig from '../routes/config'*/
import {logout} from "@/services/api";
import {getRes} from "@/utils";
import {Spin,message,Menu, Dropdown} from 'antd';
import { DownOutlined,CaretDownOutlined } from '@ant-design/icons';
import helper from '@/utils/helper';

@connect((store) => {
    return {
        user:store.userReducer.user,
        app:store.app,
    };
})

class dLayouta extends Component {
    constructor(props) {
        super(props);
        this.props.dispatch({type:'SET_USER',payload:JSON.parse(sessionStorage.getItem('user'))})
    }
    state = {
        collapsed: false,
        username:"",
        loading:false,
        showNavDropMenu:false,
        theme:"dark"
    };

    componentDidMount(){
        var jwt = require('jsonwebtoken');
        const config = require('../../config/index');
        if(helper.getCookie('token')){
            jwt.verify(helper.getCookie('token'), config.jwtsecret, (err, decode)=> {
                if (err) {  //  认证出错
                    message.error(err);
                } else {
                    this.setState({username:decode.username})
                }
            })
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({loading:nextProps.app.loading})
    }
    signOut(){
        helper.delCookie('token');
        location.reload();
    }
    render() {
        const {username,showNavDropMenu,loading} = this.state;

        const menu = (
            <Menu theme={this.state.theme}>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                        System Settings
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                        Account Settings
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={this.signOut.bind(this)}>
                        Sign Out
                    </a>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className="warpper">
                <div className={this.props.className}>
                    <div id="head-nav" className="navbar navbar-default navbar-fixed-top" style={{"width":"100%"}}>
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <a className="navbar-brand" href="#"><span>CURIE</span></a>
                            </div>
                            <div className="navbar-collapse collapse">
                                <ul className="nav navbar-nav">
                                    <li className="active"><a href="#"><span style={{"borderBottom":"3px solid"}}>CBCT</span></a></li>
                                </ul>
                                <div className="nav navbar-nav navbar-right user-nav">
                                        <Dropdown overlay={menu} trigger="click" overlayClassName="navbar-dropdown-menu dropdown profile_menu">
                                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                {username} <CaretDownOutlined />
                                            </a>
                                        </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr style={{"marginTop": "0px" , "marginBottom":"0px" , "border":1 }}/>
                    <div className="fixed-menu" id="cl-wrapper">
                        {this.props.children}
                    </div>
                </div>
                {loading ? <div className="toast_bg">
                    <div className={`toast_box loading`}>
                        <div className={`toast_icon toast_loading`}></div>
                        <div className='toast_text'></div>
                    </div>
                </div> : ''}
            </div>
        );
    }
}

export default dLayouta
