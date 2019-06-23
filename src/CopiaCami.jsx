import React, {Component, Fragment} from 'react';
import {withFormik, Form, Field} from 'formik';
import Select from 'react-select';
import Products from './componentsCami/Products';
import { newEvent, editEvent } from './Api';



const options = [
    { value: 'camila.cintioli@gmail.com', label: 'camila.cintioli@gmail.com' },
    { value: 'urielintemperie@gmail.com', label: 'urielintemperie@gmail.com' },
  ];

const NewEventDisplay = ({
    values,
    setFieldValue,
    values: {guests: initialGuests},
    values: {products: initialProducts}
}) => {
    return (
    <Fragment>
    <Form>
        <label>Nombre del evento:</label>
        <Field type="text" name="name" placeholder="Nombre del evento"/>
        <br/>
        <label>Descripcion:</label>
        <Field type="text" name="description" placeholder="Descripcion del evento"/>
        <br/>
        <Field component="select" name="event">
            <option value="Party">Fiesta</option>
            <option value="Collect">Baquita</option>
            <option value="Basket">Canasta</option>
        </Field>
        <br/>
        <GuestSelector onChange={setFieldValue} value={initialGuests}/>
        <br/>
        <Products onChange={setFieldValue} value={initialProducts}/>
        <br/>
        <DeadlineConfirmation event={values.event}/>
        <br/>

        <button type="submit">Cargar Evento</button>
        
    </Form>
    
    </Fragment>
)}


class GuestSelector extends Component {
    handleChange = value => {
        this.props.onChange('guests',value)
    }

    render(){
        return (
            <Fragment>
                <h3>Invitados</h3>
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

function DeadlineConfirmation(props) {
    const isParty = props.event === "Party"
    if(isParty){
        return(
            <Fragment>
                <label>
                    Fecha limite de confirmacion:
                    <Field name="deadline" placeholder="Fecha" type="date"/>
                </label>
            </Fragment>
        )
    } else{
        return <div></div>;
    }
}

function randomId() {
    return (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
}

const GenericEventForm = withFormik({
    mapPropsToValues: (props) => 
    {
        return props.valoresIniciales;
    },
    handleSubmit(values, props) {
        const bodyREST = {
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
        };

        props.props.apiFunction(bodyREST)
        .then(function (response) {
            console.log("TODO PIOLA");
          })
          .catch(function (error) {
            console.log("FLASHEASTE");
          });

        console.log(values);
        }
})(NewEventDisplay)


function NewEventForm() {
    const valoresIniciales = {
        event: 'Basket',
        guests: [],
        products: [],
        name:"",
        description:""
    };
    return <GenericEventForm valoresIniciales={valoresIniciales} apiFunction={newEvent} />
}

function EditEventForm({evento}) {
    const valoresIniciales = {
        event: evento.eventType,
        guests: evento.guestsMails.map((g) => ({value: g, label:g})),
        products: evento.productsNeeded.map(p => ({id: randomId(), name: p.product.name, price: p.product.price, category: "", qty: p.amount})),
        name: evento.name,
        description: evento.description
    };
    return <GenericEventForm valoresIniciales={valoresIniciales} apiFunction={editEvent(evento.id)} />
}


export { NewEventForm, EditEventForm };