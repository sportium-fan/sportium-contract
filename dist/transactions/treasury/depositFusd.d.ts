export declare const depositFusd = "import FungibleToken from 0xFungibleToken\nimport FUSD from 0xFUSD\n\nimport ElvnFUSDTreasury from 0xElvnFUSDTreasury\n\ntransaction(amount: UFix64) {\n  // The Vault resource that holds the tokens that are being transfered\n  let depositVault: @FungibleToken.Vault\n\n  prepare(account: AuthAccount) {\n        // Get a reference to the account's stored vault\n        let vaultRef = account.borrow<&FUSD.Vault>(from: /storage/fusdVault)\n            ?? panic(\"Could not borrow reference to the owner's Vault!\")\n\n        // Withdraw tokens from the account's stored vault\n        self.depositVault <- vaultRef.withdraw(amount: amount)\n    }\n\n    execute {\n        ElvnFUSDTreasury.depositFUSD(vault: <- self.depositVault)\n    }\n}\n";
