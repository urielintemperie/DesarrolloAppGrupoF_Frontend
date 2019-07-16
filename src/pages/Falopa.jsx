import React, { Component, Fragment } from 'react'
import { getUserEmail } from 'authorization/auth'
import I18n from '../I18n'
import { Button, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom';
import { deleteEventById, confirmAssistance, reserveProduct, getEventById } from '_api'
import Select from 'react-select'



function Falopa(props) {

    if (props.event.eventType === "Basket") {
        return (<BasketDisplay event={props.event} id={props.event.id} />)
    }

    if (props.event.eventType === "Party") {
        return (<PartyDisplay event={props.event} />)
    }

    if (props.event.eventType === "Collect") {
        return (<CollectDisplay event={props.event} />)
    }

    return (null)

}

class BasketDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            basket: {}
        }

        this.updateEvent = this.updateEvent.bind(this)
    }

    componentDidMount() {
        getEventById(this.props.id)
            .then((result) => {
                const event = result.data
                this.setState({
                    basket: event
                })
            })
    }

    updateEvent(event) {
        this.setState({ basket: event })
    }

    render() {
        if (Object.keys(this.state.basket).length) {
            return (
                <Fragment>
                    <GenericEventInfo event={this.state.basket} updateBasket={this.updateEvent} />
                </Fragment>)
        } else {
            return false
        }
    }
}


function PartyDisplay(props) {
    return (
        <Fragment>
            <h1>PARTY</h1>
            <h3>Fecha para confirmar: {props.event.deadlineConfirmation.split("T00:00:00")}</h3>
            <GenericEventInfo event={props.event} />

        </Fragment>)
}

function CollectDisplay(props) {
    return (
        <Fragment>
            <h1>COLLECT</h1>
            <GenericEventInfo event={props.event} />
        </Fragment>)
}

class GenericEventInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            attendees: props.event.attendees
        }

        this.updateAttendees = this.updateAttendees.bind(this)
    }

    componentWillReceiveProps(newProps) {
        this.setState({ event: newProps.event });
    }

    updateAttendees(newAttendees) {
        this.setState({ attendees: newAttendees })
    }


    render() {
        const guests =
            <Fragment>
                <dt>Invitados</dt>
                <MailList mails={this.props.event.guestsMails} />
                {/* <h3>Invitados</h3>
                <MailList mails={this.props.event.guestsMails} /> */}
            </Fragment>


        const isMyEvent = (this.props.event.creatorEmail === getUserEmail())

        return (
            <Fragment>

                <dl class="dl-horizontal">
                <dt><I18n id="eventDisplay.eventName" /></dt>
                <dd>{this.props.event.name}</dd>
                <dt><I18n id="eventDisplay.eventDescription" /></dt>
                <dd>{this.props.event.description}</dd>
                <dt><I18n id="eventDisplay.eventDate" /></dt>
                <dd>{this.props.event.dayOfEvent.split("T00:00:00")}</dd>
                <dt>Creador</dt>
                <dd>{this.props.event.creatorEmail}</dd>
                {this.props.event.guestsMails.length === 0 ? "" : guests}
                <dt>Asistentes</dt>
                <MailList mails={this.state.attendees} />
                {this.props.event.productsNeeded.length === 0 ? "" : <ProductsDisplay attendees={this.state.attendees.length} productsNeeded={this.props.event.productsNeeded} type={this.props.event.eventType} myEvent={isMyEvent} />}
                </dl>
                {/* <h3><I18n id="eventDisplay.eventName" /> {this.props.event.name}</h3>
                <h3><I18n id="eventDisplay.eventDescription" /> {this.props.event.description}</h3>
                <h3><I18n id="eventDisplay.eventDate" /> {this.props.event.dayOfEvent.split("T00:00:00")}</h3>
                <h3>Creador: {this.props.event.creatorEmail}</h3>
                {this.props.event.guestsMails.length === 0 ? "" : guests}

                <h3>Asistentes</h3>
                <MailList mails={this.state.attendees} />
                {this.props.event.productsNeeded.length === 0 ? "" : <ProductsDisplay attendees={this.state.attendees.length} productsNeeded={this.props.event.productsNeeded} type={this.props.event.eventType} myEvent={isMyEvent} />} */}
                <GenericButtons updateBasket={this.props.updateEvent} updateAttendees={this.updateAttendees} creator={this.props.event.creatorEmail} event={this.props.event} />
            </Fragment>)
    }
}

