// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@account-abstraction/contracts/interfaces/IPaymaster.sol";

contract Paymaster is IPaymaster {
    
    function validatePaymasterUserOp(
        PackedUserOperation calldata ,
        bytes32 ,
        uint256 
    ) external returns (bytes memory context, uint256 validationData){
        context = new bytes(0);
        validationData = 0;
    }


    function postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost,
        uint256 actualUserOpFeePerGas
    ) external{}
}
