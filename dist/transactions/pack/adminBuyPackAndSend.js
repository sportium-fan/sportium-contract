"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminBuyPackAndSend = void 0;
exports.adminBuyPackAndSend = `import FungibleToken from 0xFungibleToken

import Pack from 0xPack
import Elvn from 0xElvn

transaction(releaseId: UInt64, target: Address) {
    let tokenAdmin: &Elvn.Administrator

	let collection: &Pack.Collection{Pack.PackCollectionPublic}

    prepare(account: AuthAccount) {
		self.tokenAdmin = account
 	       .borrow<&Elvn.Administrator>(from: /storage/elvnAdmin)
 	       ?? panic("Signer is not the token admin")

		let target = getAccount(target)
		self.collection = target.getCapability(Pack.CollectionPublicPath)
			.borrow<&Pack.Collection{Pack.PackCollectionPublic}>()
			?? panic("Colud not borrow reference to the owner's Collection!")
    }

	execute {
		let packPrice = Pack.getPackPrice(releaseId: releaseId)

		let minter <- self.tokenAdmin.createNewMinter(allowedAmount: packPrice)
		let vault <- minter.mintTokens(amount: packPrice)

		self.collection
			.deposit(
				token: <- Pack.buyPack(releaseId: releaseId, vault: <- vault)
			)

        destroy minter
	}
}
`;
