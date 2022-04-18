export declare const transferTokens = "import FungibleToken from 0xFungibleToken\nimport TeleportedSportiumToken from 0xTeleportedSportiumToken\n\ntransaction(amount: UFix64, recipient: Address) {\n\n  // The Vault resource that holds the tokens that are being transfered\n  let sentVault: @FungibleToken.Vault\n\n  prepare(signer: AuthAccount) {\n    // Get a reference to the signer's stored vault\n    let vaultRef = signer.borrow<&TeleportedSportiumToken.Vault>(from: TeleportedSportiumToken.TokenStoragePath)\n      ?? panic(\"Could not borrow reference to the owner's Vault!\")\n\n    // Withdraw tokens from the signer's stored vault\n    self.sentVault <- vaultRef.withdraw(amount: amount)\n  }\n\n  execute {\n    // Get the recipient's public account object\n    let recipientAccount = getAccount(recipient)\n\n    // Get a reference to the recipient's Receiver\n    let receiverRef = recipientAccount.getCapability(TeleportedSportiumToken.TokenPublicReceiverPath)\n      .borrow<&{FungibleToken.Receiver}>()\n      ?? panic(\"Could not borrow receiver reference to the recipient's Vault\")\n\n    // Deposit the withdrawn tokens in the recipient's receiver\n    receiverRef.deposit(from: <-self.sentVault)\n  }\n}\n";
