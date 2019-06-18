//import React from 'react';
import React, {Component, Fragment} from 'react'
import {withFormik, Form, Field} from 'formik'
import Select from 'react-select';
import Products from './componentsCami/Products'



const options = [
    { value: 'cami', label: 'camila.cintioli@gmail.com' },
    { value: 'uriel', label: 'urielintemperie@gmail.com' },
  ];

const NewEventDisplay = ({
    values,
    setFieldValue,

}) => (
    <Fragment>
    <h1>NUEVO EVENTO</h1>
    <Form>
        <label>Nombre del evento:</label>
        <Field type="text" name="name" placeholder="Nombre del evento"/>
        <br/>
        <label>Descripcion:</label>
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

        <button type="submit">Crear Evento</button>
        
    </Form>
    
    </Fragment>
)

function DeadlineConfirmation(props) {
    const isParty = props.event === "party"
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
        return <h1>{""}</h1>;
    }
    
  }

const axios = require('axios');


const CopiaCami = withFormik({
    mapPropsToValues({event}){
        return {
            event: event || 'basket',
            guests: [],
            products: [],
            name:"",
            description:""
        }
    },
    handleSubmit(values) {
        axios.post('http://localhost:8080/event/new', {
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
                
        })
          .then(function (response) {
            console.log("TODO PIOLA");
          })
          .catch(function (error) {
            console.log("FLASHEASTE");
          });

          console.log(values)
        
    }
})(NewEventDisplay)

 

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

//export default FormikApp



//const CopiaCami = () => {return <h1>Falopaaa</h1>}
export default CopiaCami; 