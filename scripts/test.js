const hre = require("hardhat");

const ENTRYPOINT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const SALT = 12345678;

async function main() {
  const [signer0] = await hre.ethers.getSigners();
  const owner = signer0.address;

  const factory = await hre.ethers.getContractAt("AccountFactory2", FACTORY_ADDRESS);

  const sender = await factory.createAccount(owner, SALT);
  const senderpredicted = await factory.getAddress(owner, SALT);
  // Compute the account address without deploying
  const predicted = await factory.getAddress(owner, SALT);

  //assert.equal(sender, senderpredicted);
  // callStatic lets us execute the call and get its return value
  // without submitting a transaction
  const deployedAddress = await factory.callStatic.createAccount(owner, SALT);

  console.log(`Sender: ${sender} Predicted: ${senderpredicted}`);
  const tx = await factory.createAccount(owner, SALT);
  await tx.wait();

  console.log(`Account deployed at: ${deployedAddress}\nPredicted address : ${predicted}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
