"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintTokens = void 0;
exports.mintTokens = `import FungibleToken from 0xFungibleToken

import Elvn from 0xElvn

// Available only to those who have deployed the Elvn Contract
// Mints Elvn to the recipient.
// 
// Only available for users with Elvn storage
transaction(recipient: Address, amount: UFix64) {
    let tokenAdmin: &Elvn.Administrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.tokenAdmin = signer
        .borrow<&Elvn.Administrator>(from: /storage/elvnAdmin)
        ?? panic("Signer is not the token admin")

        self.tokenReceiver = getAccount(recipient)
            .getCapability(/public/elvnReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
        let mintedVault <- minter.mintTokens(amount: amount)

        let vault <- mintedVault as! @FungibleToken.Vault
        self.tokenReceiver.deposit(from: <-vault)

        destroy minter
    }
}
`;
