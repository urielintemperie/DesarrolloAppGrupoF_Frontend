
import React, { Component, Fragment } from 'react'
import { withFormik, Form, Field, ErrorMessage } from 'formik'
import Products from './Products'
import I18n from '../../I18n'
import { newEvent, editEvent, newTemplate } from '_api';
import { getUserEmail } from '../../authorization/auth'
import { withRouter } from 'react-router-dom'
import GuestSelector from './GuestSelector';
import { DatePicker } from '@material-ui/pickers'



var today = new Date()
var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
var tomorrowDeadline = new Date(today.getTime() + (24 * 60 * 60 * 1000));

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
                {correspondingTitle(values.typeForm)}
            </h1>
            <Form>
                <label><I18n id="newEventForm.eventName" /></label>
                <Field type="text" name="name" placeholder="Nombre del evento" />
                <ErrorMessage name="name" component="div" />

                <br />
                <label><I18n id="newEventForm.description" /></label>
                <Field type="text" name="description" placeholder="Descripcion del evento" />
                <br />


                <Field component="select" name="event">
                    <option value="Party">Fiesta</option>
                    <option value="Collect">Baquita</option>
                    <option value="Basket">Canasta</option>
                </Field>

                <br />

                <GuestSelector guests={values.guests} setFieldValue={setFieldValue} />
                <ErrorMessage name="guests" component="div" />


                <Products onChange={setFieldValue} value={initialProducts} />
                <ErrorMessage name="products" component="div" />

                <br />
                {values.event === "Party" && <Field name="deadline" component={DeadlineConfirmation} />}

                <ErrorMessage name="deadline" component="div" />
                <br />


                <label><I18n id="newEventForm.date" /></label>
                <DatePicker
                    format="dd/MM/yyyy"
                    value={tomorrow}
                    onChange={day => {
                        tomorrow = day
                        setFieldValue("date", tomorrow.toISOString().split("T")[0])
                    }}
                    shouldDisableDate={disablePrevDates(today)}
                />

                <br />
                <button type="submit">{correspondingTitle(values.typeForm)}</button>

            </Form>

        </Fragment>
    )
}

function disablePrevDates(startDate) {
    const startSeconds = Date.parse(startDate);
    return (date) => {
        return Date.parse(date) < startSeconds;
    }
}

function DeadlineConfirmation(props) {
    return (
        <Fragment>
            <label>
                <I18n id="newEventForm.deadlineConfirmation" />
                <DatePicker
                    format="dd/MM/yyyy"
                    value={tomorrowDeadline}
                    onChange={day => {
                        tomorrowDeadline = day
                        props.form.setFieldValue("date", tomorrowDeadline.toISOString().split("T")[0])
                    }}
                    shouldDisableDate={disablePrevDates(today)}
                />
            </label>
        </Fragment>
    )



}

function randomId() {
    return (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
}

function validateMails(mails) {

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (mails.filter(mail => !re.test(mail)).length) > 0

}
const validation = (values, props) => {

    let errors = {};

    if (!values.name) {
        errors.name = 'The name of the event is required';
    }

    if (!(values.guests.length > 0)) {
        errors.guests = 'Required at least 1 guest';
    }

    if (validateMails(values.guests)) {
        errors.guests = 'Guests mails should me a valid email'
    }


    if (!values.date) {
        errors.date = 'Required';
    }

    if (values.event === 'Party' && !values.deadline) {
        errors.deadline = 'The deadline confirmation date is required for a party';
    }

    if (values.products.length > 0) {
        if (values.products.every((p) => isNaN(p.price) || isNaN(p.qty))) {
            errors.products = 'price and quantity of products have to be a number'
        }
    }

    return errors;
};


const GenericEventForm = withRouter(withFormik({
    mapPropsToValues: (props) => {
        return props.valoresIniciales;
    },
    validate: validation,
    handleSubmit(values, props) {
        console.log(values)
        let userEmail = getUserEmail();
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
            "guestsMails": values.guests,
            "eventType": values.event,
            "name": values.name,
            "description": values.description
        };

        props.props.apiFunction(bodyREST)
            .then(() => props.props.history.push('/home'))



    }
})(NewEventDisplay))



function NewEventForm() {
    return NewForm(newEvent, "newEvent");
}

function EditEventForm({ evento }) {
    const valoresIniciales = {
        event: evento.eventType,
        guests: evento.guestsMails.map((g) => ({ value: g, label: g })),
        products: evento.productsNeeded.map(p => ({ id: randomId(), name: p.product.name, price: p.product.price, category: "", qty: p.amount })),
        name: evento.name,
        description: evento.description,
        date: evento.dayOfEvent.substring(0, 10),
        typeForm: "editEvent"
    };
    return <GenericEventForm valoresIniciales={valoresIniciales} apiFunction={editEvent(evento.id)} />
}

function NewForm(apiFunction, typeForm) {
    const valoresIniciales = {
        event: 'Basket',
        guests: [],
        products: [],
        name: "",
        description: "",
        date: tomorrow.toISOString().split('T')[0],
        typeForm: typeForm,
        confirmation: ""
    };
    return <GenericEventForm valoresIniciales={valoresIniciales} apiFunction={apiFunction} />
}

function NewTemplateForm() {
    return NewForm(newTemplate, "newTemplate");
}

function correspondingTitle(typeForm) {
    switch (typeForm) {
        case "newEvent":
            return <I18n id="newEventForm.title" />;

        case "editEvent":
            return <I18n id="newEventForm.titleEdit" />;

        case "newTemplate":
            return <I18n id="newTemplateForm.title" />;

        default: return ""
    }
}

export { NewEventForm, EditEventForm, NewTemplateForm };

