import React, { Component } from 'react'
import Layout from '../../components/Layout'
import Campaign from '../../ethereum/campaign'
import web3 from '../../ethereum/web3'
import { Router, Link } from '../../routes'

class CampaignShow extends Component {


    static async getInitialProps(props) {

        const campaign = Campaign(props.query.address)
        const summary = await campaign.methods.getSummary().call();

        return {
            minimumContribution: summary[0],
            balance: summary[1],
            requestCount: summary[2] - 1,
            approvalCount: summary[3],
            manager: summary[4],
            address: props.query.address
        }


    }

    state = {
        amount: '',
        message: 'Contribute',
        errorMessage: ''
    }

    handleInput = (e) => {
        this.setState({
            amount: e.target.value
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const spinner = document.getElementById('spinner');
        const messageError = document.getElementById('errorM')


        try {
            messageError.hidden = true
            this.setState({
                message: ''
            })
            spinner.hidden = false;
            const campaign = Campaign(this.props.address)
            const accounts = await web3.eth.requestAccounts()
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: this.state.amount
            });

            Router.replaceRoute(`/campaigns/${this.props.address}`)

        }
        catch (err) {
            spinner.hidden = true;
            this.setState({
                errorMessage: err.message,
                message: 'Contribute'
            })
            messageError.hidden = false
        }


    }

    render() {


        return (
            <Layout>

                <div className='row'>

                    <div className="col-md-8">

                        <div className="row">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Minimum Contribution</h5>
                                        {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                                        <p className="card-text" style={{ "fontSize": "30px" }}>{this.props.minimumContribution} wei</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Contract Balance</h5>
                                        {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                                        <p className="card-text" style={{ "fontSize": "30px" }}>{this.props.balance}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Request Count</h5>
                                        {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                                        <p className="card-text" style={{ "fontSize": "30px" }}>{this.props.requestCount}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Approval Count</h5>
                                        {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                                        <p className="card-text" style={{ "fontSize": "30px" }}>{this.props.approvalCount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">

                        <h5 className="card-title">Manager</h5>
                        <p className="card-text" >{this.props.manager}</p>
                        <br />
                        <br />
                        <form onSubmit={this.handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Amount (in wei)</label>
                                <input onChange={this.handleInput} type="text" className="form-control" />
                                {/* <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> */}
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <span class="spinner-border spinner-border-sm" role="status" id="spinner" aria-hidden="true" hidden></span>
                                {this.state.message}</button>
                        </form>


                    </div>

                    <div className="alert alert-danger alert-dismissible fade show" style={{ "marginTop": "40px" }} hidden id="errorM" role="alert">
                        {this.state.errorMessage}
                    </div>

                </div>
                <br />
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a class="btn btn-lg btn-outline-secondary">View requests</a>
                </Link>
            </Layout>
        )
    }
}

export default CampaignShow