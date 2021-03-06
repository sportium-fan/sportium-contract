"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintTokens = void 0;
exports.mintTokens = `import FungibleToken from 0xFungibleToken
import FUSD from 0xFUSD

transaction(recipient: Address, amount: UFix64) {
    let tokenAdmin: &FUSD.Administrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.tokenAdmin = signer
            .borrow<&FUSD.Administrator>(from: FUSD.AdminStoragePath)
            ?? panic("Signer is not the token admin")

        self.tokenReceiver = getAccount(recipient)
            .getCapability(/public/fusdReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let minter <- self.tokenAdmin.createNewMinter()
        let mintedVault <- minter.mintTokens(amount: amount)

        self.tokenReceiver.deposit(from: <-mintedVault)

        destroy minter
    }
}
`;
