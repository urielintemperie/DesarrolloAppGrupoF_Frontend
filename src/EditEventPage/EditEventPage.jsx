import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { getEvento } from '../Api';
// import CopiaCami from '../CopiaCami';
import { EditEventForm } from '../CopiaCami';

class EditEventPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { evento: null }
    }

    componentDidMount() {
        const { eventId } = this.props.match.params
        
        console.log("LO QUE ESTA EN EVENTOID");
        console.log(eventId);

        getEvento(eventId)
        .then( (e) => this.setState({evento : e}) )
        .catch( (e) => {
            console.log(e);
            alert(`Explote al hacer getEvento con id: ${eventId}`);
        })
    }

    render() {
        return (
            <div>
                { (this.state.evento !== null) ? 
                ( <EditEventForm evento={this.state.evento} /> )
                :
                ( <p>Cargando ...</p> )
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

const connectedEditEventPage = connect(mapStateToProps)(EditEventPage);

export { connectedEditEventPage as EditEventPage };
// export default EditEventPage;