const { ethers } = require("hardhat");

const ACCOUNT_ADDRESS = "0x883e21418DFbB439fEBaF06683FFF52AFBc9e842";

async function main() {
    const account = await ethers.getContractAt("Account", ACCOUNT_ADDRESS);
    const count = await account.count();
    console.log(`Count: ${count}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
