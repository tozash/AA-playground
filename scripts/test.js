const hre = require("hardhat");

const assert = require("assert");

const ENTRYPOINT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const SALT = 12345678;

async function main() {
  const [signer0] = await hre.ethers.getSigners();
  const owner = signer0.address;

  const factory = await hre.ethers.getContractAt(
    "AccountFactory2",
    FACTORY_ADDRESS
  );

  // Get the address predicted by the factory
  const predicted = await factory.getPredictedAddress(owner, SALT);

  // callStatic returns the deployment address without actually deploying
  const callStaticAddr = await factory.callStatic.createAccount(owner, SALT);

  // ensure prediction and callStatic address match
  assert.strictEqual(
    predicted.toLowerCase(),
    callStaticAddr.toLowerCase(),
    "Predicted address mismatch"
  );

  console.log(`Predicted address : ${predicted}`);

  // deploy the account
  const tx = await factory.createAccount(owner, SALT);
  await tx.wait();

  // verify that code exists at the predicted address
  const code = await hre.ethers.provider.getCode(predicted);
  assert.notStrictEqual(code, "0x", "Account was not deployed at predicted address");

  console.log(`Account deployed at: ${predicted}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
