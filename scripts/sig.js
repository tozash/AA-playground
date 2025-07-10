const hre = require("hardhat");

const ACCOUNT_ADDRESS = "0x0000000000000000000000000000000000000000";
const ENTRYPOINT_ADDRESS = "0x0000000000000000000000000000000000000000";
const PAYMASTER_ADDRESS = "0x0000000000000000000000000000000000000000";

async function main() {
    const [signer0] = await hre.ethers.getSigners();
    const signature = await 
                      signer0.signMessage(
                        hre.ethers.getBytes(
                            hre.ethers.keccak256(
                                hre.ethers.toUtf8Bytes
                                 (
                                    "wee"
                                 )
                                )
                            )
                        );
    const Test = await hre.ethers.getContractFactory("Test");

    const test = await Test.deploy(signature);

    console.log("address", await signer0.getAddress());

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});