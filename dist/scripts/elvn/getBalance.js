"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = void 0;
exports.getBalance = `import Elvn from 0xElvn
import FungibleToken from 0xFungibleToken

// This script returns an account's Elvn balance.

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    
    let vaultRef = account.getCapability(/public/elvnBalance)!.borrow<&Elvn.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
`;
