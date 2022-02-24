export declare const mintTokens = "import FungibleToken from 0xFungibleToken\nimport Elvn from 0xElvn\n\ntransaction(recipient: Address, amount: UFix64) {\n    let tokenAdmin: &Elvn.Administrator\n    let tokenReceiver: &{FungibleToken.Receiver}\n\n    prepare(signer: AuthAccount) {\n        self.tokenAdmin = signer\n        .borrow<&Elvn.Administrator>(from: /storage/elvnAdmin)\n        ?? panic(\"Signer is not the token admin\")\n\n        self.tokenReceiver = getAccount(recipient)\n            .getCapability(/public/elvnReceiver)\n            .borrow<&{FungibleToken.Receiver}>()\n            ?? panic(\"Unable to borrow receiver reference\")\n    }\n\n    execute {\n        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)\n        let mintedVault <- minter.mintTokens(amount: amount)\n\n        let vault <- mintedVault as! @FungibleToken.Vault\n        self.tokenReceiver.deposit(from: <-vault)\n\n        destroy minter\n    }\n}\n";