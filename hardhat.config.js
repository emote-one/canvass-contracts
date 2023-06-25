require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
//require('@nomiclabs/hardhat-ethers');
//require('@nomiclabs/hardhat-etherscan');
require('hardhat-gas-reporter');
require('hardhat-abi-exporter');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat:{},
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGON_SCAN_KEY,
      polygonMumbai: process.env.POLYGON_SCAN_KEY
    }
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  gasReporter: {
    enabled: true,
    coinmarketcap: process.env.COINMARKETCAP_KEY,
    token: 'MATIC',
    currency: 'USD',
    gasPriceApi: 'https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice',
    showTimeSpent: true
  },
  abiExporter: [
    {
      path: './abi/json',
      runOnCompile: true,
      clear: true,
      flat: true,
      spacing: 4,
      format: "json",
    },
    {
      path: './abi/minimal',
      runOnCompile: true,
      clear: true,
      flat: true,
      spacing: 4,
      format: "minimal",
    },
    {
      path: './abi/fullName',
      runOnCompile: true,
      clear: true,
      flat: true,
      spacing: 4,
      format: "fullName",
    }
  ]
};
