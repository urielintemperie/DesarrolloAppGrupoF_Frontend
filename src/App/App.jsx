import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../_helpers';
import { alertActions } from '_actions';
import { PrivateRoute } from '../_components';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import LoanPage from '../pages/AccountPage/LoanPage'
import {NewEventForm, NewTemplateForm }from '../pages/NewEventPage/NewEventForm'
import { actions as i18nActions } from '_reducers/i18n'
import NavBar from 'NavBar'
import Callback from 'authorization/Callback'
import AccountPage from '../pages/AccountPage/AccountPage'
import { EditEventPage } from '../pages/EditEventPage/EditEventPage';
import HomePageCami from 'pages/HomePage/HomePageCami'





function NoMatch({ location }) {
    return <h1>404 Not Found for: <br /> {location.pathname}</h1>;
}

class App extends React.Component {
    constructor(props) {
        super(props);

        const { clearAlerts } = this.props;

        history.listen((location, action) => {
            // clear alert on location change
            clearAlerts()
        });
    }

    componentDidMount() {
        const { fetchTranslations } = this.props;
        fetchTranslations()
    }

    render() {
        const { alert } = this.props;
        return (
            <div className="jumbotron">
                <div className="container">
                    {/* <div className="col-sm-8 col-sm-offset-2"> */}
                        {alert.message &&
                            <div className={`alert ${alert.type}`}>{alert.message}</div>
                        }

                        <Router history={history}>
                            <div>

                                <NavBar />
                                <Switch>
                                    <PrivateRoute exact path="/" component={HomePageCami} />
                                    <Route path="/register" component={RegisterPage} />
                                    <Route path="/event/new" component={NewEventForm} />
                                    <Route path="/template/new" component={NewTemplateForm} />
                                    <Route path="/callback" component={Callback} />
                                    <Route path="/account" component={AccountPage} />
                                    <Route path="/loan" component={LoanPage} />
                                    <Route path="/home" component={HomePageCami}/>
                                    <Route path="/event/edit/:eventId" component={EditEventPage} />
                                    <Route component={NoMatch} />
                                </Switch>

                            </div>
                        </Router>
                    {/* </div> */}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

function mapDispatchToProps(dispatch) {
    return {
        clearAlerts: () => { dispatch(alertActions.clear()); }, fetchTranslations: () => { dispatch(i18nActions.fetch()) }
    }
}

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App }; 