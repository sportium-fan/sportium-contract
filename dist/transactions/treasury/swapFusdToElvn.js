"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapFusdToElvn = void 0;
exports.swapFusdToElvn = `import FungibleToken from 0xstd/FungibleToken
import FUSD from 0xstd/FUSD

import Elvn from 0xsprt/Elvn
import ElvnFUSDTreasury from 0xsprt/ElvnFUSDTreasury

transaction(amount: UFix64) {
    let elvnReceiver: &{FungibleToken.Receiver}
    let fusdVault: @FungibleToken.Vault

    prepare(account: AuthAccount) {
        self.elvnReceiver =account 
            .getCapability(/public/elvnReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")

        let vaultRef = account.borrow<&FUSD.Vault>(from: /storage/fusdVault) 
            ?? panic("Could not borrow reference to the owner's Vault!")
            
        self.fusdVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        let fusdVault <- self.fusdVault as! @FUSD.Vault
        let elvnVault <- ElvnFUSDTreasury.swapFUSDToElvn(vault: <- fusdVault)

        self.elvnReceiver.deposit(from: <- elvnVault)
    }
}
`;
