import Pack from "../../contracts/sprt/Pack.cdc"

transaction(recipient: Address, releaseId: UInt64) {
	let authorCollectionRef: &Pack.Collection

    let recipientCollectionRef: &Pack.Collection{Pack.PackCollectionPublic}

    prepare(account: AuthAccount) {
        self.authorCollectionRef = account
            .borrow<&Pack.Collection>(from: Pack.CollectionStoragePath)
	        ?? panic("Could not borrow a reference to the owner's collection")
        
        self.recipientCollectionRef = getAccount(recipient)
            .getCapability(Pack.CollectionPublicPath)
            .borrow<&Pack.Collection{Pack.PackCollectionPublic}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
		let packToken <- self.authorCollectionRef.withdrawReleaseId(releaseId: releaseId)

        self.recipientCollectionRef.deposit(token: <- packToken)
    }
}
