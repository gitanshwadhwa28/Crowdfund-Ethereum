const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    "mnemonic",
    "infura api"
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ gas: "3000000", from: accounts[0] });

    console.log("Contract deployed to", result.options.address);
};
deploy();

//0x94bd68116Ee8cee33eFeF2a53BB669B1796eAc83 

// latest: 0x4e689e2A5c96dE80e441fcee005157AB4cc3111e