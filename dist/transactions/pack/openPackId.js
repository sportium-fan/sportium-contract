"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openPackId = void 0;
exports.openPackId = `import Pack from 0xsprt/Pack
import Moments from 0xsprt/Moments

transaction(packId: UInt64) {
	let packCollection: &Pack.Collection
	let momentsCollection: &Moments.Collection

    prepare(account: AuthAccount) {
		self.packCollection = account.borrow<&Pack.Collection>(from: Pack.CollectionStoragePath) 
			?? panic("Colud not borrow reference to the owner's Pack Collection")
		self.momentsCollection = account.borrow<&Moments.Collection>(from: Moments.CollectionStoragePath)
			?? panic("Colud not borrow reference to the owner's Moments Collection")
    }

	execute {
		let pack <- self.packCollection.withdraw(id: packId)

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
