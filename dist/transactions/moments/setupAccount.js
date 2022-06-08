"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAccount = void 0;
exports.setupAccount = `import NonFungibleToken from 0xstd/NonFungibleToken

import Moments from 0xsprt/Moments

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- Moments.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: Moments.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&Moments.Collection{NonFungibleToken.CollectionPublic, Moments.MomentsCollectionPublic}>(Moments.CollectionPublicPath, target: Moments.CollectionStoragePath)
        }
    }
}
`;
