const { ethers } = require("hardhat");

const ACCOUNT_ADDRESS = "0xe52da9C47c1aCdffd104a348f27CCD7333abe7Ad";

async function main() {
    const account = await ethers.getContractAt("Account", ACCOUNT_ADDRESS);
    const count = await account.count();
    console.log(`Count: ${count}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
