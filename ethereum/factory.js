import web3 from './web3'
const compiledFactory = require('./build/CampaignFactory.json');

const instance = new web3.eth.Contract(
    compiledFactory.abi,
    '0x4e689e2A5c96dE80e441fcee005157AB4cc3111e'
)

export default instance;