"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferMoment = void 0;
exports.transferMoment = `import NonFungibleToken from 0xNonFungibleToken

import Moments from 0xMoments

transaction(recipient: Address, withdrawID: UInt64) {
    prepare(account: AuthAccount) {
        // get the recipients public account object
        let recipient = getAccount(recipient)

        // borrow a reference to the signer's NFT collection
        let collectionRef = account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        // borrow a public reference to the receivers collection
        let depositRef = recipient.getCapability(Moments.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()!

        // withdraw the NFT from the owner's collection
        let nft <- collectionRef.withdraw(withdrawID: withdrawID)

        // Deposit the NFT in the recipient's collection
        depositRef.deposit(token: <-nft)
    }
}
`;
