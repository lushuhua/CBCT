import React from 'react';
import {  HashRouter as Router, Route, Switch, Link,browserHistory  } from "react-router-dom";
import { Provider } from "react-redux"

import asyncComponent from '@/utils/asyncComponent'
import PrivateRoute from '@/components/PrivateRoute'


import CRouter from './routes/index'

//按需加载组件
const Login = asyncComponent(()=>import('./pages/login/index'));
const Contact = asyncComponent(()=>import('./pages/contact'));
//404页面
import notFound from './pages/notFound'

const App = (props) => {
    return (
            <Router>
                <Switch>
                        <Route path="/login" exact component={Login} />
                        <Route path="/contact"  component={Contact} />
                        <PrivateRoute path="/" component={CRouter} />

                        <Route component={notFound} />
                </Switch>
            </Router>
    );
};

export default App;
