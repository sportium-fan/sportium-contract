export declare const swapElvnToFusd = "import FungibleToken from 0xFungibleToken\nimport FUSD from 0xFUSD\n\nimport Elvn from 0xElvn\nimport ElvnFUSDTreasury from 0xElvnFUSDTreasury\n\ntransaction(amount: UFix64) {\n    let fusdReceiver: &{FungibleToken.Receiver}\n    let elvnVault: @FungibleToken.Vault\n\n    prepare(account: AuthAccount) {\n        self.fusdReceiver =account \n            .getCapability(/public/fusdReceiver)\n            .borrow<&{FungibleToken.Receiver}>()\n            ?? panic(\"Unable to borrow receiver reference\")\n\n        let vaultRef = account.borrow<&Elvn.Vault>(from: /storage/elvnVault) \n            ?? panic(\"Could not borrow reference to the owner's Vault!\")\n\n        self.elvnVault <- vaultRef.withdraw(amount: amount)\n    }\n\n    execute {\n        let elvnVault <- self.elvnVault as! @Elvn.Vault\n        let fusdVault <- ElvnFUSDTreasury.swapElvnToFUSD(vault: <- elvnVault)\n\n        self.fusdReceiver.deposit(from: <- fusdVault)\n    }\n}\n";
