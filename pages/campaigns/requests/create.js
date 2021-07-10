import React, { Component } from 'react'
import Layout from '../../../components/Layout'
import web3 from '../../../ethereum/web3'
import Campaign from '../../../ethereum/campaign'
import { Router } from '../../../routes'

class NewRequest extends Component {

    static getInitialProps = props => {
        return {
            address: props.query.address
        }
    }

    state = {
        description: '',
        value: '',
        recepient: '',
        message: 'Submit',
        errorMessage: ''
    }

    inputHandler = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    submitHandler = async (e) => {
        e.preventDefault()
        const spinner = document.getElementById('spinner')
        const errorAlert = document.getElementById('errorM')

        try {
            errorAlert.hidden = true;
            spinner.hidden = false;
            this.setState({
                message: ''
            })
            const accounts = await web3.eth.requestAccounts()
            const campaign = Campaign(this.props.address)
            await campaign.methods.createRequest(this.state.description, this.state.value, this.state.recepient).send({
                from: accounts[0]
            })
            Router.pushRoute(`/campaigns/${this.props.address}/requests`)

        } catch (err) {
            errorAlert.hidden = false
            spinner.hidden = true
            this.setState({
                errorMessage: err.message,
                message: 'Submit'
            })
        }
    }



    render() {
        return (
            <Layout>
                <h3>New Request</h3>
                <p style={{ "color": "gray" }}>Only campaign manager can create new request</p>
                <br />
                <form onSubmit={this.submitHandler}>
                    <div className="mb-3">
                        <label className="form-label">Request Description</label>
                        <input type="text" onChange={this.inputHandler} id="description" className="form-control" />
                        {/* <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> */}
                    </div>
                    <div class="mb-3">
                        <label className="form-label">Value (in wei)</label>
                        <input type="text" onChange={this.inputHandler} id="value" className="form-control" />
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Recepient</label>
                        <input type="text" onChange={this.inputHandler} id="recepient" className="form-control" />
                    </div>
                    <div className="alert alert-danger alert-dismissible fade show" hidden id="errorM" role="alert">
                        {this.state.errorMessage}
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <span class="spinner-border spinner-border-sm" role="status" id="spinner" aria-hidden="true" hidden></span>
                        {this.state.message}
                    </button>
                </form>
            </Layout>
        )
    }
}

export default NewRequest