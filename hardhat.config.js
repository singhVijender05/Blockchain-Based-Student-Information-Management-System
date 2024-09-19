require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/ZoYDLK4Jx0fRxA8f1Jo5VVrmVKhh1kxC",
      accounts: ["3637ded05deab2a234230af47ecbe12b49f3d2ad1c0d3d7dbfdebb7aef584a66"]
    }
  }
};