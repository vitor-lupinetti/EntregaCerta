import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import Checkout from './pages/Checkout/Checkout';
import Done from './pages/Done/Done';
import { EntregaCerta } from './pages/EntregaCerta/EntregaCerta';
import Home from './pages/Home/Home';
import { Login } from './pages/Login/Login';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact/>
            <Route component={Checkout} path="/checkout"/>
            <Route component={Login} path="/login"/>
            <Route component={EntregaCerta} path="/EntregaCerta"/>
            <Route component={Done} path="/Finish"/>
        </BrowserRouter>
    )
}

export default Routes;