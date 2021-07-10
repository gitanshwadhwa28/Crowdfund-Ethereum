import React, { Component } from 'react'
import Layout from '../../../components/Layout'
import { Link, Router } from '../../../routes'
import Campaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3'


class RequestsIndex extends Component {


    static getInitialProps = async (props) => {

        const campaign = Campaign(props.query.address);
        var requestCount = await campaign.methods.getRequestsCount().call();
        var approversCount = await campaign.methods.approversCount().call();

        requestCount = requestCount - 1;

        const requests = await Promise.all(
            Array(requestCount).fill().map((element, index) => {
                return campaign.methods.requests(index).call()
            })
        )
        console.log(requests)
        return { address: props.query.address, requests: requests, approversCount }
    }



    approveRequest = async (e) => {
        try {
            const campaign = Campaign(this.props.address)
            const account = await web3.eth.requestAccounts()
            await campaign.methods.approveRequest(e.target.id).send({ from: account[0] })
            Router.pushRoute(`/campaigns/${this.props.address}/requests/`)
        } catch (err) {
            console.log(err.message)
        }
    }

    finalizeRequest = async (e) => {
        try {
            const campaign = Campaign(this.props.address)
            const account = await web3.eth.requestAccounts()
            await campaign.methods.finalizeRequest(e.target.id).send({ from: account[0] })
            Router.pushRoute(`/campaigns/${this.props.address}/requests/`)
        } catch (err) {
            console.log(err.message)
        }
    }

    renderRequests() {

        const requests = this.props.requests

        return (
            <tbody>
                {requests.map((request, index) => (
                    <tr>
                        <td>{index}</td>
                        <td>{request.description}</td>
                        <td>{request.value}</td>
                        <td>{request.recepient}</td>
                        <td>{request.approvalCounts}/{this.props.approversCount}</td>
                        <td style={{ "color": "green" }}><button className="btn btn-primary" id={index} onClick={this.approveRequest}>Approve</button></td>
                        <td style={{ "color": "red" }}><button className="btn btn-success" id={index} onClick={this.finalizeRequest}>Finalize</button></td>
                        <td>{String(request.complete)}</td>
                    </tr>

                )

                )}
            </tbody>
        )
    }

    render() {
        return (
            <Layout>
                <div className="row">

                    <div className="col-md-8">
                        <h3>Pending Transaction Requests</h3>

                    </div>
                    <div className="col-md-4 d-flex">

                        <Link route={`/campaigns/${this.props.address}/requests/create`}>
                            <a className="btn btn-outline-primary">New Request</a>
                        </Link>
                    </div>

                    <table style={{ "marginTop": "70px" }} class="table tabel-lg table-striped table-hover table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Description</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Recepient</th>
                                <th scope="col">Approvals</th>
                                <th scope="col">Approve</th>
                                <th scope="col">Finalize</th>
                                <th scope="col">Complete</th>
                            </tr>
                        </thead>

                        {this.renderRequests()}

                    </table>

                </div>

            </Layout >

        )
    }
}

export default RequestsIndex 