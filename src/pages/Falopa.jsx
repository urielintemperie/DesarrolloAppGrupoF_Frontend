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
                console.log("COMPONENT WILL Mount messages : ", event);
                this.setState({
                    basket: event
                })
            })
    }

    updateEvent(event) {
        this.setState({ basket: event })
        console.log("UPDATE EL EVENTO YAY")
    }

    render() {
        if (Object.keys(this.state.basket).length) {
            return (
                <Fragment>
                    <GenericEventInfo event={this.state.basket} />
                    <GenericButtons updateBasket={this.updateEvent} creator={this.state.basket.creatorEmail} event={this.state.basket} />
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
            <GenericButtons creator={props.event.creatorEmail} event={props.event} />
        </Fragment>)
}

function CollectDisplay(props) {
    return (
        <Fragment>
            <h1>COLLECT</h1>
            <GenericEventInfo event={props.event} />
            <GenericButtons creator={props.event.creatorEmail} event={props.event} />
        </Fragment>)
}

class GenericEventInfo extends Component {

    componentWillReceiveProps(newProps) {
        this.setState({ event: newProps.event });
    }

    render() {
        const guests =
            <Fragment>
                <h3>Invitados</h3>
                <MailList mails={this.props.event.guestsMails} />
            </Fragment>

        const attendees =
            <Fragment>
                <h3>Asistentes</h3>
                <MailList mails={this.props.event.attendees} />
            </Fragment>

        return (
            <Fragment>
                {console.log("HICE EL UPDATE PORONGA ESTE")}
                <h3><I18n id="eventDisplay.eventName" /> {this.props.event.name}</h3>
                <h3><I18n id="eventDisplay.eventDescription" /> {this.props.event.description}</h3>
                <h3><I18n id="eventDisplay.eventDate" /> {this.props.event.dayOfEvent.split("T00:00:00")}</h3>
                <h3>Creador: {this.props.event.creatorEmail}</h3>
                {this.props.event.guestsMails.length === 0 ? "" : guests}
                {this.props.event.attendees.length === 0 ? "" : attendees}
                {this.props.event.productsNeeded.length === 0 ? "" : <ProductsDisplay productsNeeded={this.props.event.productsNeeded} />}

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
                console.log("MI EVENTO CONFIRMADO : ", event);
                this.props.updateBasket(event)
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
                {this.state.party && <h1>EL COSTO TOTAL ES: ${this.partyCalculateCost()}</h1>}

                <Button color="primary" onClick={this.confirmAssistance} disabled={this.state.disableConfirm}><I18n id="eventDisplay.confirmAssistanceButton" /></Button>
                <Link to={`/event/edit/${this.props.event.id}`}><Button color="primary"><I18n id="eventDisplay.editEventButton" /></Button></Link>
                <Button color="danger" onClick={this.deleteEvent}><I18n id="eventDisplay.deleteEventButton" /></Button>
            </Fragment>

        const otherButtons = <Button color="primary" onClick={this.confirmAssistance} disabled={this.state.disableConfirm}><I18n id="eventDisplay.confirmAssistanceButton" /></Button>

        return (
            <Fragment>
                {this.state.collect && <h1>TU PARTE DEL EVENTO ES: ${this.collectCalculateCost()}</h1>}
                {this.state.basket && <BasketConfirmationInfo updateBasket={this.props.updateBasket} event={this.props.event} />}
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
                this.props.updateBasket(event)
            })

    }



    render() {
        return (
            <Fragment>
                <h3>Productos reservados</h3>

                <MailList mails={this.props.event.reservedProducts} />
                <ProductsSelector onChange={this.onChange} products={this.props.event.missingProducts} />
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
                <h3><I18n id="eventDisplay.basket.products" /></h3>

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
                {console.log("UPDATE LA PIJA ESTA DE LISTA")}
                {this.props.mails.map((mail) => {
                    return (
                        <h4 key={uniqueListId()}>{mail}</h4>
                    )
                }
                )}
            </Fragment>
        )
    }

}

function ProductsDisplay(props) {
    return (
        <Fragment>
            <h3>Lista de productos</h3>
            <Row>
                <Col><h4><I18n id="eventDisplay.product.product" /></h4></Col>
                <Col><h4><I18n id="eventDisplay.product.quantity" /></h4></Col>
                <Col><h4><I18n id="eventDisplay.product.price" /></h4></Col>
            </Row>
            {props.productsNeeded.map((product) => {
                return (
                    <Row key={uniqueListId()}>
                        <Col>{product.product.name}</Col>
                        <Col>{product.product.price}</Col>
                        <Col>{product.amount}</Col>
                    </Row>
                )
            }
            )}
        </Fragment>
    )
}

export default Falopa


