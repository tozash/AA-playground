const hre = require("hardhat");

const ENTRYPOINT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  const af2 = await hre.ethers.deployContract("AccountFactory2", [ENTRYPOINT_ADDRESS]);
  
  await af2.waitForDeployment();

  console.log(`AF2 deployed to ${af2.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});