import FungibleToken from "../../contracts/std/FungibleToken.cdc"
import FUSD from "../../contracts/std/FUSD.cdc"

import ElvnFUSDTreasury from "../../contracts/sprt/ElvnFUSDTreasury.cdc"

transaction(amount: UFix64) {
  // The Vault resource that holds the tokens that are being transfered
  let depositVault: @FungibleToken.Vault

  prepare(account: AuthAccount) {
        // Get a reference to the account's stored vault
        let vaultRef = account.borrow<&FUSD.Vault>(from: /storage/fusdVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the account's stored vault
        self.depositVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        ElvnFUSDTreasury.depositFUSD(vault: <- self.depositVault)
    }
}
