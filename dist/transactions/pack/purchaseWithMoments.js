"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseWithMoments = void 0;
exports.purchaseWithMoments = `import Pack from 0xPack
import Moments from 0xMoments

transaction(releaseId: UInt64, packPrice: UFix64, momentsIdsGroup: [[UInt64]]) {
    let admin: &Pack.Administrator

    let packCollectionRef: &Pack.Collection
    let momentsCollectionRef: &Moments.Collection

    prepare(account: AuthAccount) {
        self.admin = account
            .borrow<&Pack.Administrator>(from: /storage/sportiumPackAdministrator)
            ?? panic("Signer is not the pack admin")
        
        self.packCollectionRef = account
            .borrow<&Pack.Collection>(from: Pack.CollectionStoragePath)
            ?? panic("Unable to borrow receiver reference")

        self.momentsCollectionRef = account
            .borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)
            ?? panic("Unable to borrow moments collection ref")
    }

    execute {
		let momentsPerCount = momentsIdsGroup[0].length
		for momentsIds in momentsIdsGroup {
			assert(momentsIds.length == momentsPerCount, message: "Not equal moments ids length")

			let packToken <- self.admin
				.createPackToken(
					releaseId: releaseId, 
					price: packPrice, 
					momentsPerCount: UInt64(momentsPerCount)
			)
			let momentsList: @[Moments.NFT] <- []
        	for id in momentsIds {
				let moments <- self.momentsCollectionRef.withdraw(withdrawID: id) as! @Moments.NFT
				momentsList.append(<- moments)
        	}
			self.admin.addItem(pack: <-packToken, momentsList: <-momentsList)
		}

    }
}
 `;
