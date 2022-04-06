import Pack from "../../contracts/Pack.cdc"

transaction(packId: UInt64) {
    let admin: &Pack.Administrator
    let packCollectionRef: &Pack.Collection

    prepare(account: AuthAccount) {
        self.admin = account
            .borrow<&Pack.Administrator>(from: /storage/sportiumPackAdministrator)
            ?? panic("Signer is not the pack admin")
        
        self.packCollectionRef = account
            .getCapability(Pack.CollectionPublicPath)
            .borrow<&Pack.Collection>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
		let pack <- self.packCollectionRef.withdraw(withdrawID: packId)		
		self.admin.addPack(token: <- pack)
    }
}
