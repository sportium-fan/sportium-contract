"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapElvnToFusd = void 0;
exports.swapElvnToFusd = `import FungibleToken from 0xFungibleToken
import Elvn from 0xElvn
import FUSD from 0xFUSD
import ElvnFUSDTreasury from 0xElvnFUSDTreasury


pub fun setupAccount(account: AuthAccount) {
    if account.borrow<&Elvn.Vault>(from: /storage/elvnVault) == nil {
        // Create a new Elvn Vault and put it in storage
        account.save(<-Elvn.createEmptyVault(), to: /storage/elvnVault)

        // Create a public capability to the stored Vault that only exposes
        // the deposit method through the Receiver interface
        //
        account.link<&Elvn.Vault{FungibleToken.Receiver}>(
            /public/elvnReceiver,
            target: /storage/elvnVault
        )

        // Create a public capability to the stored Vault that only exposes
        // the balance field through the Balance interface
        //
        account.link<&Elvn.Vault{FungibleToken.Balance}>(
            /public/elvnBalance,
            target: /storage/elvnVault
        )
    }

    if account.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {
        account.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)

        account.link<&FUSD.Vault{FungibleToken.Receiver}>(
            /public/fusdReceiver,
            target: /storage/fusdVault
        )

        account.link<&FUSD.Vault{FungibleToken.Balance}>(
            /public/fusdBalance,
            target: /storage/fusdVault
        )
    }
}

transaction(amount: UFix64) {
    let fusdReceiver: &{FungibleToken.Receiver}
    let elvnVault: @FungibleToken.Vault

    prepare(account: AuthAccount) {
        setupAccount(account: account)

        self.fusdReceiver =account 
            .getCapability(/public/fusdReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")

        let vaultRef = account.borrow<&Elvn.Vault>(from: /storage/elvnVault) 
            ?? panic("Could not borrow reference to the owner's Vault!")
        self.elvnVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        let elvnVault <- self.elvnVault as! @Elvn.Vault
        let fusdVault <- ElvnFUSDTreasury.swapElvnToFUSD(vault: <- elvnVault)

        self.fusdReceiver.deposit(from: <- fusdVault)
    }
}
`;
