import FungibleToken from "../../contracts/FungibleToken.cdc"
import Elvn from "../../contracts/Elvn.cdc"
import ElvnFUSDTreasury from "../../contracts/ElvnFUSDTreasury.cdc"

transaction(amount: UFix64) {
  // The Vault resource that holds the tokens that are being transfered
  let depositVault: @FungibleToken.Vault

  prepare(signer: AuthAccount) {
        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&Elvn.Vault>(from: /storage/elvnVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.depositVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        ElvnFUSDTreasury.depositElvn(vault: <- self.depositVault)
    }
}