class GenericButtons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            disableConfirm: this.props.event.attendees.includes(getUserEmail()),
            isMyEvent: (this.props.creator === getUserEmail()),
            party: this.props.event.eventType === "Party",
            basket: (this.props.event.eventType === "Basket"),
            collect: false
        }

        this.deleteEvent = this.deleteEvent.bind(this)
        this.confirmAssistance = this.confirmAssistance.bind(this)
        this.partyCalculateCost = this.partyCalculateCost.bind(this)
        this.collectCalculateCost = this.collectCalculateCost.bind(this)
    }

    deleteEvent() {
        deleteEventById(this.props.event.id)
    }

    confirmAssistance() {
        if (this.props.event.eventType === "Party") { this.setState({ party: true }) }
        if (this.props.event.eventType === "Basket") { this.setState({ basket: true }) }
        if (this.props.event.eventType === "Collect") { this.setState({ collect: true }) }
        this.setState({ disableConfirm: true })
        confirmAssistance(this.props.event.id)
            .then((result) => {
                const event = result.data
                this.props.updateAttendees(event.attendees)
            })

    }

    partyCalculateCost() {
        return this.props.event.productsNeeded.map((item) => item.product.price).reduce((a, b) => a + b, 0)
    }

    collectCalculateCost() {

        if (this.props.event.attendees.length === 0) {
            return this.partyCalculateCost()
        } else {
            return (this.props.event.productsNeeded.map((item) => item.product.price).reduce((a, b) => a + b, 0) / this.props.event.attendees.length)
        }
    }

    render() {

        const myButtons =
            <Fragment>

                <Button color="primary" onClick={this.confirmAssistance} disabled={this.state.disableConfirm}><I18n id="eventDisplay.confirmAssistanceButton" /></Button>
                <Link to={`/event/edit/${this.props.event.id}`}><Button color="primary"><I18n id="eventDisplay.editEventButton" /></Button></Link>
                <Button color="danger" onClick={this.deleteEvent}><I18n id="eventDisplay.deleteEventButton" /></Button>
            </Fragment>

        const otherButtons = <Button color="primary" onClick={this.confirmAssistance} disabled={this.state.disableConfirm}><I18n id="eventDisplay.confirmAssistanceButton" /></Button>

        return (
            <Fragment>
                {this.state.basket && <BasketConfirmationInfo updateBasket={this.props.updateBasket} event={this.props.event} />}
                <br></br><br></br>
                {this.state.isMyEvent && myButtons}
                {!this.state.isMyEvent && otherButtons}
            </Fragment>
        )
    }
}

class BasketConfirmationInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: "",
            reservedProducts: props.event.reservedProducts,
            missingProducts: props.event.missingProducts

        }

        this.onChange = this.onChange.bind(this)
        this.reserveProduct = this.reserveProduct.bind(this)
    }

    componentWillReceiveProps({ event }) {
        this.setState({ ...this.state, event })
    }

    onChange(value) {
        this.setState({ product: value.substr(0, value.indexOf(' - ')) })
    }

    reserveProduct() {
        reserveProduct(this.props.event.id, this.state.product)
            .then((event) => {
                this.setState({ reservedProducts: event.reservedProducts, missingProducts: event.missingProducts })
            })
    }

    render() {
        return (
            <Fragment>
                <dt>Productos reservados</dt>
                {/* <h3>Productos reservados</h3> */}
                <MailList mails={this.state.reservedProducts} />
                <ProductsSelector onChange={this.onChange} products={this.state.missingProducts} />
                <Button color="primary" onClick={this.reserveProduct}><I18n id="eventDisplay.basket.reserveProductButton" /></Button>
            </Fragment>
        )
    }

}

