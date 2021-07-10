import React, { Component } from 'react'
import factory from '../../ethereum/factory'
import Layout from '../../components/Layout'
import 'bootstrap/dist/css/bootstrap.min.css'
import web3 from '../../ethereum/web3'
import { Router } from '../../routes'



class CreateCampaign extends Component {

    state = {
        message: 'Submit',
        minimum: '',
        errorMessage: ''
    }

    submitHandler = async (e) => {
        e.preventDefault()
        var element = document.getElementById("errorM");
        var spinner = document.getElementById('spinner');
        element.hidden = true;
        try {

            spinner.hidden = false;
            this.setState({
                message: ''
            })
            const accounts = await web3.eth.requestAccounts()
            await factory.methods.createCampaign(this.state.minimum).send({ from: accounts[0] })
            this.setState({
                message: 'campaign successfully created'
            })

            Router.pushRoute('/')
        } catch (err) {
            element.hidden = false
            spinner.hidden = true
            this.setState({

                message: 'Submit',
                errorMessage: err.message
            })
        }
    }

    inputHandler = (e) => {
        this.setState({
            minimum: e.target.value
        })
    }


    render() {
        return (
            <Layout>
                <div className="row">
                    <div className="col-md-8">
                        <h2>Create Campaign</h2>
                    </div>
                    <form onSubmit={this.submitHandler} style={{ "marginTop": "45px", "width": "50%" }}>
                        <div className="mb-3">
                            <label for="exampleInputEmail1" className="form-label">Minimum Contribution</label>
                            <input type="text" onChange={this.inputHandler} className="form-control" placeholder="Minimum Contribution(in wei)" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        </div>
                        <div className="alert alert-danger alert-dismissible fade show" hidden id="errorM" role="alert">
                            {this.state.errorMessage}
                        </div>
                        <button class="btn btn-primary" type="submit">
                            <span class="spinner-border spinner-border-sm" role="status" id="spinner" aria-hidden="true" hidden></span>
                            {this.state.message}
                        </button>
                    </form>
                    <br />

                </div>

            </Layout>
        )
    };
}

export default CreateCampaign;