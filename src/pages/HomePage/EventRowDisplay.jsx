import React, { Fragment, Component } from 'react'
import { Pagination, PaginationItem, PaginationLink} from 'reactstrap'
import Box from '@material-ui/core/Box'
import CardEvent from './CardEvent'

class EventRowDisplay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage: 0,
            page: 0,
            limit: 5
        }

        this.prevPage = this.prevPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.goToPage = this.goToPage.bind(this)
    }

    componentDidMount() {
        this.props.fetchEvents(this.state.currentPage, this.state.limit)
        this.setState({ page: this.state.page + 1 })
    }

    nextPage() {
        if (!(this.state.page >= this.props.totalPages)) {
            this.props.fetchEvents(this.state.page, this.state.limit)
            this.setState({ page: this.state.page + 1, currentPage: this.state.currentPage + 1 })
            console.log("me fui a la proxima pagina")
        } else {
            console.log("no me puedo ir a la siguiente pagina")
        }
    }

    prevPage() {
        if ((this.state.currentPage) > 0) {
            this.props.fetchEvents((this.state.page - 2), this.state.limit)
            this.setState({ page: this.state.page - 1, currentPage: this.state.currentPage - 1 })
            console.log("me fui a la previa pagina")
        } else {
            console.log("no me puedo ir a la pagina previa")
        }
    }

    goToPage(page) {
        this.setState({ page: page + 1, currentPage: page })
        this.props.fetchEvents(page, this.state.limit)
        console.log("fui a la pagina: " + page)
    }

    render() {
        return (
            <Fragment>
                <div className="card-body">
                <EventsCardDisplay events={this.props.events} />
                </div>
                <div class="card-footer">
                <EventPagination totalPages={this.props.totalPages} nextPage={this.nextPage} prevPage={this.prevPage} goToPage={this.goToPage} />
                </div>
            </Fragment>
        )
    }
}


var eventCardId = 0
function uniqueEventId() {
    return eventCardId++;
}

function EventsCardDisplay(props) {
    return (
        <Box display="flex" flexDirection="row">
            {props.events.map((event) => {
                return (
                    <CardEvent key={uniqueEventId()} event={event} />
                )
            })}
        </Box>
    )
}



function EventPagination(props) {

    const items = []

    function goToPage(num) {
        return () => props.goToPage(num)
    }

    for (var i = 1; i <= props.totalPages; i++) {
        items.push(
            <PaginationItem key={i}>
                <PaginationLink onClick={goToPage(i - 1)}>
                    {i}
                </PaginationLink>
            </PaginationItem>)
    }

    return (
        <Pagination>
            <PaginationItem>
                <PaginationLink first onClick={goToPage(0)} />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink previous onClick={props.prevPage} />
            </PaginationItem>
            {items}
            <PaginationItem>
                <PaginationLink next onClick={props.nextPage} />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink last onClick={goToPage(props.totalPages - 1)} />
            </PaginationItem>
        </Pagination>
    )
}

export default EventRowDisplay