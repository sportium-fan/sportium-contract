import FungibleToken from "../../contracts/FungibleToken.cdc"
import FUSD from "../../contracts/FUSD.cdc"
import ElvnFUSDTreasury from "../../contracts/ElvnFUSDTreasury.cdc"

pub fun setupAccount(account: AuthAccount) {
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
  // The Vault resource that holds the tokens that are being transfered
  let depositVault: @FungibleToken.Vault

  prepare(account: AuthAccount) {
      setupAccount(account: account)
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
