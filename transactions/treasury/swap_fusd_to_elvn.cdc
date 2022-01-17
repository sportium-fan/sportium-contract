import FungibleToken from "../../contracts/FungibleToken.cdc"
import Elvn from "../../contracts/Elvn.cdc"
import FUSD from "../../contracts/FUSD.cdc"
import ElvnFUSDTreasury from "../../contracts/ElvnFUSDTreasury.cdc"

transaction(amount: UFix64) {
    let elvnReceiver: &{FungibleToken.Receiver}
    let fusdVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        self.elvnReceiver = signer
            .getCapability(/public/elvnReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")

        let vaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault) 
            ?? panic("Could not borrow reference to the owner's Vault!")
        self.fusdVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        let fusdVault <- self.fusdVault as! @FUSD.Vault
        let elvnVault <- ElvnFUSDTreasury.swapFUSDToElvn(vault: <- fusdVault)

        self.elvnReceiver.deposit(from: <- elvnVault)
    }
}
