import FungibleToken from "../../contracts/FungibleToken.cdc"
import Elvn from "../../contracts/Elvn.cdc"
import FUSD from "../../contracts/FUSD.cdc"
import ElvnFUSDTreasury from "../../contracts/ElvnFUSDTreasury.cdc"

transaction(amount: UFix64) {
    let fusdReceiver: &{FungibleToken.Receiver}
    let elvnVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        self.fusdReceiver = signer
            .getCapability(/public/fusdReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")

        let vaultRef = signer.borrow<&Elvn.Vault>(from: /storage/elvnVault) 
            ?? panic("Could not borrow reference to the owner's Vault!")
        self.elvnVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        let elvnVault <- self.elvnVault as! @Elvn.Vault
        let fusdVault <- ElvnFUSDTreasury.swapElvnToFUSD(vault: <- elvnVault)

        self.fusdReceiver.deposit(from: <- fusdVault)
    }
}
