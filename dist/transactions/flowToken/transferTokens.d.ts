export declare const transferTokens = "import FungibleToken from 0xFungibleToken;\nimport FlowToken from 0xFlowToken;\n\ntransaction(amount: UFix64, to: Address) {\n\n    // The Vault resource that holds the tokens that are being transferred\n    let sentVault: @FungibleToken.Vault\n\n    prepare(signer: AuthAccount) {\n\n        // Get a reference to the signer's stored vault\n        let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)\n\t\t\t?? panic(\"Could not borrow reference to the owner's Vault!\")\n\n        // Withdraw tokens from the signer's stored vault\n        self.sentVault <- vaultRef.withdraw(amount: amount)\n    }\n\n    execute {\n\n        // Get a reference to the recipient's Receiver\n        let receiverRef =  getAccount(to)\n            .getCapability(/public/flowTokenReceiver)\n            .borrow<&{FungibleToken.Receiver}>()\n\t\t\t?? panic(\"Could not borrow receiver reference to the recipient's Vault\")\n\n        // Deposit the withdrawn tokens in the recipient's receiver\n        receiverRef.deposit(from: <-self.sentVault)\n    }\n}\n";
