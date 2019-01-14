import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import auth from '../Authorization';

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
            utilization: '',
            paymentHistory: '',
            accountAge: '',
            numAccounts: '',
            creditInquiries: '',
            derogatoryMarks: '',
        },
        child: {
            utilization: '',
            paymentHistory: '',
            accountAge: '',
            numAccounts: '',
            creditInquiries: '',
            derogatoryMarks: '',
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
        if (parent) this.setState(prevState => ({parent}));
        if (child) this.setState(prevState => ({child}));
    }
    handleTextChange = (group, prop) => (e) => {
        const newVal = e.target.value;
        this.setState((prevState) => ({
            [group]: {
                ...prevState[group],
                [prop]: newVal
            }
        }))
    }
    handleFormSubmit = (kind) => async e => {
        const routeMap = {
            child: 'kidkreditdashboard',
            parent: 'parentkreditdashboard'
        };

        const fetchResult = await fetch(API_URL + routeMap[kind], {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth.getIdToken()
            },
            method: 'PUT',
            body: JSON.stringify(this.state[kind])
        });
        if (fetchResult.status === 200)
            this.displaySnackBar()
        else
            alert('Something went wrong, try again later');
    }
    render() {

        return (
            <Grid container spacing={16} style={{maxWidth: 800, margin: '2rem auto'}}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography color={"textSecondary"}>
                                KiddieKredit
                            </Typography>
                            <Typography variant={"h5"} component={"h2"}>
                                Educational Info Administration - Parent
                            </Typography>
                            <div className={"form-container"}>
                                {
                                    this.state.keys.map((attr, idx) => (
                                        <TextField
                                            key={attr}
                                            value={this.state.parent[attr]}
                                            onChange={this.handleTextChange('parent', attr)}
                                            multiline
                                            id={attr}
                                            label={this.state.labels[idx]}
                                            margin="normal"
                                        />
                                    ))
                                }
                            </div>
                            <Button variant={"contained"} color={'primary'} onClick={this.handleFormSubmit('parent')}>Save Changes</Button>
                            <br />
                            <br />
                            <br />
                            <Typography variant={"h5"} component={"h2"}>
                                Educational Info Administration - Child
                            </Typography>
                            <div className={"form-container"}>
                                {
                                    this.state.keys.map((attr, idx) => (
                                        <TextField
                                            key={attr}
                                            value={this.state.child[attr]}
                                            onChange={this.handleTextChange('child', attr)}
                                            multiline
                                            id={attr}
                                            label={this.state.labels[idx]}
                                            margin="normal"
                                        />
                                    ))
                                }
                            </div>
                            <Button variant={"contained"} color={'primary'} onClick={this.handleFormSubmit('child')}>Save Changes</Button>
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