import React, { Component, Fragment } from "react"
import { connect } from 'react-redux'
import { actions as accountActions, selectors as accountSelectors } from '_reducers/account'
import { Button, Row, Col } from 'reactstrap';
import I18n from '../I18n'
import Popup from "reactjs-popup";
import TransferForm from 'AccountPage/TransferForm'


class AccountPage extends Component {

    render() {
        return (
            <Fragment>
                <h1><I18n id="accountPage.title" /></h1>
                <BalanceDisplay balance={this.props.balance} />
                <TransferButton/>
                <LoanRequestButton />
                <MovementHistory history={this.props.history || []} />
            </Fragment>
        );
    }

    componentDidMount() {
        this.props.fetchAccount()
        console.log("RELODEANDO VIEJA")
    }
}

function BalanceDisplay(props) {
    return (
        <h1><I18n id="accountPage.moneySign" />{props.balance}</h1>
    )
}

function TransferButton(props) {

    return (
        <Popup trigger={<Button color="primary"><I18n id="accountPage.button.transfer" /> </Button>} position="center center">
            <div>
                <h5>REALIZA UNA TRANSFERENCIA</h5>
                <TransferForm/>
            </div>
        </Popup>
    )
}



function LoanRequestButton(props) {
    return (
        <Button color="primary"><I18n id="accountPage.button.loan" /></Button>
    )
}

var movementId = 0;
function uniqueMovementId() {
    return movementId++;
}

function MovementHistory(props) {
    return (
        <Fragment>
            <h2><I18n id="accountPage.movements" /></h2>
            <Row>
                <Col><h4><I18n id="accountPage.movement.type" /></h4></Col>
                <Col><h4><I18n id="accountPage.movement.ammount" /></h4></Col>
                <Col><h4><I18n id="accountPage.movement.date" /></h4></Col>
                <Col><h4><I18n id="accountPage.movement.forFrom" /></h4></Col>
            </Row>
            {props.history.map(mov => {
                return (
                    <MovementRow key={uniqueMovementId()} type={mov.movementType} ammount={mov.ammount} date={mov.date} user={mov.user} />
                );
            })}

        </Fragment>
    )
}

function MovementRow(props) {
    return (
        <Fragment>

            <Row>
                <Col><h5>{props.type}</h5></Col>
                <Col><h5><I18n id="accountPage.moneySign" />{props.ammount}</h5></Col>
                <Col> <h5>{props.date}</h5></Col>
                <Col><h5>{props.user}</h5></Col>
            </Row>


        </Fragment>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAccount: () => { dispatch(accountActions.fetchAccount()) }
    }

}

const mapStateToProps = (state) => ({
    balance: accountSelectors.getBalance(state),
    history: accountSelectors.getHistory(state)

})

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage)