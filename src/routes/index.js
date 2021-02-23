import React, { Component } from 'react';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import AllComponents from '../pages';
import routesConfig from './config';
import queryString from 'query-string';
import PrivateRoute from '@/components/PrivateRoute'
export default class CRouter extends Component {
    render() {
        const getRoutes = (routes)=>{
            if(routes){
             return routes.map(item=>{
                    if(item.component){
                        return <PrivateRoute key={item.key} path={item.key} exact component={AllComponents[item.component]} />
                    }else if(item.subs){
                       return  getRoutes(item.subs)
                    }
                })
            }
        };
        return (
            <React.Fragment>
                {Object.keys(routesConfig).map(mainKey=>getRoutes(routesConfig[mainKey]))}
            </React.Fragment>
        )
    }
}