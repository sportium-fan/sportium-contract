"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositElvn = void 0;
exports.depositElvn = `import FungibleToken from 0xFungibleToken
import Elvn from 0xElvn
import ElvnPackPurchaseTreasury from 0xElvnPackPurchaseTreasury

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
}

transaction(amount: UFix64) {
  // The Vault resource that holds the tokens that are being transfered
  let depositVault: @FungibleToken.Vault

  prepare(account: AuthAccount) {
      setupAccount(account: account)
        // Get a reference to the account's stored vault
        let vaultRef = account.borrow<&Elvn.Vault>(from: /storage/elvnVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the account's stored vault
        self.depositVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        ElvnPackPurchaseTreasury.depositElvn(vault: <- self.depositVault)
    }
}
`;
