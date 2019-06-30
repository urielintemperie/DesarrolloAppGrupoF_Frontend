import React, { Fragment } from 'react'
import EventRowDisplay from './EventRowDisplay'
import { connect } from 'react-redux'
import { selectors as eventSelectors, actions as eventActions } from '_reducers/event'

function EventListDisplay(props) {

    return (
        <Fragment>
            <OngoingEvent events={props.ongoingEvents} totalPages={props.ongoingPagesNumber} fetchEvents={props.fetchOngoing} />
            <PopularEvent events={props.popularEvents} totalPages={props.popularPagesNumber} fetchEvents={props.fetchPopular} />
            <LastEvent events={props.lastEvents} totalPages={props.lastPagesNumber} fetchEvents={props.fetchLast} />
        </Fragment>
    )
}

function OngoingEvent(props) {
    return (
        <Fragment>
            <h3>Eventos en curso:</h3>
            <EventRowDisplay events={props.events} totalPages={props.totalPages} fetchEvents={props.fetchEvents} />
        </Fragment>
    )
}

function PopularEvent(props) {
    return (
        <Fragment>
            <h3>Eventos populares:</h3>
            <EventRowDisplay events={props.events} totalPages={props.totalPages} fetchEvents={props.fetchEvents} />
        </Fragment>
    )
}

function LastEvent(props) {
    return (
        <Fragment>
            <h3>Ultimos eventos:</h3>
            <EventRowDisplay events={props.events} totalPages={props.totalPages} fetchEvents={props.fetchEvents} />
        </Fragment>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        fetchOngoing: (page, size) => { dispatch(eventActions.fetchOngoingEvents(page, size)) },
        fetchPopular: (page, size) => { dispatch(eventActions.fetchPopularEvents(page, size)) },
        fetchLast: (page, size) => { dispatch(eventActions.fetchLastEvents(page, size)) }
    }
}

function mapStateToProps(state) {
    return {
        ongoingPagesNumber: eventSelectors.getOngoingTotalPages(state),
        popularPagesNumber: eventSelectors.getPopularTotalPages(state),
        lastPagesNumber: eventSelectors.getLastTotalPages(state),
        ongoingEvents: eventSelectors.getOngoingEvents(state),
        popularEvents: eventSelectors.getPopularEvents(state),
        lastEvents: eventSelectors.getLastEvents(state)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EventListDisplay)

