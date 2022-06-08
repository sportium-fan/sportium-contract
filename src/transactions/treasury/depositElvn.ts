export const depositElvn = `import FungibleToken from 0xstd/FungibleToken

import Elvn from 0xsprt/Elvn
import ElvnFUSDTreasury from 0xsprt/ElvnFUSDTreasury

transaction(amount: UFix64) {
  // The Vault resource that holds the tokens that are being transfered
  let depositVault: @FungibleToken.Vault

  prepare(account: AuthAccount) {
        // Get a reference to the account's stored vault
        let vaultRef = account.borrow<&Elvn.Vault>(from: /storage/elvnVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the account's stored vault
        self.depositVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        ElvnFUSDTreasury.depositElvn(vault: <- self.depositVault)
    }
}
`;
