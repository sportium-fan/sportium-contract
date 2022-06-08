"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositFusd = void 0;
exports.depositFusd = `import FungibleToken from 0xstd/FungibleToken
import FUSD from 0xstd/FUSD

import ElvnFUSDTreasury from 0xsprt/ElvnFUSDTreasury

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
`;
