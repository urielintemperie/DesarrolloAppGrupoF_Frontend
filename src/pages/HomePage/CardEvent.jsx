import React, { Component, Fragment } from 'react'
import { Card, CardBody, CardTitle, CardSubtitle, Modal, ModalBody, Button } from 'reactstrap'
import Falopa from 'pages/Falopa';

class CardEvent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modal: false
        }

        this.toggle = this.toggle.bind(this);
        this.onClose = this.onClose.bind(this);
    }


    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    onClose() {
        window.location.reload();
    }

    render() {
        return (
            <Fragment>
                <Card onClick={this.toggle} outline color="primary" style={{ width: '150px' }} >
                    <CardBody>
                        <CardTitle><b>{this.props.event.name}</b></CardTitle>
                        <CardSubtitle>{this.props.event.description}</CardSubtitle>
                        <CardSubtitle>{this.props.event.dayOfEvent.split('T00:00:00')}</CardSubtitle>
                    </CardBody>
                </Card>

                <Modal isOpen={this.state.modal} fade={false} toggle={this.toggle} centered={true} backdrop="static">
                    <ModalBody>
                        <Falopa event={this.props.event} />
                        <Button onClick={this.onClose} color="secondary">Cerrar</Button>
                    </ModalBody>
                </Modal>
            </Fragment>
        )
    }
}

export default CardEvent