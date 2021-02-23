import React, {Component} from 'react';
import { Redirect, Link } from "react-router-dom";
import {connect} from 'react-redux';
import io from 'socket.io-client';

import history from '@/utils/history'
//检查是否登陆
import {authCheck} from "@/utils/authCheck";
import {accountLogin} from "@/services/api";
import {getRes} from "@/utils";
import schema from 'async-validator';

import { Layout, Menu , Divider, Input, Checkbox} from 'antd';
const { Header, Content, Footer } = Layout;
import 'antd/es/layout/style/css';
import 'antd/es/divider/style/css';
import 'antd/es/input/style/css';
import '@/assets/page.less'

var descriptor = {
    username: {
        type: "string",
        required: true,

    },
    password: {
        type: "string",
        required: true,

    }
};
var validator = new schema(descriptor);

class Index extends Component {
    static displayName='Login';
    constructor(props) {
        super(props);
    }

    state = {
        isAuthenticated: authCheck.isAuthenticated,
        username:"",
        password:"",
        remember:false,
        error:{}
    };
    changeInput(e){
        const {error , remember} = this.state;
        var obj = {};
        const {name,value} = e.target;
        obj[name] = value;

        if(name=='remember'){
            obj[name] = !remember
        }

       this.setState(obj);

       if(error[name]){
           this.setState({error: _.omit(error,name) })
       }
    }
    handleSubmit =   e => {
        e.preventDefault();
            console.log('Received values of form: ', e);
            const {username,password ,remember} = this.state;
            validator.validate({username,password,remember},(errors, fields) => {
                if(errors) {
                    const {error} = this.state;
                    errors.map(item=>{
                        const {field,message} = item;
                        error[field] = message;
                    });
                    this.setState({error})
                }else{
                    accountLogin({username, password, remember }).then(res=>{
                        getRes(res,data=>{
                            sessionStorage.setItem('user',JSON.stringify(res));
                            location.reload();
                        })
                    })
                }
            });
        return false
    };
    componentDidMount() {
        if(this.state.isAuthenticated){
            history.push('/admin')
        }
    }

    render() {
        const {error} = this.state;
        return (
            <Layout className="layout login-page">
                <Header style={{height: "50px"}}>
                    <div className="logo" >CURIE</div>
                    {/*<Menu theme="dark" mode="horizontal" className="header-menu" defaultSelectedKeys={['2']} style={{height: "50px"}}>*/}
                    {/*    <Menu.Item key="1" className="menuItem">nav 1</Menu.Item>*/}
                    {/*    <Menu.Item key="2" className="menuItem">nav 2</Menu.Item>*/}
                    {/*    <Menu.Item key="3" className="menuItem">nav 3</Menu.Item>*/}
                    {/*</Menu>*/}
                </Header>
                <Content className="flex alignStart">
                    <form method="post" className="loginForm">
                            <ul>
                                <li className='login-title'>
                                    Sign In CURIE
                                </li>
                                <li>
                                    <Input type="text" name="username" value={this.state.username} onChange={this.changeInput.bind(this)} className="name" placeholder="UserName" />
                                    <p className="error">{error['username']}</p>
                                </li>
                                <li>
                                    <Input type="password" name="password" value={this.state.password} onChange={this.changeInput.bind(this)}  className="password" placeholder="password" />
                                    <p className="error">{error['password']}</p>
                                </li>
                                <li>
                                    <Checkbox className="checker" type="checkbox" name="remember" checked={this.state.remember}  onChange={this.changeInput.bind(this)}> Remember me </Checkbox>
                                </li>
                                <li className="submit-row">
                                    <Input className="submit-btn" type="submit" onClick={ this.handleSubmit.bind(this)} value="Sign In"/>
                                </li>
                                <li>
                                    Have problem? <Link to={'/contact'} style={{borderBottom: "1px solid"}}>Contact Us.</Link>
                                </li>
                            </ul>
                        </form>
                    <Divider type="vertical" className="login-divider" />
                    <div className="section">
                        <h3>CURIE System</h3>
                        <p>Guide Better. Treat Better.</p>
                    </div>
                </Content>

            {/*<div className="wrapper login-page">*/}
            {/*    <header className="main-header">*/}
            {/*        <span className="logo">CURIE</span>*/}
            {/*        <nav className="navbar" role="navigation"></nav>*/}
            {/*    </header>*/}
            {/*    <div className="w3layouts">*/}
            {/*        <div className="signin-agile">*/}
            {/*            <form id="loginForm" method="post">*/}
            {/*                <ul>*/}
            {/*                    <li>*/}
            {/*                        Sign In CURIE*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <input type="text" name="username" value={this.state.username} onChange={this.changeInput.bind(this)} className="name" placeholder="UserName" />*/}
            {/*                        <p className="error">{error['username']}</p>*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <input type="password" name="password" value={this.state.password} onChange={this.changeInput.bind(this)}  className="password" placeholder="password" />*/}
            {/*                        <p className="error">{error['password']}</p>*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <input type="checkbox" name="remember" value={this.state.remember}  onChange={this.changeInput.bind(this)}  id="brand1"/> Remember me*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <input className="submit-btn" type="submit" onClick={ this.handleSubmit.bind(this)} value="Sign In"/>*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        Have problem? <span style={{borderBottom: "1px solid"}}>Contact Us.</span>*/}
            {/*                    </li>*/}
            {/*                </ul>*/}
            {/*            </form>*/}
            {/*        </div>*/}
            {/*        <div className="mid-line"></div>*/}
            {/*        <div className="signup-agileinfo">*/}
            {/*            <h3>CURIE System</h3>*/}
            {/*            <p>Guide Better. Treat Better.</p>*/}
            {/*        </div>*/}
            {/*        <div className="clear"></div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
)(Index);
