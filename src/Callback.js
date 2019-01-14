import React, { Component } from 'react';
import auth from './Authorization';

class Callback extends Component {
    async componentDidMount() {
        console.log(this.props);
        const authResult = await auth.handleAuthentication();
        if (authResult === true)
            this.props.history.push('/admin');
    }
    render() {
        return (
            <div className={'app'}>
                loading...
            </div>
        );
    }
}

export default Callback;