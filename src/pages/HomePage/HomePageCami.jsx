import React, { Component, Fragment } from 'react'
import {Button} from 'reactstrap'
import { history } from '_helpers';
import EventListDisplay from './EventListDisplay'
import I18n from '../../I18n'


class HomePageCami extends Component {
    render() {
        return (
            <Fragment>
                <h1><I18n id="homePage.title"/></h1>
                <CreateEventButton />
                <GoToAccountButton />
                <EventListDisplay/>
            </Fragment>
        )
    }
}


function CreateEventButton(props) {

    function goToCreateEvent() {
        history.push('/event/new');
    }

    return (<Button color="primary" onClick={goToCreateEvent}><I18n id="homePage.createEvent"/></Button>)
}

function GoToAccountButton(props) {

    function goToAccount() {
        history.push('/account');
    }

    return (<Button color="primary" onClick={goToAccount}><I18n id="homePage.account"/></Button>)
}

export default HomePageCami