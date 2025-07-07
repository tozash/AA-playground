const hre = require("hardhat");

const EP_ADDR = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

async function main() {
    const code = await hre.ethers.provider.getCode(EP_ADDR);

  console.log(`Code: ${code}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
