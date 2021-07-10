const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '3000000' });

    await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '3000000' });



    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    //ES2016 get first element from array returned and assign it to campaign address

    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)


})

describe('campaigns', () => {
    it('deploys factory and campaign', () => {
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    })

    it('manager is the caller', async () => {

        const manager = await campaign.methods.manager().call()
        assert.equal(accounts[0], manager)

    })

    it('check if contribute function works', async () => {
        await campaign.methods.contribute().send({ from: accounts[1], value: '200' })
        const isContributor = await campaign.methods.approvers(accounts[1]).call()
        assert(isContributor)
    })

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({ from: accounts[0], value: '20' })

        } catch (err) {
            assert(err)
        }
    })

    it('manager can post payment request', async () => {
        await campaign.methods.createRequest('buy car', '100', accounts[1]).send({ from: accounts[0], gas: '1000000' })
        const request = await campaign.methods.requests([0]).call()

        assert.equal('buy car', request.description)

    })
})