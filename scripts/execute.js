const hre = require("hardhat");
const { hexlify, zeroPadValue, toBeHex } = require("ethers");

const ENTRYPOINT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const PAYMASTER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const SALT = 12345678;


async function main() {
  const [signer0] = await hre.ethers.getSigners();
  const owner = signer0.address;

  const ep = await hre.ethers.getContractAt("EntryPoint", ENTRYPOINT_ADDRESS);

  const factory = await hre.ethers.getContractAt(
    "AccountFactory2",
    FACTORY_ADDRESS
  );

  // get the predicted address of the account
  const sender = await factory.getPredictedAddress(owner, SALT);

  // get the code of the account
  const code = await hre.ethers.provider.getCode(sender);

  // if the account already exists, send the init code 0x
  const initCode = code !== "0x" ? "0x" :
    FACTORY_ADDRESS +
    factory.interface
      .encodeFunctionData("createAccount", [owner, SALT])
      .slice(2);

  const Account = await hre.ethers.getContractFactory("Account");

  



// ------------ your numbers ------------
const callGasLimit          = 200_000n;
const verificationGasLimit  = 800_000n;

const maxFeePerGas          = hre.ethers.parseUnits("10", "gwei");   // bigint
const maxPriorityFeePerGas  = hre.ethers.parseUnits("5",  "gwei");

// ------------ pack them ---------------
// helper: pack two uint128 into a bytes32 string
function packUint128(high, low) {
    const MAX = (1n << 128n) - 1n;
    if (high > MAX || low > MAX) {
      throw new Error("uint128 overflow when packing");
    }
    const packed = (BigInt(high) << 128n) | BigInt(low);
    return toBeHex(packed, 32);                   // 64-hex-char 0x… string
  }

const accountGasLimits = packUint128(
    verificationGasLimit,
    callGasLimit
  );
  
  const gasFees = packUint128(
    maxPriorityFeePerGas,
    maxFeePerGas
  );


const paymasterVerificationGasLimit = 120_000n;   // gas for validatePaymasterUserOp
const paymasterPostOpGasLimit       = 250_000n;   // gas for postOp

const paymasterAndData = hre.ethers.solidityPacked(
  ["address","uint128","uint128"],
  [
    PAYMASTER_ADDRESS,
    paymasterVerificationGasLimit,
    paymasterPostOpGasLimit,
    //extraData               // or "0x"
  ]
);

  const userOp = {
    sender: sender,
    nonce: await ep.getNonce(sender, 0),
    initCode: 
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    // ✅ gas limits
    accountGasLimits: accountGasLimits,
    preVerificationGas: hre.ethers.toBeHex(50_000),         // 0xC350
    // ✅ gas fees
    gasFees: gasFees,
    paymasterAndData: paymasterAndData, // if no paymaster, keep it "0x"
    signature: "0x"         // fill with real sig when signing
  };

  const userOpHash = await ep.getUserOpHash(userOp);
  userOp.signature = signer0.signMessage(hre.ethers.getBytes(userOpHash));

  const tx = await ep.handleOps([userOp], owner);
  const receipt = await tx.wait();
  console.log(receipt);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});