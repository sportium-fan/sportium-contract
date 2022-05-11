import FungibleToken from "../../contracts/FungibleToken.cdc"

import Pack from "../../contracts/Pack.cdc"
import Elvn from "../../contracts/Elvn.cdc"

transaction(releaseId: UInt64, target: Address) {
	let collection: &Pack.Collection{Pack.PackCollectionPublic}

	let vault: @Elvn.Vault

    prepare(account: AuthAccount) {
	    let vaultRef = account.borrow<&Elvn.Vault>(from: /storage/elvnVault) 
			?? panic("Could not borrow reference to the owner's Vault!")
		
		let packPrice = Pack.getPackPrice(releaseId: releaseId)
		self.vault <- vaultRef.withdraw(amount: packPrice) as! @Elvn.Vault

		let account = getAccount(target)
		self.collection = account.getCapability(Pack.CollectionPublicPath)
			.borrow<&Pack.Collection{Pack.PackCollectionPublic}>()
			?? panic("Colud not borrow reference to the owner's Collection!")
    }

	execute {
		self.collection
			.deposit(
				token: <- Pack.buyPack(releaseId: releaseId, vault: <- self.vault)
			)
	}
}
