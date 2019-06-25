import React, { Component, Fragment } from "react"
import { Button, Row, Col } from 'reactstrap';
import { askForLoan, fetchLoan } from '_api'
import I18n from 'I18n'


class LoanPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loan: {},
            disabled : false,
            
        }

        this.handleClick = this.handleClick.bind(this)
       
    }

    componentDidMount(){
        fetchLoan()
        .then((loan)=> this.setState({loan:loan,disabled:true}))
        .catch(() => console.log("Fallo el loan get"))
    }

    handleClick(e) {
        e.preventDefault();

        askForLoan().then((loan) => this.setState({loan:loan,disabled:true})).catch(() => console.log("LALALALA"))
        
    }

    render() {
        return (
            <Fragment>
                <h1><I18n id="loanPage.title"/></h1>
                <h4>
                    <I18n id="loanPage.loanInformation"/>
                </h4>
                <Button color="primary" disabled={this.state.disabled} onClick={this.handleClick}><I18n id="loanPage.loanButton"/></Button>
                <LoanInformation loan={this.state.loan} />

                       
                
            </Fragment>
        );
    }


}



function LoanInformation(props) {

    var feeId = 0;
    function uniqueFeeId() {
        return feeId++;
    }

    const isLoan = (Object.keys(props.loan).length === 0)

    if (isLoan) {
        return null;
    }

    return (

        <Fragment>
            <h2><I18n id="loanPage.currentLoan"/></h2>
            <h3><I18n id="loanPage.fees"/></h3>
            <Row>
                <Col><h4><I18n id="loanPage.feeNumber"/></h4></Col>
                <Col><h4><I18n id="loanPage.feeStatus"/></h4></Col>
            </Row>

            {props.loan.fees.map((fee, index) => {
                return (
                    <Row key={uniqueFeeId()}>
                        <Col>{index}</Col>
                        <Col>{fee.paid ? <I18n id="loanPage.paid"/> : <I18n id="loanPage.unpaid"/>}</Col>
                    </Row>
                );
            })}
        </Fragment>


    )
}

export default LoanPage