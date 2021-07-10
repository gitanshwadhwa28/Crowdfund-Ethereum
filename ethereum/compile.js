const path = require('path')
const solc = require('solc')
const fs = require('fs-extra')

let buildPath = path.resolve(__dirname, 'build')
fs.removeSync(buildPath)

let campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
let source = fs.readFileSync(campaignPath, 'utf-8')
// const output = solc.compile(source, 1).contracts

fs.ensureDirSync(buildPath)






var input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));






for (let contract in output.contracts['Campaign.sol']) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract + '.json'),
        output.contracts['Campaign.sol'][contract]
    )
}

