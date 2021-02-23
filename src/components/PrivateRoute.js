import React, { Component } from "react";
import {Route, Link, Redirect, withRouter} from "react-router-dom";
import {authCheck} from "@/utils/authCheck";
import helper from "../utils/helper";

//私有路由，只有登录的用户才能访问
class PrivateRoute extends React.Component{
    state={isAuthenticated:false}
    componentWillMount(){
        const  isAuthenticated =  authCheck.isAuthenticated  ;
        this.setState({isAuthenticated})
         if(!isAuthenticated){
            const {history} = this.props;
            setTimeout(() => {
                // history.replace("/login");
            }, 1000)
        }
    }
    render(){
        let { component: Component,path="/",exact=false,strict=false} = this.props;
        return this.state.isAuthenticated ?  (
            <Route  path={path} exact={exact}  strict={strict}  render={(props)=>( <Component {...props} /> )} />
        ) : (<Redirect to="/login" />);
    }
}
export default withRouter(PrivateRoute);