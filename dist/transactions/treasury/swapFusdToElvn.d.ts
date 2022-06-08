export declare const swapFusdToElvn = "import FungibleToken from 0xstd/FungibleToken\nimport FUSD from 0xstd/FUSD\n\nimport Elvn from 0xsprt/Elvn\nimport ElvnFUSDTreasury from 0xsprt/ElvnFUSDTreasury\n\ntransaction(amount: UFix64) {\n    let elvnReceiver: &{FungibleToken.Receiver}\n    let fusdVault: @FungibleToken.Vault\n\n    prepare(account: AuthAccount) {\n        self.elvnReceiver =account \n            .getCapability(/public/elvnReceiver)\n            .borrow<&{FungibleToken.Receiver}>()\n            ?? panic(\"Unable to borrow receiver reference\")\n\n        let vaultRef = account.borrow<&FUSD.Vault>(from: /storage/fusdVault) \n            ?? panic(\"Could not borrow reference to the owner's Vault!\")\n            \n        self.fusdVault <- vaultRef.withdraw(amount: amount)\n    }\n\n    execute {\n        let fusdVault <- self.fusdVault as! @FUSD.Vault\n        let elvnVault <- ElvnFUSDTreasury.swapFUSDToElvn(vault: <- fusdVault)\n\n        self.elvnReceiver.deposit(from: <- elvnVault)\n    }\n}\n";
