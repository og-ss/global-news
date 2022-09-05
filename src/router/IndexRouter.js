import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import Login from '../views/login/Login'

export default function IndexRouter() {
    return (
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login} />
                {/* <Route path='/' component={NewsSandBox} /> */}
                <Route path='/' render={() => localStorage.getItem("token") ? <NewsSandBox></NewsSandBox> : 
                <Redirect to='/login'/>
                } />
            </Switch>
        </HashRouter>
    )
}
