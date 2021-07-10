import React, { Component } from 'react'
import factory from '../ethereum/factory'
import { Card, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import Layout from '../components/Layout'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from '../routes'

class CampaignIndex extends Component {

    static async getInitialProps() {
        const camapigns = await factory.methods.getDeployedCampaigns().call();

        return { camapigns };
    }

    renderCamapign() {
        const items = this.props.camapigns.map(address => {
            return {
                header: address,
                description: 'View Details'
            }
        })

        console.log(items)

        return (
            <div>
                {items.map(campaign => (
                    <div class="card" style={{ "marginTop": "40px" }}>
                        <div class="card-body">
                            <h5 class="card-title">{campaign.header}</h5>
                            <br />
                            <Link route={`/campaigns/${campaign.header}`}><a class="btn btn-primary">{campaign.description}</a></Link>
                        </div>
                    </div>
                ))}
            </div>
        )
    }


    render() {
        return (
            <Layout>


                <div className="row">
                    <div className="col-md-8">
                        <h2>Open Campaigns</h2>
                        <br />
                        {this.renderCamapign()}
                    </div>
                    <div className="col-md-4">
                        <Link route="/campaigns/create">

                            <button className="btn btn-outline-primary" >Create Campaign +</button>

                        </Link>
                    </div>
                </div>

            </Layout>
        )
    };
}

export default CampaignIndex;