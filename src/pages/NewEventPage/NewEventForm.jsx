
import React, { Component, Fragment } from 'react'
import { withFormik, Form, Field } from 'formik'
import Select from 'react-select'
import Products from './Products'
import I18n from '../../I18n'
import { connect } from 'react-redux'
import { actions as eventActions } from '_reducers/event'
import { newEvent, editEvent,confirmAssistance } from '_api';
import {getUserEmail} from '../../authorization/auth'
import { withRouter } from 'react-router-dom'



const options = [
    { value: 'camila.cintioli@gmail.com', label: 'camila.cintioli@gmail.com' },
    { value: 'urielintemperie@gmail.com', label: 'urielintemperie@gmail.com' },
];

const NewEventDisplay = ({
    values,
    setFieldValue,
    values: { guests: initialGuests },
    values: { products: initialProducts },
    values: { date: initialDate }
}) => {
    return (
        <Fragment>
            <h1>
            {values.newForm ?
            (<I18n id="newEventForm.title" />)
            :
            (<I18n id="newEventForm.titleEdit" />)
            }
            </h1>
            <Form>
                <label><I18n id="newEventForm.eventName" /></label>
                <Field type="text" name="name" placeholder="Nombre del evento" />
                <br />
                <label><I18n id="newEventForm.description" /></label>
                <Field type="text" name="description" placeholder="Descripcion del evento" />
                <br />
                <Field component="select" name="event">
                    <option value="Party"><I18n id="newEventForm.party" /></option>
                    <option value="Collect">Baquita</option>
                    <option value="Basket">Canasta</option>
                </Field>

                <br />
                <GuestSelector onChange={setFieldValue} value={initialGuests} />
                <br />
                <Products onChange={setFieldValue} value={initialProducts} />
                <br />
                <DeadlineConfirmation event={values.event} />
                <br />
                <label><I18n id="newEventForm.date" /></label>
                <Field type="date" name="date" value={initialDate}/>
                <br />
                <button type="submit"><I18n id="newEventForm.createEvent" /></button>

            </Form>

        </Fragment>
    )
}



function DeadlineConfirmation(props) {
    const isParty = props.event === "Party"
    if (isParty) {
        return (
            <Fragment>
                <label>
                    <I18n id="newEventForm.deadlineConfirmation" />
                    <Field name="deadline" placeholder="Fecha" type="date" />
                </label>
            </Fragment>
        )
    } else {
        return <div></div>;
    }


}


// const NewEventForm = withFormik({
//     mapPropsToValues({event}){
//         return {
//             event: event || 'basket',
//             guests: [],
//             products: [],
//             name:"",
//             description:""
//         }
//     },
//     handleSubmit(values, {props}) {
//         const event = {



function randomId() {
    return (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
}

const GenericEventForm = withRouter(withFormik({
    mapPropsToValues: (props) => {
        return props.valoresIniciales;
    },
    handleSubmit(values, props) {
        let userEmail = getUserEmail();
        let guestsMails = values.guests.map(function (x) {
            return x.label
        });
        //if(!guestsMails.includes(userEmail)) { guestsMails.push(userEmail) }
        const bodyREST = {
            "creatorEmail": userEmail,
            "dayOfEvent": values.date,
            "productsNeeded": values.products.map(function (p) {
                return {
                    "product": {
                        "name": p.name,
                        "price": p.price
                    },
                    "amount": p.qty
                }
            }),
            "guestsMails": guestsMails,
            "eventType": values.event,
            "name": values.name,
            "description": values.description
        };

        props.props.apiFunction(bodyREST)
        .then((e) => {
            if(values.newForm) { confirmAssistance(e.id) }
        }).then(() => props.props.history.push('/home') )
        


    }
})(NewEventDisplay))



class GuestSelector extends Component {
    handleChange = value => {
        this.props.onChange('guests', value)
    }

    render() {
        return (
            <Fragment>
                <h3><I18n id="newEventForm.guests" /></h3>
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

//export default connect(null, mapDispatchToProps)(NewEventForm); 

function NewEventForm() {
    const valoresIniciales = {
        event: 'Basket',
        guests: [],
        products: [],
        name: "",
        description: "",
        newForm: true
    };
    return <GenericEventForm valoresIniciales={valoresIniciales} apiFunction={newEvent} />
}

function EditEventForm({ evento }) {
    const valoresIniciales = {
        event: evento.eventType,
        guests: evento.guestsMails.map((g) => ({ value: g, label: g })),
        products: evento.productsNeeded.map(p => ({ id: randomId(), name: p.product.name, price: p.product.price, category: "", qty: p.amount })),
        name: evento.name,
        description: evento.description,
        date: evento.dayOfEvent.substring(0,10),
        newForm: false
    };
    return <GenericEventForm valoresIniciales={valoresIniciales} apiFunction={editEvent(evento.id)} />
}


export { NewEventForm, EditEventForm };

