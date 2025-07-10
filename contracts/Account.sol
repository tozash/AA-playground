// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "hardhat/console.sol";

contract Account is IAccount {
    uint public count;
    address public immutable owner;
    EntryPoint public immutable entryPoint;

    constructor(address _owner, address _entryPoint) {
        owner = _owner;
        entryPoint = EntryPoint(payable(_entryPoint));
    }
    
    function validateUserOp( PackedUserOperation calldata userOp, bytes32 userOpHash, uint256 missingAccountFunds) external returns (uint256 validationData) {
        require(msg.sender == address(entryPoint), "AA: not EntryPoint");
        // No signature check in this toy demo – always accept
        // If the wallet lacks deposit, top-up with any ETH sent along
        if (missingAccountFunds > 0) {
            entryPoint.depositTo{value: missingAccountFunds}(address(this));
        }        
        address recovered = ECDSA.recover(MessageHashUtils.toEthSignedMessageHash(abi.encodePacked(userOpHash)), userOp.signature);
        console.log("recovered", recovered);
        return owner == recovered ? 0 : 1;
    }

    function execute() external {
        require(msg.sender == address(entryPoint), "AA: only EntryPoint");
        count++;
    }

    receive() external payable {}
}

// contract AccountFactory {
//     function createAccount(address _owner) external returns (address) {
//         Account account = new Account(_owner);
//         return address(account);
//     }
// }

contract AccountFactory2 {
    address public immutable _entryPoint;

    constructor(address entryPoint) {
        _entryPoint = entryPoint;
    }    
    
    /**
     * Deploys a new Account using CREATE2.
     * @param _owner   EOA that will control the Account
     * @param _salt    Arbitrary salt for deterministic address
     */
    function createAccount(address _owner, uint256 _salt)
        external
        returns (address)
    {
        address addr = getPredictedAddress(_owner, _salt);
        if (addr.code.length > 0) {
            return addr;
        }

        Account account = new Account{
            salt: bytes32(_salt)
        }(_owner, _entryPoint);

        return address(account);
    }

    /**
     * Pure address predictor – returns the address that
     * createAccount(owner, salt) *will* deploy, without deploying.
     * Matches the CREATE2 formula:
     * keccak256(0xFF ++ factory ++ salt ++ keccak256(initCode))[12:]
     *
     * @param owner  same owner you’ll pass to createAccount
     * @param salt   same salt you’ll pass to createAccount
     */
    function getPredictedAddress(address owner, uint256 salt)
        public
        view
        returns (address predicted)
    {
        // 1. Re-build the creation byte-code (constructor + args)
        bytes memory initCode = abi.encodePacked(
            type(Account).creationCode,
            abi.encode(owner, _entryPoint)
        );

        // 2. Hash as defined by the CREATE2 spec
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),            // 0xff prefix
                address(this),           // deploying factory
                bytes32(salt),           // salt (32-bytes)
                keccak256(initCode)      // hash of init code
            )
        );

        // 3. Last 20 bytes → address
        predicted = address(uint160(uint256(hash)));
    }


}