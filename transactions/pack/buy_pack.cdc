import FungibleToken from "../../contracts/std/FungibleToken.cdc"

import Pack from "../../contracts/sprt/Pack.cdc"
import Elvn from "../../contracts/sprt/Elvn.cdc"

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
