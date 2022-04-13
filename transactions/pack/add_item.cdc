import Pack from "../../contracts/Pack.cdc"
import Moments from "../../contracts/Moments.cdc"

transaction(packId: UInt64, momentsIds: [UInt64]) {
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
		let pack <- self.packCollectionRef.withdraw(withdrawID: packId)

		self.admin.addItem(pack: <-pack, momentsList: <-momentsList)
    }
}
