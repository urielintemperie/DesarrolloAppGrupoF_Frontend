import React, {Component, Fragment} from 'react'
import {withFormik, Form, Field} from 'formik'
import Select from 'react-select'
import Products from './Products'
import I18n from '../I18n'
import {connect} from 'react-redux'
import {actions as eventActions} from '_reducers/event'

const options = [
    { value: 'cami', label: 'camila.cintioli@gmail.com' },
    { value: 'uriel', label: 'urielintemperie@gmail.com' },
  ];

const NewEventDisplay = ({
    values,
    setFieldValue,
}) => (
    <Fragment>
    <h1><I18n id="newEventForm.title"/></h1>
    <Form>
        <label><I18n id="newEventForm.eventName"/></label>
        <Field type="text" name="name" placeholder="Nombre del evento"/>
        <br/>
        <label><I18n id="newEventForm.description"/></label>
        <Field type="text" name="description" placeholder="Descripcion del evento"/>
        <br/>
        <Field component="select" name="event">
            <option value="party">Fiesta</option>
            <option value="collect">Baquita</option>
            <option value="basket">Canasta</option>
        </Field>
        <br/>
        <GuestSelector onChange={setFieldValue}/>
        <br/>
        <Products onChange={setFieldValue}/>
        <br/>
        <DeadlineConfirmation event={values.event}/>
        <br/>
        <button type="submit"><I18n id="newEventForm.createEvent"/></button>
        
    </Form>
    
    </Fragment>
)


function DeadlineConfirmation(props) {
    const isParty = props.event === "party"
    if(isParty){
        return(
            <Fragment>
                <label>
                <I18n id="newEventForm.deadlineConfirmation"/>
                    <Field name="deadline" placeholder="Fecha" type="date"/>
                </label>
            </Fragment>
        )
    } else{
        return <h1>{""}</h1>;
    }
    
  }


const NewEventForm = withFormik({
    mapPropsToValues({event}){
        return {
            event: event || 'basket',
            guests: [],
            products: [],
            name:"",
            description:""
        }
    },
    handleSubmit(values, {props}) {
        const event = {
            "productsNeeded": values.products.map(function(p){
                return {
                    "product": {
                        "name":p.name,
                        "price": p.price
                    },
                    "amount":p.qty
                }
            }),
            "guestsMails": values.guests.map(function(x){
                return x.label
            }),
            "eventType":values.event,
            "name":values.name,
            "description":values.description
        }
       props.createEvent(event)
    }
})(NewEventDisplay)

 

class GuestSelector extends Component {
    handleChange = value => {
        this.props.onChange('guests',value)
    }

    render(){
        return (
            <Fragment>
                <h3><I18n id="newEventForm.guests"/></h3>
                <Select
                    options={options}
                    isMulti={true}
                    onChange={this.handleChange}
                    value={this.props.value}
                />
            </Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createEvent: (event) => { dispatch(eventActions.add(event)) }
    }
}

export default connect(null, mapDispatchToProps)(NewEventForm); 