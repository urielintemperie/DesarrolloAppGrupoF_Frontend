import React, { Component, Fragment } from 'react'
import { Button, Row, Col } from 'reactstrap'
import Select from 'react-select'
import I18n from '../I18n'
import { deleteEventById, confirmAssistance, reserveProduct } from '_api'
import { Link } from 'react-router-dom';
import { getUserEmail } from 'authorization/auth'

function EventDisplay(props) {
    return (
        <Fragment>
            <GenericEventInformation event={props.event} />
            <SpecificEventInformation type={props.event.eventType} event={props.event} />
        </Fragment>
    )
}

function GenericEventInformation(props) {

    var deadline = <I18n id="eventDisplay.party.confirmationDeadline" />
    const productsReserved =
        <Fragment>
            <h3>Productos reservados:</h3>
            {props.productsNeeded.map((product) => {
                return (
                    <h4 key={uniqueProductId()}>
                        {product}</h4>
                )
            }
            )}
        </Fragment>


    return (
        <Fragment>
            <h3><I18n id="eventDisplay.eventName" /> {props.event.name}</h3>
            <h3><I18n id="eventDisplay.eventDescription" /> {props.event.description}</h3>
            <h3><I18n id="eventDisplay.eventDate" /> {props.event.dayOfEvent.split("T00:00:00")}</h3>
            <h3>{props.event.deadline ? deadline : ""} <span>{props.deadline ? props.event.deadline.split("T00:00:00") : ""}</span></h3>
            <h3>Invitados:</h3>
            {props.event.guestsMails.map((mail) => {
                return (
                    <h4 key={uniqueProductId()}>{mail}</h4>
                )
            }
            )}
            <h3>Asistentes:</h3>
            {props.event.attendees.map((mail) => {
                return (
                    <h4 key={uniqueProductId()}>{mail}</h4>
                )
            }
            )}
            <ProductsDisplay productsNeeded={props.event.productsNeeded} />
            {props.event.eventType === "Basket" ? productsReserved : ""}
        </Fragment>
    )
}

class SpecificEventInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            party: false,
            basket: false,
            collect: false,
            disableConfirm: this.props.event.attendees.includes(getUserEmail())
        }

        this.confirmAssistance = this.confirmAssistance.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);

    }

    confirmAssistance() {
        if (this.props.type === "Party") { this.setState({ party: true }) }
        if (this.props.type === "Basket") { this.setState({ basket: true }) }
        if (this.props.type === "Collect") { this.setState({ collect: true }) }
        this.setState({ disableConfirm: true })
        confirmAssistance(this.props.event.id)
    }

    deleteEvent() {
        deleteEventById(this.props.event.id)
    }

    render() {

        let isMyEvent = this.props.event.creatorEmail === getUserEmail()

        if (isMyEvent) {

            if (this.props.type === "Party") {
                return (
                    <Fragment>
                        <EventInfo party={this.state.party} collect={this.state.collect} basket={this.state.basket} event={this.props.event} />
                        <br />
                        <h3><I18n id="eventDisplay.party.total" />{this.props.event.productsNeeded.map((item) => item.product.price).reduce((a, b) => a + b, 0)}</h3>
                        <Button color="primary" onClick={this.confirmAssistance} disabled={this.state.disableConfirm}><I18n id="eventDisplay.confirmAssistanceButton" /></Button>
                        <Link to={`/event/edit/${this.props.event.id}`}><Button color="primary"><I18n id="eventDisplay.editEventButton" /></Button></Link>
                        <Button color="danger" onClick={this.deleteEvent}><I18n id="eventDisplay.deleteEventButton" /></Button>
                    </Fragment>

                )
            }
            return (
                <Fragment>
                    <EventInfo party={this.state.party} collect={this.state.collect} basket={this.state.basket} event={this.props.event} />
                    <br />
                    <Button color="primary" onClick={this.confirmAssistance} disabled={this.state.disableConfirm}><I18n id="eventDisplay.confirmAssistanceButton" /></Button>
                    <Link to={`/event/edit/${this.props.event.id}`}><Button color="primary"><I18n id="eventDisplay.editEventButton" /></Button></Link>
                    <Button color="danger" onClick={this.deleteEvent}><I18n id="eventDisplay.deleteEventButton" /></Button>
                </Fragment>

            )
        }
        else {

            return (
                <Fragment>
                    <EventInfo party={this.state.party} collect={this.state.collect} basket={this.state.basket} cb={this.state.confirmBasket} event={this.props.event} />
                    <br />
                    <Button color="primary" onClick={this.confirmAssistance} disabled={this.state.disableConfirm}><I18n id="eventDisplay.confirmAssistanceButton" /></Button>
                </Fragment>
            )
        }


    }
}

function EventInfo(props) {
    if (props.party) {
        return null;
    }

    if (props.basket) {
        return (
            <Fragment>
                <BasketDisplay event={props.event} />
            </Fragment>
        )
    }

    if (props.collect) {
        return <CollectDisplay event={props.event} />
    }

    if (!props.party && !props.basket && !props.collect) {
        return null;
    }
}

var productId = 0;
function uniqueProductId() {
    return productId++;
}

class BasketDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: ""
        }

        this.onChange = this.onChange.bind(this)
        this.reserveProduct = this.reserveProduct.bind(this)
    }

    onChange(value) {
        this.setState({ product: value.substr(0, value.indexOf(' - ')) })
    }

    reserveProduct() {
        reserveProduct(this.props.event.id, this.state.product)
    }

    render() {
        return (
            <Fragment>

                <ProductsSelector onChange={this.onChange} products={this.props.event.productsNeeded} />
                <Button color="primary" onClick={this.reserveProduct}><I18n id="eventDisplay.basket.reserveProductButton" /></Button>
            </Fragment>
        )
    }

}

function CollectDisplay(props) {

    return (<h3><I18n id="eventDisplay.collect.shouldPay" />{(props.event.productsNeeded.map((item) => item.product.price).reduce((a, b) => a + b, 0) / props.event.attendees.length)}</h3>)
}



class ProductsSelector extends Component {

    handleChange = value => {
        this.props.onChange(value.label)
    }

    render() {
        let options = []
        this.props.products.map((product) => options.push({ value: product.product.name, label: product.product.name + " - " + product.amount + " unidades" }))

        return (
            <Fragment>
                <h3><I18n id="eventDisplay.basket.products" /></h3>
                <Select
                    options={options}
                    isMulti={false}
                    onChange={this.handleChange}
                    value={this.props.value}
                />
            </Fragment>
        )
    }
}

function ProductsDisplay(props) {
    return (
        <Fragment>
            <Row>
                <Col><h4><I18n id="eventDisplay.product.product" /></h4></Col>
                <Col><h4><I18n id="eventDisplay.product.quantity" /></h4></Col>
                <Col><h4><I18n id="eventDisplay.product.price" /></h4></Col>
            </Row>
            {props.productsNeeded.map((product) => {
                return (
                    <Row key={uniqueProductId()}>
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

export default EventDisplay