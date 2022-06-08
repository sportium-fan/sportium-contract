"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchMintMoments = void 0;
exports.batchMintMoments = `import NonFungibleToken from 0xstd/NonFungibleToken

import Moments from 0xsprt/Moments

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be run with the account that has the minter resource
// stored at path /storage/NFTMinter.

transaction(recipient: Address, metadataList: [{String: String}]) {

    // local variable for storing the minter reference
    let minter: &Moments.NFTMinter

    prepare(signer: AuthAccount) {

        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&Moments.NFTMinter>(from: Moments.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
        // get the public account object for the recipient
        let recipient = getAccount(recipient)

        // borrow the recipient's public NFT collection reference
        let receiver = recipient
            .getCapability(Moments.CollectionPublicPath)!
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        for metadata in metadataList {
            // mint the NFT and deposit it to the recipient's collection
            self.minter.mintNFT(recipient: receiver, metadata: metadata)
        }
    }
}
 `;
