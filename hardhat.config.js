require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
  solidity: {
    version: "0.8.28", // or your current version
    settings: {
      optimizer: {
        enabled: true,
        runs: 50 // Lower runs can reduce size, but may increase gas cost
      },
      evmVersion: "cancun",
    },
}};
