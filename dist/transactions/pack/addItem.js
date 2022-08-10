"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addItem = void 0;
exports.addItem = `import Pack from 0xPack
import Moments from 0xMoments

// The user (tx auth) adds their Moment IDs to the Pack Contract sales items (salePacks)
transaction(releaseId: UInt64, momentsIds: [UInt64]) {
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
        let momentsList: @[Moments.NFT] <- []
        for id in momentsIds {
            let moments <- self.momentsCollectionRef.withdraw(withdrawID: id) as! @Moments.NFT
            momentsList.append(<- moments)
        }
		let pack <- self.packCollectionRef.withdrawReleaseId(releaseId: releaseId)

		self.admin.addItem(pack: <-pack, momentsList: <-momentsList)
    }
}
`;
