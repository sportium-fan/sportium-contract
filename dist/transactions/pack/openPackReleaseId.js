"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openPackReleaseId = void 0;
exports.openPackReleaseId = `import Pack from 0xPack
import Moments from 0xMoments

transaction(releaseId: UInt64) {
	let packCollection: &Pack.Collection
	let momentsCollection: &Moments.Collection

    prepare(account: AuthAccount) {
		self.packCollection = account.borrow<&Pack.Collection>(from: Pack.CollectionStoragePath) 
			?? panic("Colud not borrow reference to the owner's Pack Collection")
		self.momentsCollection = account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)
			?? panic("Colud not borrow reference to the owner's Moments Collection")
    }

	execute {
		let pack <- self.packCollection.withdrawReleaseId(releaseId: releaseId)

		let moments <- pack.openPacks()
		destroy pack

		while moments.length > 0 {
			let moment <- moments.removeFirst()
			self.momentsCollection.deposit(token: <- moment)
		}
		destroy moments
	}
}
`;