class ProductsSelector extends Component {

    handleChange = value => {
        this.props.onChange(value.label)

    }

    componentWillReceiveProps({ products }) {
        this.setState({ ...this.state, products })
    }

    render() {
        let options = []
        this.props.products.map((product) => options.push({ value: product.product.name, label: product.product.name + " - " + product.amount + " unidades" }))

        return (
            <Fragment>
                <dt><I18n id="eventDisplay.basket.products" /></dt>
                {/* <h3><I18n id="eventDisplay.basket.products" /></h3> */}

                <Select
                    defaultValue={options.length === 0 ? "" : options[0]}
                    options={options}
                    isMulti={false}
                    onChange={this.handleChange}
                    value={this.props.value}
                />
            </Fragment>
        )
    }
}

var listId = 0;
function uniqueListId() {
    return listId++;
}

class MailList extends Component {


    componentWillReceiveProps(newProps) {
        this.setState({ mails: newProps.mails });
    }

    render() {
        return (
            <Fragment>

                {
                    (this.props.mails.length == 0) ?
                    (<dl>~</dl>)
                    :
                    (
                    this.props.mails.map((mail) => {
                        return (
                            <dl key={uniqueListId()}>{mail}</dl>
                            // <h4 key={uniqueListId()}>{mail}</h4>
                        )
                    })
                    )
                }
            </Fragment>
        )
    }

}

function ProductsDisplay(props) {

    function partyPrice() {
        var prices = []
        props.productsNeeded.map((product) => prices.push(product.product.price * (product.amount * props.attendees)))
        return prices.reduce((a, b) => a + b, 0)
    }

    function collectPrice() {
        var prices = []
        props.productsNeeded.map((product) => prices.push(product.product.price * (product.amount * props.attendees)))
        if (props.attendees === 0) {
            return partyPrice()
        } else {
            return prices.reduce((a, b) => a + b, 0) / props.attendees
        }

    }

    return (

        < Fragment >
            <dt>Tipo de evento</dt>
            <dl>{props.type}</dl>
            <dt>Lista de productos</dt>
            {/* <h3>Lista de productos</h3>
            <h1>{props.type}</h1>
            <h1>{props.myEvent.toString()}</h1> */}

            <table class="table table-sm">
            <thead>
                <tr>
                    <th scope="col"><I18n id="eventDisplay.product.product" /></th>
                    <th scope="col"><I18n id="eventDisplay.product.quantity" /></th>
                    <th scope="col"><I18n id="eventDisplay.product.price" /></th>
                </tr>
            </thead>
            <tbody>
                {props.productsNeeded.map((product) => {
                    return (
                        <tr key={uniqueListId()}>
                            <td>{product.product.name}</td>
                            <td>{props.attendees === 0 ? product.amount : product.amount * props.attendees}</td>
                            <td>{props.attendees === 0 ? product.product.price : product.product.price * (product.amount * props.attendees)}</td>
                        </tr>
                    )
                }

                )
                }
            </tbody>
            </table>

            {/* <Row>
                <Col><h6><I18n id="eventDisplay.product.product" /></h6></Col>
                <Col><h4><I18n id="eventDisplay.product.quantity" /></h4></Col>
                <Col><h4><I18n id="eventDisplay.product.price" /></h4></Col>
            </Row> 

             {props.productsNeeded.map((product) => {
                return (
                    <Row key={uniqueListId()}>

                        <Col>{product.product.name}</Col>
                        <Col>{props.attendees === 0 ? product.amount : product.amount * props.attendees}</Col>
                        <Col>{props.attendees === 0 ? product.product.price : product.product.price * (product.amount * props.attendees)}</Col>
                    </Row>
                )
            }

            )
            } */}


            <h3>{props.type === "Collect" && (collectPrice() !== 0) ? "Deberias pagar: $" + collectPrice() : ""}</h3>
            <h3>{props.type === "Party" && (partyPrice() !== 0) && props.myEvent ? "Total a pagar: $" + partyPrice() : ""}</h3>

        </Fragment >
    )
}

export default Falopa


