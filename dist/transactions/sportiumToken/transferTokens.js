"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferTokens = void 0;
exports.transferTokens = `import FungibleToken from 0xFungibleToken

import TeleportedSportiumToken from 0xTeleportedSportiumToken

transaction(amount: UFix64, recipient: Address) {

  // The Vault resource that holds the tokens that are being transfered
  let sentVault: @FungibleToken.Vault

  prepare(signer: AuthAccount) {
    // Get a reference to the signer's stored vault
    let vaultRef = signer.borrow<&TeleportedSportiumToken.Vault>(from: TeleportedSportiumToken.TokenStoragePath)
      ?? panic("Could not borrow reference to the owner's Vault!")

    // Withdraw tokens from the signer's stored vault
    self.sentVault <- vaultRef.withdraw(amount: amount)
  }

  execute {
    // Get the recipient's public account object
    let recipientAccount = getAccount(recipient)

    // Get a reference to the recipient's Receiver
    let receiverRef = recipientAccount.getCapability(TeleportedSportiumToken.TokenPublicReceiverPath)
      .borrow<&{FungibleToken.Receiver}>()
      ?? panic("Could not borrow receiver reference to the recipient's Vault")

    // Deposit the withdrawn tokens in the recipient's receiver
    receiverRef.deposit(from: <-self.sentVault)
  }
}
`;
