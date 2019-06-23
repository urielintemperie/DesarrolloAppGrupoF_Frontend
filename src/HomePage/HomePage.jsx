import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';

import axios from 'axios';

const server = 'http://localhost:8080';


const request = (type, path, body) => axios
  .request({ url: `${server}${path}`, method: type, data: body })
  .then(req => req.data);

const getTodosEventos = () => request('get', `/events`);
const deleteEventById = (id) => request('delete', `/event/delete/${id}`);

/*
class Card extends React.Component {
    

    render() {
        return (
            <div className="card">
                <div className="container">
                    <h4><b>Evento Fiesta</b></h4>
                    <p>Alta fiesta amigo</p>
                </div>
            </div>
        );
    }
}
*/

class Popup extends React.Component {
    render() {
      return (
        <div className='popup' onClick={this.props.closePopup}>
          <div className='popup_inner'>
            {this.props.children}
          </div>
        </div>
      );
    }
  }

function Product(props) {
    return (
            <p>nombre: {props.producto.product.name}  | precio: {props.producto.product.price}  |  cantidad: {props.producto.amount}</p>
    );
}

function FullEvent(props) {
    return (
        <div>
            <button onClick={()=>props.deleteEvent(props.event.id)}>Borrar</button>
            <h1>{props.event.name}</h1>
            <h2>{props.event.eventType}</h2>
            <h3>Descripcion:</h3>
            <p>{props.event.description}</p>
            <h3>Invitados:</h3>
            <ul>
                {props.event.guestsMails.map(mail => <li>{mail}</li>)}
            </ul>
            <h3>Productos:</h3>
            <ul>
                {props.event.productsNeeded.map(product => <l1><Product producto={product} /></l1>)}
            </ul>
        </div>
    );
}

function CardEvent(props) {
    return (
        <div className="card" onClick={props.openEvent}>
            <div className="container">
                <h4><b>{props.nombreEvento}</b> - Id:{props.idEvento}</h4>
                <p>{props.descripcionEvento}</p>
            </div>
        </div>
    );
}

function DisplayEvents(props) {
    return (
        <div className="contenedorEventos">
            {props.eventos.map(evento => {
                return (
                    <CardEvent idEvento={evento.id} nombreEvento={evento.name} descripcionEvento={evento.description} openEvent={() => props.openEvent(evento)}></CardEvent>
                );
            })}
        </div>
    );
}

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventos: [],
            isLoading: true,
            showPopup: false,
            eventSelected: null
        }
        this.buscarEventos = this.buscarEventos.bind(this);
        this.displayEventos = this.displayEventos.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.selectEvent = this.selectEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
    }

    deleteEvent(eventId) {
        deleteEventById(eventId)
         .then(() => {
             console.log(this.state.eventos);
             console.log(this.state.eventos.filter(evento => evento.id !== eventId));
             this.setState( { eventos: this.state.eventos.filter(event => event.id !== eventId)} );
         })
         .catch((e) => {
             console.log(e);
             alert(`Explote al querer borar por el id: ${eventId}`);
            });
    }

    selectEvent(event) {
        this.setState({eventSelected: event});
        this.togglePopup()
    }

    togglePopup() {
        this.setState({
          showPopup: !this.state.showPopup
        });
      }



    componentDidMount() {
        this.props.dispatch(userActions.getAll());
        this.buscarEventos();
    }

    handleDeleteUser(id) {
        return (e) => this.props.dispatch(userActions.delete(id));
    }

    displayEventos() {
        return this.state.eventos.map(evento => {
            // eslint-disable-next-line
            <div><h1>{evento.eventType}</h1></div>
        });
    }

    buscarEventos() {
        getTodosEventos()
         .then( todosEventos => {
             console.log(todosEventos);
             alert(todosEventos);
             this.setState({ eventos: todosEventos, isLoading: false, eventSelected: todosEventos[0] });
             
             console.log('eventos de state');
             console.log(this.state.eventos);
             console.log('eventSelected ¿Cargado?')
             console.log(this.state.eventSelected);
        })
         .catch(() => alert('Explote como un campeon'));
    }

    render() {
        const { user, users } = this.props;
        return (
            <div>
                
                <h1>Hi {user.name}!</h1>

                <h2>Evento selecionado</h2>
                {!(this.state.eventSelected == null) ? (
                    <div>
                    <CardEvent nombreEvento={this.state.eventSelected.name} descripcionEvento={this.state.eventSelected.description} openEvent={this.togglePopup}></CardEvent>
                    <h3>A mano</h3>
                    <div className="card" onClick={this.togglePopup}>
                        <div className="container">
                            <h4><b>Nombre evento</b></h4>
                            <p>La descripcion</p>
                        </div>
                    </div>
                    </div>
                ) : (
                    <p>No hay un evento seleccionado</p>
                )}

                <h2>Tus eventos</h2>
                
                {!this.state.isLoading ? (
                    <DisplayEvents eventos={this.state.eventos} openEvent={this.selectEvent}></DisplayEvents>
                ) : (
                    <h3>Cargando eventos ... </h3>
                )}

                <h3>Usuarios:</h3>
                {users.loading && <em>Loading users...</em>}
                {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                {users.items &&
                    <ul>
                        {users.items.map((user, index) =>
                            <li key={user.id}>
                                {'name: ' + user.name + ' | lastname: ' + user.lastName + ' | username: ' + user.username + ' | email: ' + user.email}
                                {
                                    user.deleting ? <em> - Deleting...</em>
                                    : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                    : <span> - <a onClick={this.handleDeleteUser(user.id)}>Delete</a></span>
                                }
                            </li>
                        )}
                    </ul>
                }
                <Link to="/event/new"><button>Crear evento</button></Link>
                <p>
                    <Link to="/login">Logout</Link>
                </p>

                <button onClick={this.togglePopup}>show popup</button>

                {this.state.showPopup ? 
                <Popup
                    closePopup={this.togglePopup}
                >
                <FullEvent event={this.state.eventSelected} deleteEvent={this.deleteEvent}/>
                </Popup>
                : null
                }

            </div>
        );
    }
}

function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };