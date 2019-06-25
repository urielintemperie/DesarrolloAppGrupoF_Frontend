import React, { Component, Fragment } from "react"
import { Button, Row, Col } from 'reactstrap';

class LoanPage extends Component {

    render() {
        return (
            <Fragment>
                <h1>TUS PRESTAMOS</h1>
                <h4>Podrá solicitar $1000 a retornar en 6 cuotas mensuales de $200 cada una. Las cuotas serán debitadas automáticamente de su cuenta el día 5 de cada
                mes. Si no posee el dinero suficiente, la cuota quedará pendiente hasta que existan fondos y pasa a ser moroso.
                </h4>
                <AskForLoanButton />
                <LoanInformation />
            </Fragment>
        );
    }


}



function AskForLoanButton(props) {

    function handleClick(e) {
        e.preventDefault();
        //llamar a api.pedir prestamo
        console.log('The link was clicked.');
    }

    return (
        <Button color="secondary" onClick={handleClick}>Pedi tu prestamo!</Button>
    )
}

const fees = [1,2,3,4,5]
var movementId = 0;
function uniqueMovementId() {
    return movementId++;
}

function LoanInformation(props) {
    return (
        <Fragment>
            <h2>Prestamo actual</h2>
            <h3>Cuotas:</h3>
            <Row>
                <Col><h4>Numero</h4></Col>
                <Col><h4>Estado</h4></Col>
            </Row>
            {fees.map(fee => {
                return (
                    <Row key={uniqueMovementId()}>
                    <Col>{fee}</Col>
                    <Col>PAGA</Col>
                    </Row> 
                );
            })}
        </Fragment>
    )
}

export default LoanPage