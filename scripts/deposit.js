const hre = require("hardhat");

const ENTRYPOINT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PAYMASTER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {

    const ep = await hre.ethers.getContractAt("EntryPoint", ENTRYPOINT_ADDRESS);

    await ep.depositTo(PAYMASTER_ADDRESS,
        {value: hre.ethers.parseEther(".2")}
        );

    console.log("Deposited to paymaster");

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});