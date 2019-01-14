import React, {Component} from 'react';
import auth from './Authorization';
import history from './history';
import {Router, Route, Switch, Redirect} from 'react-router-dom';
import './App.css';
import Callback from "./Callback";
import MainOpenRoute from "./routes/MainOpenRoute";
import AdminRoute from "./routes/AdminRoute";

class App extends Component {

    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path='/callback' component={Callback} />
                    <Route path='/admin' render={(props) => auth.getIdToken() ? <AdminRoute {...props}/> : <Redirect to={'/'} /> } />
                    <Route path='/' render={() => <MainOpenRoute startAuth={auth.login}/>} />
                </Switch>
            </Router>
        )
    }
}

export default App;
