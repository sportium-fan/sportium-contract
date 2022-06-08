"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyPack = void 0;
exports.buyPack = `import FungibleToken from 0xstd/FungibleToken

import Pack from 0xsprt/Pack
import Elvn from 0xsprt/Elvn

transaction(releaseId: UInt64) {
	let collection: &Pack.Collection

	let vault: @Elvn.Vault

    prepare(account: AuthAccount) {
	    let vaultRef = account.borrow<&Elvn.Vault>(from: /storage/elvnVault) 
			?? panic("Could not borrow reference to the owner's Vault!")
		
		let packPrice = Pack.getPackPrice(releaseId: releaseId)
		self.vault <- vaultRef.withdraw(amount: packPrice) as! @Elvn.Vault

		self.collection = account.borrow<&Pack.Collection>(from: Pack.CollectionStoragePath) 
			?? panic("Colud not borrow reference to the owner's Collection!")
    }

	execute {
		self.collection
			.deposit(
				token: <- Pack.buyPack(releaseId: releaseId, vault: <- self.vault)
			)
	}
}
`;
