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

                <div className="card">
                <h2 className="card-header"><I18n id="loanPage.title"/></h2>
                <div className="card-body">
                    <h5 className="card-text"><I18n id="loanPage.loanInformation"/></h5>
                    <Button color="primary" disabled={this.state.disabled} onClick={this.handleClick}><I18n id="loanPage.loanButton"/></Button>
                </div>
                </div>
                {/*                 
                <div className="jumbotron" style={{backgroundColor : 'white'}}>
                <h1><I18n id="loanPage.title"/></h1>
                <h4>
                    <I18n id="loanPage.loanInformation"/>
                </h4>
                </div>
                <Button color="primary" disabled={this.state.disabled} onClick={this.handleClick}><I18n id="loanPage.loanButton"/></Button> */}
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
            <table className="table table-light table-striped">
            <thead>
                <tr>
                <th scope="col"><h4><I18n id="loanPage.feeNumber"/></h4></th>
                <th scope="col"><h4><I18n id="loanPage.feeStatus"/></h4></th>
                </tr>
            </thead>
            <tbody>

                {props.loan.fees.map((fee, index) => {
                    return (
                        <tr>
                            <th key={uniqueFeeId()}>{index}</th>
                            <td>{fee.paid ? <I18n id="loanPage.paid"/> : <I18n id="loanPage.unpaid"/>}</td>
                        </tr>
                    );
                })}
            </tbody>
            </table>

            {/* <Row>
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
            })} */}
        </Fragment>


    )
}

export default LoanPage