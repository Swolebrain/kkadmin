import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Fab from '@material-ui/core/Fab';
import auth from '../Authorization';
import EditEducationalInfo from "./EditEducationalInfo";
import {Route, Switch} from "react-router";
import {Link, NavLink} from "react-router-dom";

const API_URL = 'http://api.kiddiekredit.com:8080/educationalinfo/';



/**
 * utilization: '',
 paymentHistory: '',
 accountAge: '',
 numAccounts: '',
 creditInquiries: '',
 derogatoryMarks: '',
 */
class AdminRoute extends Component {
    state = {
        parent: {
            utilization: [''],
            paymentHistory: [''],
            accountAge: [''],
            numAccounts: [''],
            creditInquiries: [''],
            derogatoryMarks: [''],
        },
        child: {
            utilization: [''],
            paymentHistory: [''],
            accountAge: [''],
            numAccounts: [''],
            creditInquiries: [''],
            derogatoryMarks: [''],
        },
        keys: ['utilization', 'paymentHistory', 'accountAge', 'numAccounts', 'creditInquiries', 'derogatoryMarks'],
        labels: ['Utilization', 'Payment History', 'Account Age', 'Num Accounts', 'Credit Inquiries', 'Derogatory Marks'],
        snackbarVisible: false
    }
    displaySnackBar = () => {
        if (this.timeout) clearTimeout(this.timeout);
        this.setState(() => ({snackbarVisible: true}));
        this.timeout = setTimeout(() =>
            this.setState(() => ({snackbarVisible: false}))
        , 1250);
    }
    async componentDidMount() {
        console.log(auth.getIdToken())
        const [parent, child] = await Promise.all([
            fetch(API_URL + 'parentkreditdashboard', {headers: {Authorization: 'Bearer ' + auth.getIdToken()}}).then(res => res.json()),
            fetch(API_URL + 'kidkreditdashboard', {headers: {Authorization: 'Bearer ' + auth.getIdToken()}}).then(res => res.json())
        ]);
        for (let prop in parent)
            if (prop !== '_id' && typeof parent[prop] === 'string') parent[prop] = parent[prop].split('|');
            else delete parent[prop];

        for (let prop in child)
            if (prop !== '_id' && typeof child[prop] === 'string') child[prop] = child[prop].split('|');
            else delete child[prop];

        console.log(parent, child);

        if (parent && child) this.setState(() => ({parent, child}));
    }
    addNewParagraph = (group, prop) => () => this.setState((prevState) => ({
        [group]: {
            ...prevState[group],
            [prop]: prevState[group][prop].concat([''])
        }
    }))
    deleteParagraph = (group, prop, paragraphIdxToDelete) => () => this.setState((prevState) => ({
        [group]: {
            ...prevState[group],
            [prop]: prevState[group][prop].filter((_, i) => i !== paragraphIdxToDelete)
        }
    }))
    handleTextChange = (group, prop, paragraphNumber) => (e) => {
        const newVal = e.target.value;
        this.setState((prevState) => ({
            [group]: {
                ...prevState[group],
                [prop]: [
                    ...prevState[group][prop].slice(0, paragraphNumber),
                    newVal,
                    ...prevState[group][prop].slice(paragraphNumber+1),
                ]
            }
        }))
    }
    handleFormSubmit = (kind) => async e => {
        const routeMap = {
            child: 'kidkreditdashboard',
            parent: 'parentkreditdashboard'
        };
        const payload = {};
        for (let key in this.state[kind]){
            console.log(key);
            payload[key] = this.state[kind][key].join('|');
        }

        const fetchResult = await fetch(API_URL + routeMap[kind], {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth.getIdToken()
            },
            method: 'PUT',
            body: JSON.stringify(payload)
        });
        if (fetchResult.status === 200)
            this.displaySnackBar()
        else
            alert('Something went wrong, try again later');
    }
    render() {
        const {pathname} = this.props.location;
        return (
            <Grid container spacing={16} style={{maxWidth: 800, margin: '2rem auto'}}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant={"h5"} component={"h3"}>
                                Educational Info Administration
                            </Typography>
                            <NavLink to={'/admin'}>
                                <Button color={pathname === '/admin' ? 'primary' : 'disabled'}>
                                    Parent
                                </Button>
                            </NavLink>
                            <NavLink to={'/admin/child'}>
                                <Button color={pathname === '/admin/child' ? 'primary' : 'disabled'}>
                                    Child
                                </Button>
                            </NavLink>
                            <Switch>
                                <Route path={'/admin/child'} render={() => <EditEducationalInfo
                                    formKeys={this.state.keys}
                                    labels={this.state.labels}
                                    segmentType={'child'}
                                    values={this.state.child}
                                    handleTextChange={this.handleTextChange}
                                    addNewParagraph={this.addNewParagraph}
                                    handleFormSubmit={this.handleFormSubmit}
                                />}
                                />
                                <Route path={'/admin'} render={() => <EditEducationalInfo
                                        formKeys={this.state.keys}
                                        labels={this.state.labels}
                                        segmentType={'parent'}
                                        values={this.state.parent}
                                        handleTextChange={this.handleTextChange}
                                        addNewParagraph={this.addNewParagraph}
                                        deleteParagraph={this.deleteParagraph}
                                        handleFormSubmit={this.handleFormSubmit}
                                    />}
                                />
                            </Switch>
                        </CardContent>
                    </Card>
                </Grid>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
                    open={this.state.snackbarVisible}
                    onClose={()=>this.setState(() => ({snackbarVisible: false}))}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Data Saved!</span>}
                />
            </Grid>
        );
    }
}

export default AdminRoute;