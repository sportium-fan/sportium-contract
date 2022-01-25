import FungibleToken from "../../contracts/FungibleToken.cdc"
import Elvn from "../../contracts/Elvn.cdc"
import FUSD from "../../contracts/FUSD.cdc"
import ElvnFUSDTreasury from "../../contracts/ElvnFUSDTreasury.cdc"

pub fun setupAccount(account: AuthAccount) {
    if account.borrow<&Elvn.Vault>(from: /storage/elvnVault) == nil {
        // Create a new Elvn Vault and put it in storage
        account.save(<-Elvn.createEmptyVault(), to: /storage/elvnVault)

        // Create a public capability to the stored Vault that only exposes
        // the `deposit` method through the `Receiver` interface
        //
        account.link<&Elvn.Vault{FungibleToken.Receiver}>(
            /public/elvnReceiver,
            target: /storage/elvnVault
        )

        // Create a public capability to the stored Vault that only exposes
        // the `balance` field through the `Balance` interface
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
    let elvnReceiver: &{FungibleToken.Receiver}
    let fusdVault: @FungibleToken.Vault

    prepare(account: AuthAccount) {
        setupAccount(account: account)

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
