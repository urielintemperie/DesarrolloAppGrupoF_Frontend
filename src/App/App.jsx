import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import NewEventForm from '../NewEventPage/NewEventForm'
import {actions as i18nActions} from '_reducers/i18n'
import LanguageSelector from '../LanguageSelector'


class App extends React.Component {
    constructor(props) {
        super(props);

        const { clearAlerts } = this.props;
        
        history.listen((location, action) => {
            // clear alert on location change
           clearAlerts()
        });
    }

    componentDidMount(){
        const {fetchTranslations} = this.props;
        fetchTranslations()
    }

    render() {
        const { alert } = this.props;
        return (
            <div className="jumbotron">
                <div className="container">
                    <div className="col-sm-8 col-sm-offset-2">
                        {alert.message &&
                            <div className={`alert ${alert.type}`}>{alert.message}</div>
                        }
                        <LanguageSelector/>
                        <Router history={history}>
                            <div>
                                <PrivateRoute exact path="/" component={HomePage} />
                                <Route path="/login" component={LoginPage} />
                                <Route path="/register" component={RegisterPage} />
                                <Route path="/event/new" component={NewEventForm} />   
                            </div>
                        </Router>
                    </div>
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

function mapDispatchToProps(dispatch){
    return {
        clearAlerts: ()=> { dispatch(alertActions.clear());},fetchTranslations: ()=> {dispatch(i18nActions.fetch())}
    }
}

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App }; 