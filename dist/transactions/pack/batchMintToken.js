"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchMintToken = void 0;
exports.batchMintToken = `import Pack from 0xsprt/Pack
import Moments from 0xsprt/Moments

transaction(recipient: Address, releaseId: UInt64, packPrice: UFix64, momentsPerCount: UInt64, packLength: UInt64) {
    let admin: &Pack.Administrator
    let adminMomentsCollectionRef: &Moments.Collection

    let recipientCollectionRef: &Pack.Collection{Pack.PackCollectionPublic}

    prepare(account: AuthAccount) {
        self.admin = account
            .borrow<&Pack.Administrator>(from: /storage/sportiumPackAdministrator)
            ?? panic("Signer is not the pack admin")
        
        self.adminMomentsCollectionRef = account
            .borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")
        
        self.recipientCollectionRef = getAccount(recipient)
            .getCapability(Pack.CollectionPublicPath)
            .borrow<&Pack.Collection{Pack.PackCollectionPublic}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
        var i = 0 as UInt64
        while i < packLength {
            let packToken <- self.admin
                .createPackToken(
                    releaseId: releaseId, 
                    price: packPrice, 
                    momentsPerCount: momentsPerCount
            )
            self.recipientCollectionRef.deposit(token: <- packToken)

            i = i +1
        }

    }
}
`;
