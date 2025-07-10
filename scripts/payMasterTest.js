const hre = require("hardhat");

const ENTRYPOINT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ACCOUNT_ADDRESS = "0x883e21418DFbB439fEBaF06683FFF52AFBc9e842";
const PAYMASTER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
    const ep = await hre.ethers.getContractAt("EntryPoint", ENTRYPOINT_ADDRESS);
    const pm = await hre.ethers.getContractAt("Paymaster", PAYMASTER_ADDRESS);
    const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDRESS);

    console.log(`account balance: ${await ep.balanceOf(ACCOUNT_ADDRESS)}`);
    console.log(`paymaster balance: ${await ep.balanceOf(PAYMASTER_ADDRESS)}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});