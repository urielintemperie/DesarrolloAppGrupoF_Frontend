import React, { Component, Fragment } from 'react'
import { Button, Row, Col } from 'reactstrap'
import Select from 'react-select'
import I18n from '../I18n'

function EventDisplay(props) {
    return (
        <Fragment>
            <GenericEventInformation name={props.event.name} description={props.event.description} date={props.event.dayOfEvent} />
            <EventInformation type={props.event.eventType} event={props.event} />
        </Fragment>
    )
}

function GenericEventInformation(props) {
    return (
        <Fragment>
            <h3><I18n id="eventDisplay.eventName"/> {props.name}</h3>
            <h3><I18n id="eventDisplay.eventDescription"/></h3>
            <h3><I18n id="eventDisplay.eventDate"/> {props.date.split("T00:00:00")}</h3>
        </Fragment>
    )
}


class EventInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            party: false,
            basket: false,
            collect: false,
            disabled: false
        }

        this.confirmAssistance = this.confirmAssistance.bind(this);
        
    }

    confirmAssistance(){
        if(this.props.type==="Party"){this.setState({party:true})}
        if(this.props.type==="Basket"){this.setState({basket:true})}
        if(this.props.type==="Collect"){this.setState({collect:true})}
        this.setState({disabled:true})
    }

    render() {

        return (
            <Fragment>
                <EventInfo party={this.state.party} collect={this.state.collect} basket={this.state.basket} event={this.props.event} />
                <br />
                <Button color="primary" onClick={this.confirmAssistance} disabled={this.state.disabled}><I18n id="eventDisplay.confirmAssistanceButton"/></Button>
                <Button color="primary"><I18n id="eventDisplay.editEventButton"/></Button>
                <Button color="danger"><I18n id="eventDisplay.deleteEventButton"/></Button>

            </Fragment>
        )
    }
}

function EventInfo(props) {
    if (props.party) {
        return <PartyDisplay event={props.event}/>
    }

    if (props.basket) {
        return <BasketDisplay event={props.event}/>
    }

    if (props.collect) {
        return <CollectDisplay event={props.event}/>
    }

    if (!props.party && !props.basket && !props.collect) {
        return null;
    }
}

var productId = 0;
function uniqueProductId() {
    return productId++;
}

function PartyDisplay(props) {

    var prices=[]

    return (
        <Fragment>
            <h3><I18n id="eventDisplay.party.confirmationDeadline"/> {props.event.deadlineConfirmation.split("T00:00:00")}</h3>
            <h3><I18n id="eventDisplay.party.toBuy"/></h3>
            <Row>
                <Col><h4><I18n id="eventDisplay.product.product"/></h4></Col>
                <Col><h4><I18n id="eventDisplay.product.quantity"/></h4></Col>
                <Col><h4><I18n id="eventDisplay.product.price"/></h4></Col>
            </Row>
            {props.event.productsNeeded.map((product) => {
                return(
                    <Row key={uniqueProductId()}>
                        <Col>{product.product.name}</Col>
                        <Col>{product.product.price}</Col>
                        <Col>{product.amount}</Col>
                        {prices.push(product.product.price) ? "" : ""}
                    </Row>
                )
            }
            )}
            
            <h3><I18n id="eventDisplay.party.total"/>{prices.reduce((a,b) => a + b, 0)}</h3>

        </Fragment>
    )
}

class BasketDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: ""
        }


        this.onChange = this.onChange.bind(this)
    }

    onChange(value) {
        this.setState({ product: value })
    }

    render() {
        return (
            <Fragment>
                <ProductsSelector onChange={this.onChange} products={this.props.event.productsNeeded}/>
                <Button color="primary"><I18n id="eventDisplay.basket.reserveProductButton"/></Button>
            </Fragment>
        )
    }

}

function CollectDisplay(props) {

    var prices=[]

    return (
        <Fragment>
            <Row>
                <Col><h4><I18n id="eventDisplay.product.product"/></h4></Col>
                <Col><h4><I18n id="eventDisplay.product.quantity"/></h4></Col>
                <Col><h4><I18n id="eventDisplay.product.price"/></h4></Col>
            </Row>
            {props.event.productsNeeded.map((product) => {
                return(
                    <Row key={uniqueProductId()}>
                        <Col>{product.product.name}</Col>
                        <Col>{product.product.price}</Col>
                        <Col>{product.amount}</Col>
                        {prices.push(product.product.price) ? "" : ""}
                    </Row>
                )
            }
            )}

            <h3><I18n id="eventDisplay.collect.shouldPay"/>{(prices.reduce((a,b) => a + b, 0)/props.event.attendees.length).toFixed(2)}</h3>
        </Fragment>
    )
}



class ProductsSelector extends Component {

 

    handleChange = value => {
        this.props.onChange(value.label)
    }

    render() {

        let pepita = []
        this.props.products.map((product) => pepita.push({value:product.product.name, label:product.product.name + " - " + product.amount + " unidades"}))

        return (
            <Fragment>
                <h3><I18n id="eventDisplay.basket.products"/></h3>
                <Select
                    options={pepita}
                    isMulti={false}
                    onChange={this.handleChange}
                    value={this.props.value}
                />
            </Fragment>
        )
    }
}

export default EventDisplay