import FungibleToken from "../../contracts/std/FungibleToken.cdc"
import FUSD from "../../contracts/std/FUSD.cdc"

import Elvn from "../../contracts/sprt/Elvn.cdc"
import ElvnFUSDTreasury from "../../contracts/sprt/ElvnFUSDTreasury.cdc"

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
